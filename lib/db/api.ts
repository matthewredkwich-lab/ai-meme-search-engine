"use server";

import { Meme } from "./schema";
import { REDIS_CACHE_TTL, RATE_LIMIT, memesIndex, redis } from ".";
import { generateEmbedding } from "../ai/utils";
import { headers } from "next/headers";

// Rate limiting implementation
async function checkRateLimit(ip: string): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - RATE_LIMIT.window;
  
  // Remove old entries
  await redis.zremrangebyscore(`ratelimit:${ip}`, 0, windowStart);
  
  // Count requests in the current window
  const requestCount = await redis.zcount(`ratelimit:${ip}`, windowStart, '+inf');
  
  // If under limit, add this request and return true
  if (requestCount < RATE_LIMIT.requests) {
    await redis.zadd(`ratelimit:${ip}`, { score: now, member: now.toString() });
    return true;
  }
  
  return false;
}

// Find memes similar to the query using vector search
export const findSimilarMemes = async (description: string): Promise<Meme[]> => {
  const embedding = await generateEmbedding(description);
  
  const results = await memesIndex.query({
    vector: embedding,
    includeMetadata: true,
    topK: 60,
    includeVectors: false,
  });
  
  return results.map((result: any) => ({
    id: String(result.id),
    title: result.metadata?.title || '',
    description: result.metadata?.description || '',
    path: result.metadata?.path || '',
    embedding: [],
    similarity: result.score,
  }));
};

// Find memes by text query (for direct matches)
export const findMemesByQuery = async (query: string): Promise<Meme[]> => {
  const normalizedQuery = query.toLowerCase();
  
  // Use range to fetch all memes
  const allMemesResult = await memesIndex.range({
    cursor: 0,
    limit: 200,
    includeMetadata: true,
  });
  
  // Convert range result to array for filtering
  const allMemes = Array.isArray(allMemesResult) ? allMemesResult : [];
  
  // Filter memes that match the query
  const matches = allMemes.filter((item: any) => {
    const title = String(item.metadata?.title || '').toLowerCase();
    const description = String(item.metadata?.description || '').toLowerCase();
    
    return title.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
  
  return matches.map((result: any) => ({
    id: String(result.id),
    title: String(result.metadata?.title || ''),
    description: String(result.metadata?.description || ''),
    path: String(result.metadata?.path || ''),
    embedding: [],
    similarity: 1, // Direct match gets highest similarity
  }));
};

// Helper function to remove duplicates from results
function uniqueItemsByTitle(items: Meme[]): Meme[] {
  const seenTitles = new Set<string>();
  const uniqueItems: Meme[] = [];

  for (const item of items) {
    if (!seenTitles.has(item.title)) {
      seenTitles.add(item.title);
      uniqueItems.push(item);
    }
  }

  return uniqueItems;
}

// Main function to get memes based on query
export const getMemes = async (
  query?: string,
): Promise<{ memes: Meme[]; error?: Error }> => {
  try {
    // Get client IP for rate limiting
    let ip = 'unknown';
    try {
      const headersList = await headers();
      ip = headersList.get('x-forwarded-for') || 'unknown';
    } catch (e) {
      console.warn('Unable to get IP address for rate limiting', e);
    }
    
    const isAllowed = await checkRateLimit(ip);
    
    if (!isAllowed) {
      return { 
        memes: [], 
        error: new Error("Rate limit exceeded. Please try again later.") 
      };
    }
    
    // Create cache key
    const cacheKey = query
      ? `q:${query.toLowerCase().replaceAll(" ", "_")}`
      : "all_memes";
    
    // Check cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      // Handle the case where cached might be an object or a string
      try {
        if (typeof cached === 'string') {
          return { memes: JSON.parse(cached) };
        } else {
          // If it's already an object, just use it
          return { memes: cached as Meme[] };
        }
      } catch (error) {
        console.error("Error parsing cached data:", error);
        // Continue with fresh search if cache parsing fails
      }
    }
    
    // If not in cache, perform the search
    if (!query || query.length < 3) {
      // For empty or short queries, return a limited set of memes
      const allMemesResult = await memesIndex.range({
        cursor: 0,
        limit: 50,
        includeMetadata: true,
      });
      
      // Convert range result to array
      const allMemes = Array.isArray(allMemesResult) ? allMemesResult : [];
      
      const results = allMemes.map((result: any) => ({
        id: String(result.id),
        title: String(result.metadata?.title || ''),
        description: String(result.metadata?.description || ''),
        path: String(result.metadata?.path || ''),
        embedding: [],
      }));
      
      // Cache the results - make sure to stringify before storing
      await redis.set(cacheKey, JSON.stringify(results), { ex: REDIS_CACHE_TTL });
      
      return { memes: results };
    } else {
      // For longer queries, perform both direct and semantic search
      const directMatches = await findMemesByQuery(query);
      const semanticMatches = await findSimilarMemes(query);
      
      // Combine results, removing duplicates
      const allMatches = uniqueItemsByTitle([...directMatches, ...semanticMatches]);
      
      // Cache the results - make sure to stringify before storing
      await redis.set(cacheKey, JSON.stringify(allMatches), { ex: REDIS_CACHE_TTL });
      
      return { memes: allMatches };
    }
  } catch (e) {
    console.error("Error fetching memes:", e);
    if (e instanceof Error) return { error: e, memes: [] };
    return {
      memes: [],
      error: new Error("Error fetching memes. Please try again."),
    };
  }
}; 