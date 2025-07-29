import mongoose, { type Document, Schema } from "mongoose"

export interface IChatMessage extends Document {
  sessionId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  role: "user" | "assistant"
  content: string
  metadata?: {
    componentId?: mongoose.Types.ObjectId
    imageUrl?: string
    tokens?: number
    model?: string
  }
  createdAt: Date
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    metadata: {
      componentId: {
        type: Schema.Types.ObjectId,
        ref: "Component",
      },
      imageUrl: String,
      tokens: Number,
      model: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
ChatMessageSchema.index({ sessionId: 1, createdAt: 1 })

export const ChatMessage = mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema)
