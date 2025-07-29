import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    console.log('Chat API called')
    
    // Check if API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY not found')
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }
    
    const supabase = createServerComponentClient({ cookies })
    
    // For development, skip auth temporarily or make it optional
    let user = null
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      user = authUser
      if (authError) {
        console.warn('Auth warning (skipping for development):', authError.message)
      }
    } catch (authError) {
      console.warn('Auth check failed (continuing anyway):', authError)
    }

    // For production, uncomment this to enforce authentication:
    // if (!user) {
    //   console.error('User not authenticated')
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const { messages, sessionId } = await request.json()
    console.log('Messages received:', messages?.length)

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!)
    console.log('Gemini API client initialized')

    // Create system prompt for component generation
    const systemPrompt = `You are an expert React component generator. Your task is to create high-quality, functional React components based on user descriptions.

Guidelines:
1. Generate clean, modern React components using TypeScript
2. Use Tailwind CSS for styling
3. Include proper TypeScript types and interfaces
4. Make components responsive and accessible
5. Use React hooks appropriately (useState, useEffect, etc.)
6. Include proper error handling where needed
7. Write code that's ready to copy and paste

When generating a component:
1. Provide a clear, descriptive name
2. Write clean, well-structured TSX code with proper formatting
3. Include any necessary CSS (prefer Tailwind classes)
4. Make sure the component is self-contained and functional
5. Add helpful comments for complex logic
6. Include example usage in comments

IMPORTANT: Format your response as clean, readable code blocks that users can easily copy and paste. Structure your response like this:

**Component Name:** [ComponentName]

**Description:** [Brief description of what the component does]

**TypeScript Code:**
\`\`\`tsx
[Clean, formatted TSX code here]
\`\`\`

**CSS (if needed):**
\`\`\`css
[Any additional CSS code here]
\`\`\`

**Usage Example:**
\`\`\`tsx
[Example of how to use the component]
\`\`\`

**Props Interface:**
\`\`\`tsx
[TypeScript interface for props]
\`\`\`

Make sure the code is properly formatted, well-commented, and ready for production use. Focus on clarity and ease of copying/pasting.

If the user is asking for modifications to an existing component, apply the changes incrementally and provide the complete updated code.`

    // Format messages for Gemini
    const chatHistory = messages.map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }))

    // Try multiple models with fallback
    const modelNames = ["gemini-1.5-flash", "gemini-pro"]
    let chat
    let successfulModel = ""
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`)
        const testModel = genAI.getGenerativeModel({ model: modelName })
        
        chat = testModel.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: systemPrompt }],
            },
            {
              role: "model", 
              parts: [{ text: "I understand. I'll help you create high-quality React components using TypeScript and Tailwind CSS. Please describe the component you'd like me to generate." }],
            },
            ...chatHistory.slice(0, -1) // All messages except the last one
          ],
        })
        
        successfulModel = modelName
        console.log(`Successfully initialized chat with model: ${modelName}`)
        break
      } catch (modelError: any) {
        console.log(`Model ${modelName} failed, trying next:`, modelError?.message || 'Unknown error')
        continue
      }
    }

    if (!chat) {
      console.error('All models failed to initialize')
      return NextResponse.json({ error: "AI service initialization failed" }, { status: 500 })
    }

    try {
      // Send the latest message with retry logic
      const latestMessage = messages[messages.length - 1]
      console.log('Sending message to Gemini:', latestMessage.content)
      
      let result
      let retries = 0
      const maxRetries = 3
      
      while (retries < maxRetries) {
        try {
          result = await chat.sendMessage(latestMessage.content)
          break // Success, exit retry loop
        } catch (error: any) {
          retries++
          console.log(`Attempt ${retries} failed:`, error.message)
          
          if (error.status === 503 && retries < maxRetries) {
            console.log(`Retrying in ${retries * 2} seconds...`)
            await new Promise(resolve => setTimeout(resolve, retries * 2000))
            continue
          } else {
            throw error // Re-throw if not retryable or max retries reached
          }
        }
      }
      
      if (!result) {
        throw new Error("Failed to get response after retries")
      }
      
      const text = result.response.text()
      console.log('Received response from Gemini, length:', text?.length || 0)

      // Return the formatted response directly
      const response = {
        message: text,
        component: null, // We're now returning formatted markdown instead of JSON
      }

      // Save the conversation to database (simplified for demo)
      if (sessionId && user) {
        try {
          await supabase.from("chat_messages").insert({
            session_id: sessionId,
            user_id: user.id,
            message: latestMessage.content,
            response: text,
            created_at: new Date().toISOString(),
          })
        } catch (dbError) {
          console.warn('Database save failed:', dbError)
          // Continue anyway, don't fail the request for DB issues
        }
      }

      return NextResponse.json(response)
    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
    }
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
