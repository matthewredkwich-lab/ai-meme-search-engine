import { Redis } from '@upstash/redis';
import { Index } from '@upstash/vector';
import { Meme } from './schema';

// Initialize Upstash Vector client with the memes index
export const memesIndex = new Index({
  url: process.env.UPSTASH_VECTOR_URL!,
  token: process.env.UPSTASH_VECTOR_TOKEN!,
});

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Redis cache TTL (default 24 hours)
export const REDIS_CACHE_TTL = parseInt(process.env.REDIS_CACHE_TTL || '86400');

// Rate limiting settings
export const RATE_LIMIT = {
  requests: parseInt(process.env.RATE_LIMIT_REQUESTS || '50'),
  window: parseInt(process.env.RATE_LIMIT_WINDOW || '60'), // seconds
};
