import express from "express"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { geminiService } from "../services/geminiService"
import { redisClient } from "../utils/redis"
import { ChatMessage } from "../models/ChatMessage"
import { Component } from "../models/Component"
import { Session } from "../models/Session"
import { logger } from "../utils/logger"

const router = express.Router()

// Send chat message and generate component
router.post("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { message, sessionId, currentComponent } = req.body
    const userId = req.user._id

    if (!message || !sessionId) {
      return res.status(400).json({ error: "Message and session ID are required" })
    }

    // Verify session belongs to user
    const session = await Session.findOne({ _id: sessionId, userId })
    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }

    // Save user message
    const userMessage = new ChatMessage({
      sessionId,
      userId,
      role: "user",
      content: message,
    })
    await userMessage.save()

    // Check cache first
    const cacheKey = `${message}-${currentComponent?.name || "new"}`
    const cachedResponse = await redisClient.getCachedAIResponse(cacheKey)

    let aiResponse
    if (cachedResponse) {
      logger.info("Using cached AI response")
      aiResponse = cachedResponse
    } else {
      // Get chat history for context
      const chatHistory = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 }).limit(10).select("role content")

      // Generate or refine component
      if (currentComponent) {
        aiResponse = await geminiService.refineComponent(currentComponent, message)
      } else {
        aiResponse = await geminiService.generateComponent(message, chatHistory)
      }

      // Cache the response
      await redisClient.cacheAIResponse(cacheKey, aiResponse, 1800) // 30 minutes
    }

    // Save AI message
    const assistantMessage = new ChatMessage({
      sessionId,
      userId,
      role: "assistant",
      content: aiResponse.message,
      metadata: {
        model: "gemini-2.0-flash-exp",
        tokens: aiResponse.message.length, // Approximate
      },
    })
    await assistantMessage.save()

    // Save component if generated
    let savedComponent = null
    if (aiResponse.component) {
      const componentData = {
        sessionId,
        userId,
        name: aiResponse.component.name,
        description: aiResponse.component.description,
        jsxCode: aiResponse.component.jsxCode,
        cssCode: aiResponse.component.cssCode || "",
        version: currentComponent ? (currentComponent.version || 1) + 1 : 1,
        metadata: {
          framework: "react",
          dependencies: aiResponse.component.dependencies || [],
          props: aiResponse.component.props || {},
        },
      }

      if (currentComponent) {
        // Update existing component
        savedComponent = await Component.findByIdAndUpdate(currentComponent.id, componentData, { new: true })
      } else {
        // Create new component
        savedComponent = new Component(componentData)
        await savedComponent.save()
      }

      // Update assistant message with component reference
      assistantMessage.metadata = {
        ...assistantMessage.metadata,
        componentId: savedComponent._id,
      }
      await assistantMessage.save()
    }

    // Update session timestamp
    session.updatedAt = new Date()
    await session.save()

    // Cache session data
    await redisClient.cacheSession(sessionId.toString(), {
      session,
      lastComponent: savedComponent,
    })

    res.json({
      message: aiResponse.message,
      component: savedComponent,
      messageId: assistantMessage._id,
    })
  } catch (error) {
    logger.error("Chat error:", error)
    next(error)
  }
})

// Get chat history
router.get("/:sessionId/history", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params
    const userId = req.user._id

    // Verify session belongs to user
    const session = await Session.findOne({ _id: sessionId, userId })
    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .populate("metadata.componentId", "name version")

    res.json({ messages })
  } catch (error) {
    next(error)
  }
})

export default router
