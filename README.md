# AI Meme Search Engine

A meme search engine powered by semantic search technology. This application allows you to search for memes using natural language, finding both direct text matches and semantically similar content.

https://github.com/user-attachments/assets/ae168eb1-30a7-4cc2-bfdc-dd9206968cb4

## Features

- **Semantic Search**: Find memes based on their semantic meaning, not just keywords
- **Direct Matching**: Standard text-based search is also supported
- **Fast Performance**: Results are cached for quick repeat searches
- **Rate Limiting**: Protects the API from abuse

## Tech Stack

- **Next.js 15**: For the frontend and API routes
- **Vercel Blob**: For meme image storage
- **Upstash Vector**: For vector embeddings storage
- **Upstash Redis**: For caching and rate limiting
- **OpenAI Embeddings**: For generating semantic embeddings

## Implementation Details

This project is based on [Vercel Labs' Semantic Image Search](https://github.com/vercel-labs/semantic-image-search), but with several key differences:

1. Uses Upstash Vector instead of PostgreSQL/pgvector for storing embeddings
2. Uses Upstash Redis for caching search results and implementing rate limiting
3. Optimized for meme content rather than general images

## Getting Started

### Prerequisites

You'll need accounts with:
- [Vercel](https://vercel.com)
- [Upstash](https://upstash.com) (for both Vector and Redis)
- [OpenAI](https://openai.com) (for embeddings)

### Environment Setup

Create a `.env.local` file with the following variables:

```
# OpenAI
OPENAI_API_KEY=

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=

# Upstash Vector
UPSTASH_VECTOR_URL=
UPSTASH_VECTOR_TOKEN=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Redis Cache TTL in seconds (24 hours)
REDIS_CACHE_TTL=86400

# Rate Limiting
RATE_LIMIT_REQUESTS=50
RATE_LIMIT_WINDOW=60
```

### Installation

```bash
npm install
npm run dev
```

## Deployment

Deploy to Vercel with:

```bash
vercel
```

Be sure to set up all the environment variables in your Vercel project settings.

## How It Works

1. User enters a search query
2. System checks Redis cache for existing results
3. If no cache hit, the system:
   - Generates embeddings from the query
   - Searches for direct matches in titles and descriptions
   - Performs vector similarity search for semantic matches
   - Combines and deduplicates results
   - Caches the results in Redis
4. Results are displayed to the user
