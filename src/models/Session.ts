import mongoose, { type Document, Schema } from "mongoose"

export interface ISession extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
SessionSchema.index({ userId: 1, updatedAt: -1 })

export const Session = mongoose.model<ISession>("Session", SessionSchema)
