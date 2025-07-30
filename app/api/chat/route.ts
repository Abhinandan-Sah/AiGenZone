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
    const systemPrompt = `You are an expert React component generator. Generate ONLY the React component code without any explanations, descriptions, or additional text.

STRICT RULES:
1. Always name your main component "GeneratedComponent"
2. Return ONLY the TSX code in a single code block
3. No explanations, descriptions, or additional text
4. No import statements or export statements
5. Use only React hooks and Tailwind CSS
6. Make components fully functional and interactive

COMPONENT REQUIREMENTS:
- Modern React with TypeScript
- Functional components with hooks (useState, useEffect, etc.)
- Self-contained and reusable
- Responsive design with Tailwind CSS
- Interactive elements where appropriate
- Professional styling with gradients, shadows, transitions

AVAILABLE ICONS (use directly, no imports needed):
Heart, Star, ChevronDown, User, Mail, Phone, Calendar, Search, Menu, X, Plus, Edit, Settings, Home, Bell, Share, Download, Eye, Lock, Check, AlertCircle, ShoppingCart, Play, Sun, Moon, Camera, File, Link, Copy, Save, Database, Code, Smartphone, Coffee, Book, Award

RESPONSE FORMAT:
Return ONLY this format with no additional text:

\`\`\`tsx
function GeneratedComponent() {
  const [state, setState] = useState('default');
  
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* component content */}
    </div>
  );
}
\`\`\`

NO explanations. NO descriptions. ONLY the code block above.`

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

      // Extract component code from the response
      const extractComponentCode = (responseText: string) => {
        // Look for TSX code blocks - try multiple patterns
        let tsxMatch = responseText.match(/```tsx\n?([\s\S]*?)\n?```/);
        if (!tsxMatch) {
          tsxMatch = responseText.match(/```typescript\n?([\s\S]*?)\n?```/);
        }
        if (!tsxMatch) {
          tsxMatch = responseText.match(/```javascript\n?([\s\S]*?)\n?```/);
        }
        if (!tsxMatch) {
          tsxMatch = responseText.match(/```\n?([\s\S]*?)\n?```/);
        }
        
        let tsCode = tsxMatch ? tsxMatch[1].trim() : '';
        
        // Clean up the code - remove any explanatory text before/after function
        if (tsCode) {
          // Find the function definition and extract only that
          const functionMatch = tsCode.match(/(function\s+GeneratedComponent[\s\S]*?^})/m);
          if (functionMatch) {
            tsCode = functionMatch[1];
          } else {
            // Try const arrow function
            const constMatch = tsCode.match(/(const\s+GeneratedComponent[\s\S]*?^};?)/m);
            if (constMatch) {
              tsCode = constMatch[1];
            }
          }
        }
        
        // Look for CSS code blocks (optional)
        const cssMatch = responseText.match(/```css\n?([\s\S]*?)\n?```/);
        const cssCode = cssMatch ? cssMatch[1].trim() : '';
        
        // Extract component name from the TSX code
        const nameMatch = tsCode.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
        const componentName = nameMatch ? (nameMatch[1] || nameMatch[2]) : 'GeneratedComponent';
        
        // If we found valid TSX code, create a component object
        if (tsCode && (tsCode.includes('function') || tsCode.includes('const') || tsCode.includes('return'))) {
          return {
            name: componentName,
            tsx: tsCode,
            css: cssCode,
            timestamp: new Date(),
            id: Math.random().toString(36).substr(2, 9)
          };
        }
        
        // Fallback: if no code blocks found but response looks like raw TSX code
        if (!tsCode && (responseText.includes('function') || responseText.includes('const'))) {
          const cleanedResponse = responseText.trim();
          const nameMatch = cleanedResponse.match(/function\s+(\w+)|const\s+(\w+)\s*=/);
          const componentName = nameMatch ? (nameMatch[1] || nameMatch[2]) : 'GeneratedComponent';
          
          return {
            name: componentName,
            tsx: cleanedResponse,
            css: '',
            timestamp: new Date(),
            id: Math.random().toString(36).substr(2, 9)
          };
        }
        
        return null;
      };

      const component = extractComponentCode(text);
      
      // Return the formatted response with component data
      const response = {
        message: text,
        component: component,
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
