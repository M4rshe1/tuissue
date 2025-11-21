import Redis from "ioredis";
import { env } from "@/env";

let redis: Redis | null = null;

export function getRedisClient(): Redis | null {
  if (!env.REDIS_URL) {
    return null;
  }

  if (redis) {
    return redis;
  }

  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    return redis;
  } catch (error) {
    console.error("Failed to create Redis client:", error);
    return null;
  }
}

export async function closeRedisConnection() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
