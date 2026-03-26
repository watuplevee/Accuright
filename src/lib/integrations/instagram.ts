export interface InstagramPost {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface InstagramMediaResponse {
  data: InstagramPost[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

// In-memory cache with 1 hour TTL
interface CacheEntry {
  data: InstagramPost[];
  expiresAt: number;
}

const cache: Map<string, CacheEntry> = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCached(key: string): InstagramPost[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: InstagramPost[]): void {
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

export async function fetchInstagramFeed(limit: number = 9): Promise<InstagramPost[]> {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN environment variable is not set');
  }
  if (!businessAccountId) {
    throw new Error('INSTAGRAM_BUSINESS_ACCOUNT_ID environment variable is not set');
  }

  const cacheKey = `feed:${businessAccountId}:${limit}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return cached;
  }

  const fields = 'id,caption,media_url,permalink,timestamp,media_type';
  const url = new URL(`https://graph.instagram.com/${businessAccountId}/media`);
  url.searchParams.set('fields', fields);
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('access_token', accessToken);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    // Bypass Next.js cache since we manage our own
    next: { revalidate: 0 },
  } as RequestInit);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Instagram Graph API error ${response.status}: ${errorText}`);
  }

  const json: InstagramMediaResponse = await response.json();
  const posts = json.data ?? [];

  setCache(cacheKey, posts);

  return posts;
}
