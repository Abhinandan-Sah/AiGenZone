import express from "express"
import { authenticateToken, type AuthRequest } from "../middleware/auth"
import { Session } from "../models/Session"
import { Component } from "../models/Component"
import { ChatMessage } from "../models/ChatMessage"
import { redisClient } from "../utils/redis"

const router = express.Router()

// Get all sessions for user
router.get("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user._id

    const sessions = await Session.find({ userId, isActive: true })
      .sort({ updatedAt: -1 })
      .select("name description createdAt updatedAt")

    // Get component count for each session
    const sessionsWithCounts = await Promise.all(
      sessions.map(async (session) => {
        const componentCount = await Component.countDocuments({
          sessionId: session._id,
          isActive: true,
        })
        const messageCount = await ChatMessage.countDocuments({
          sessionId: session._id,
        })

        return {
          ...session.toObject(),
          componentCount,
          messageCount,
        }
      }),
    )

    res.json({ sessions: sessionsWithCounts })
  } catch (error) {
    next(error)
  }
})

// Create new session
router.post("/", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { name, description } = req.body
    const userId = req.user._id

    if (!name) {
      return res.status(400).json({ error: "Session name is required" })
    }

    const session = new Session({
      userId,
      name,
      description,
    })

    await session.save()

    res.status(201).json({
      message: "Session created successfully",
      session,
    })
  } catch (error) {
    next(error)
  }
})

// Get session details
router.get("/:sessionId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params
    const userId = req.user._id

    // Check cache first
    const cachedSession = await redisClient.getCachedSession(sessionId)
    if (cachedSession && cachedSession.session.userId.toString() === userId.toString()) {
      return res.json(cachedSession)
    }

    const session = await Session.findOne({ _id: sessionId, userId, isActive: true })
    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }

    // Get components for this session
    const components = await Component.find({
      sessionId,
      isActive: true,
    }).sort({ version: -1, updatedAt: -1 })

    // Get chat messages
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .populate("metadata.componentId", "name version")

    const sessionData = {
      session,
      components,
      messages,
      currentComponent: components[0] || null,
    }

    // Cache the session data
    await redisClient.cacheSession(sessionId, sessionData)

    res.json(sessionData)
  } catch (error) {
    next(error)
  }
})

// Update session
router.put("/:sessionId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params
    const { name, description } = req.body
    const userId = req.user._id

    const session = await Session.findOneAndUpdate(
      { _id: sessionId, userId, isActive: true },
      { name, description, updatedAt: new Date() },
      { new: true },
    )

    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }

    // Clear cache
    await redisClient.del(`session:${sessionId}`)

    res.json({
      message: "Session updated successfully",
      session,
    })
  } catch (error) {
    next(error)
  }
})

// Delete session
router.delete("/:sessionId", authenticateToken, async (req: AuthRequest, res, next) => {
  try {
    const { sessionId } = req.params
    const userId = req.user._id

    const session = await Session.findOneAndUpdate({ _id: sessionId, userId }, { isActive: false }, { new: true })

    if (!session) {
      return res.status(404).json({ error: "Session not found" })
    }

    // Soft delete related components
    await Component.updateMany({ sessionId }, { isActive: false })

    // Clear cache
    await redisClient.del(`session:${sessionId}`)

    res.json({ message: "Session deleted successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
