import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const dynamic = 'force-dynamic';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Ace, the AI sneaker expert for Accuright — the premier destination for authentic, curated sneakers. You have deep knowledge of:

- Sneaker culture, history, and iconic releases (Jordan, Yeezy, Nike Dunk, New Balance, Adidas, etc.)
- Sneaker authentication and spotting counterfeits
- Sizing guides, fit recommendations, and comfort for different foot types
- Care, cleaning, and long-term preservation of sneakers
- Current market values, upcoming releases, and limited-edition drops
- Styling advice — how to pair sneakers with different outfits
- The Accuright product catalog, sizing, and collections

You are enthusiastic, knowledgeable, and concise. You speak like a fellow sneakerhead while remaining professional. When you don't know the exact current inventory, direct customers to browse the Accuright website or contact support. Never fabricate product availability or pricing — instead guide users to check the site for real-time information.

Keep responses helpful and focused. If a user asks about authentication concerns about a purchase from Accuright, reassure them that all Accuright products are 100% authentic and backed by our verification guarantee.`;

// In-memory rate limit store: IP -> { count, windowStart }
interface RateLimitEntry {
  count: number;
  windowStart: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const resetAt = entry.windowStart + RATE_LIMIT_WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  entry.count += 1;
  const resetAt = entry.windowStart + RATE_LIMIT_WINDOW_MS;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt };
}

// Periodically clean up expired rate limit entries to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Run cleanup every 10 minutes

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting by IP
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      req.headers.get('x-real-ip') ??
      'unknown';

    const { allowed, remaining, resetAt } = checkRateLimit(ip);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor(resetAt / 1000)),
            'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const messages: ChatMessage[] = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required and must not be empty' },
        { status: 400 }
      );
    }

    // Validate message structure
    for (const msg of messages) {
      if (!msg.role || !msg.content || !['user', 'assistant'].includes(msg.role)) {
        return NextResponse.json(
          { error: 'Each message must have a valid role ("user" or "assistant") and content' },
          { status: 400 }
        );
      }
    }

    const stream = await client.messages.stream({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    return new Response(stream.toReadableStream(), {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(Math.floor(resetAt / 1000)),
      },
    });
  } catch (error) {
    console.error('[POST /api/chat]', error);
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `AI service error: ${error.message}` },
        { status: error.status ?? 500 }
      );
    }
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
