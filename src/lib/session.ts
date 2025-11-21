import { headers } from "next/headers";
import { auth, type Session } from "@/server/better-auth/config";
import { getRedisClient } from "./redis";

const SESSION_CACHE_TTL = 60 * 15;

function getSessionCacheKey(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((c) => c.trim());

  let sessionCookie = cookies.find((c) =>
    c.startsWith("better-auth.session_token="),
  );

  if (!sessionCookie) {
    sessionCookie = cookies.find((c) => c.startsWith("better-auth.session="));
  }

  if (!sessionCookie) {
    sessionCookie = cookies.find((c) => c.includes("session_token="));
  }

  if (!sessionCookie) return null;

  const token = sessionCookie.split("=")[1]?.split(";")[0]?.trim();
  if (!token) return null;

  return `session:${token.substring(0, 64)}`;
}

function getUserSessionsKey(userId: string): string {
  return `user:sessions:${userId}`;
}

export async function getSession(): Promise<Session | null> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie");
  const cacheKey = getSessionCacheKey(cookieHeader);

  const redis = getRedisClient();

  if (redis && cacheKey) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        try {
          const session = JSON.parse(cached) as Session;
          if (session?.user?.id && session?.session?.id) {
            return session;
          }
        } catch (parseError) {
          console.warn("Failed to parse cached session:", parseError);
        }
      }
    } catch (redisError) {
      console.warn("Redis cache read error:", redisError);
    }
  }

  const session = (await auth.api.getSession({
    headers: headersList,
  })) as Session | null;

  if (redis && cacheKey && session) {
    try {
      await redis.setex(cacheKey, SESSION_CACHE_TTL, JSON.stringify(session));

      if (session.user?.id) {
        const userSessionsKey = getUserSessionsKey(session.user.id);
        await redis.sadd(userSessionsKey, cacheKey);
        await redis.expire(userSessionsKey, SESSION_CACHE_TTL + 60);
      }
    } catch (redisError) {
      console.warn("Redis cache write error:", redisError);
    }
  }

  return session;
}

export async function invalidateSessionCache(
  cookieHeader: string | null,
): Promise<void> {
  const cacheKey = getSessionCacheKey(cookieHeader);
  if (!cacheKey) return;

  const redis = getRedisClient();
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        const session = JSON.parse(cached) as Session;
        if (session?.user?.id) {
          const userSessionsKey = getUserSessionsKey(session.user.id);
          await redis.srem(userSessionsKey, cacheKey);
        }
      }

      await redis.del(cacheKey);
    } catch (error) {
      console.warn("Failed to invalidate session cache:", error);
    }
  }
}

export async function invalidateSessionCacheByUserId(
  userId: string,
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const userSessionsKey = getUserSessionsKey(userId);
    const sessionKeys = await redis.smembers(userSessionsKey);

    if (sessionKeys.length > 0) {
      await redis.del(...sessionKeys);
    }

    await redis.del(userSessionsKey);
  } catch (error) {
    console.warn("Failed to invalidate session cache by user ID:", error);
  }
}

export async function invalidateSessionCacheAll() {
  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.flushall();
    } catch (error) {
      console.warn("Failed to invalidate all session caches:", error);
    }
  }
}
