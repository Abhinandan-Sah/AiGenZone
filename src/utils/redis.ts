import Redis from "ioredis"
import { logger } from "./logger"

class RedisClient {
  private client: Redis

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number.parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    this.client.on("error", (error) => {
      logger.error("Redis error:", error)
    })

    this.client.on("connect", () => {
      logger.info("Connected to Redis")
    })
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key)
    } catch (error) {
      logger.error("Redis GET error:", error)
      return null
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value)
      } else {
        await this.client.set(key, value)
      }
      return true
    } catch (error) {
      logger.error("Redis SET error:", error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key)
      return true
    } catch (error) {
      logger.error("Redis DEL error:", error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      logger.error("Redis EXISTS error:", error)
      return false
    }
  }

  // Cache session data
  async cacheSession(sessionId: string, data: any, ttl = 3600): Promise<boolean> {
    const key = `session:${sessionId}`
    return this.set(key, JSON.stringify(data), ttl)
  }

  async getCachedSession(sessionId: string): Promise<any | null> {
    const key = `session:${sessionId}`
    const data = await this.get(key)
    return data ? JSON.parse(data) : null
  }

  // Cache AI responses
  async cacheAIResponse(prompt: string, response: any, ttl = 1800): Promise<boolean> {
    const key = `ai:${Buffer.from(prompt).toString("base64")}`
    return this.set(key, JSON.stringify(response), ttl)
  }

  async getCachedAIResponse(prompt: string): Promise<any | null> {
    const key = `ai:${Buffer.from(prompt).toString("base64")}`
    const data = await this.get(key)
    return data ? JSON.parse(data) : null
  }

  async quit(): Promise<void> {
    await this.client.quit()
  }
}

export const redisClient = new RedisClient()
