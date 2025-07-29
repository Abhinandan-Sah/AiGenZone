import mongoose, { type Document, Schema } from "mongoose"

export interface IComponent extends Document {
  sessionId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  description?: string
  jsxCode: string
  cssCode: string
  version: number
  isActive: boolean
  metadata: {
    framework: string
    dependencies: string[]
    props?: any
  }
  createdAt: Date
  updatedAt: Date
}

const ComponentSchema = new Schema<IComponent>(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    jsxCode: {
      type: String,
      required: true,
    },
    cssCode: {
      type: String,
      default: "",
    },
    version: {
      type: Number,
      default: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      framework: {
        type: String,
        default: "react",
      },
      dependencies: [
        {
          type: String,
        },
      ],
      props: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
ComponentSchema.index({ sessionId: 1, version: -1 })
ComponentSchema.index({ userId: 1, updatedAt: -1 })

export const Component = mongoose.model<IComponent>("Component", ComponentSchema)
