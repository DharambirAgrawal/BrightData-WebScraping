// src/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';
import { Redis } from 'ioredis';

class RedisStore {
  constructor() {
    this.client = new Redis(process.env.REDIS_URL);
  }

  async increment(key) {
    const hits = await this.client.incr(key);
    const ttl = await this.client.ttl(key);
    
    if (ttl === -1) {
      await this.client.expire(key, 60); // Set default expiry of 60 seconds if not set
    }
    
    return {
      totalHits: hits,
      resetTime: Date.now() + (ttl * 1000)
    };
  }

  async decrement(key) {
    return await this.client.decr(key);
  }

  async resetKey(key) {
    return await this.client.del(key);
  }
}

// Configure rate limiter options
const createLimiterOptions = (windowMs, max, message) => ({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  store: process.env.REDIS_URL ? new RedisStore() : undefined, // Use memory store if Redis URL not provided
  message: {
    status: 429,
    message: message || 'Too many requests from this IP, please try again later.',
  },
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  requestWasSuccessful: (req, res) => res.statusCode < 400, // Optionally track only successful requests
  skip: (req) => {
    // Optional: Skip rate limiting for certain routes or conditions
    const internal = req.ip.startsWith('192.168.') || req.ip === '::1';
    return internal;
  },
});

// Create different rate limiters for different routes/purposes
export const globalLimiter = rateLimit(
  createLimiterOptions(
    60 * 60 * 1000, // 1 hour window
    1000, // 1000 requests per hour
    'Too many requests, please try again later.'
  )
);

export const apiLimiter = rateLimit(
  createLimiterOptions(
    15 * 60 * 1000, // 15 minutes window
    100, // 100 requests per 15 minutes
    'Too many API requests, please try again later.'
  )
);

export const authLimiter = rateLimit(
  createLimiterOptions(
    60 * 60 * 1000, // 1 hour window
    5, // 5 attempts per hour
    'Too many authentication attempts, please try again later.'
  )
);