import { GoogleGenerativeAI } from "@google/generative-ai"
import { logger } from "../utils/logger"

class GeminiService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || "your-gemini-api-key-here"
    this.genAI = new GoogleGenerativeAI(apiKey)
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })
  }

  async generateComponent(prompt: string, chatHistory: any[] = []): Promise<any> {
    try {
      const systemPrompt = `You are AiGenZone's expert React component generator. Create high-quality, modern React components with TypeScript and Tailwind CSS.

IMPORTANT GUIDELINES:
1. Generate clean, functional React components using TypeScript
2. Use Tailwind CSS for all styling (no external CSS files unless absolutely necessary)
3. Make components responsive and accessible
4. Include proper TypeScript interfaces and types
5. Use modern React patterns (hooks, functional components)
6. Add smooth animations using Framer Motion when appropriate
7. Ensure components are self-contained and production-ready

RESPONSE FORMAT:
Return a JSON object with this exact structure:
{
  "message": "Brief description of the component created",
  "component": {
    "name": "ComponentName",
    "description": "Detailed description",
    "jsxCode": "// Complete TSX component code here",
    "cssCode": "/* Additional CSS if needed */",
    "dependencies": ["framer-motion", "lucide-react"],
    "props": {
      "propName": "propType"
    }
  }
}

COMPONENT REQUIREMENTS:
- Use TypeScript interfaces for props
- Include proper error handling
- Add loading states where appropriate
- Make it responsive (mobile-first)
- Include hover effects and smooth transitions
- Use semantic HTML elements
- Add proper ARIA attributes for accessibility

USER REQUEST: ${prompt}`

      const result = await this.model.generateContent(systemPrompt)
      const response = await result.response
      const text = response.text()

      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0])
          return parsedResponse
        }
      } catch (parseError) {
        logger.warn("Failed to parse JSON response, returning raw text")
      }

      // Fallback response
      return {
        message: text,
        component: null,
      }
    } catch (error: any) {
      logger.error("Gemini API error:", error)
      throw new Error(`Failed to generate component: ${error.message}`)
    }
  }

  async refineComponent(currentComponent: any, refinementPrompt: string): Promise<any> {
    try {
      const systemPrompt = `You are refining an existing React component. Apply the requested changes while maintaining the component's structure and functionality.

CURRENT COMPONENT:
Name: ${currentComponent.name}
JSX Code:
${currentComponent.jsxCode}

CSS Code:
${currentComponent.cssCode}

REFINEMENT REQUEST: ${refinementPrompt}

Return the updated component in the same JSON format:
{
  "message": "Description of changes made",
  "component": {
    "name": "ComponentName",
    "description": "Updated description",
    "jsxCode": "// Updated TSX code",
    "cssCode": "/* Updated CSS */",
    "dependencies": ["array", "of", "dependencies"],
    "props": {}
  }
}`

      const result = await this.model.generateContent(systemPrompt)
      const response = await result.response
      const text = response.text()

      // Try to parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsedResponse = JSON.parse(jsonMatch[0])
          return parsedResponse
        }
      } catch (parseError) {
        logger.warn("Failed to parse JSON response for refinement")
      }

      return {
        message: text,
        component: currentComponent, // Return original if parsing fails
      }
    } catch (error: any) {
      logger.error("Gemini refinement error:", error)
      throw new Error(`Failed to refine component: ${error.message}`)
    }
  }
}

export const geminiService = new GeminiService()
