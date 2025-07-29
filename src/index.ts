import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import dotenv from "dotenv"
import mongoose from "mongoose"
import { createServer } from "http"

import authRoutes from "./routes/auth"
import chatRoutes from "./routes/chat"
import sessionRoutes from "./routes/sessions"
import exportRoutes from "./routes/export"
import { errorHandler } from "./middleware/errorHandler"
import { logger } from "./utils/logger"
import { redisClient } from "./utils/redis"

dotenv.config()

const app = express()
const server = createServer(app)
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/sessions", sessionRoutes)
app.use("/api/export", exportRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// Error handling
app.use(errorHandler)

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/aigenzone")
  .then(() => {
    logger.info("Connected to MongoDB")
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error)
    process.exit(1)
  })

// Redis connection
redisClient.on("connect", () => {
  logger.info("Connected to Redis")
})

redisClient.on("error", (error) => {
  logger.error("Redis connection error:", error)
})

// Start server
server.listen(PORT, () => {
  logger.info(`AiGenZone server running on port ${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully")
  server.close(() => {
    mongoose.connection.close()
    redisClient.quit()
    process.exit(0)
  })
})
