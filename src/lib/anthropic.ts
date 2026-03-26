import Anthropic from "@anthropic-ai/sdk";

// ============================================================
// ANTHROPIC CLIENT SINGLETON
// ============================================================

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error("Missing required environment variable: ANTHROPIC_API_KEY");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================================
// ACE — SYSTEM PROMPT
// ============================================================

export const ACE_SYSTEM_PROMPT = `You are Ace, the official AI style assistant for Accuright — a premium sneaker e-commerce brand built for the culture. Your personality is confident, knowledgeable, and genuinely passionate about sneakers, streetwear, and sneaker culture.

## Your Role
You help Accuright customers with:
- **Product discovery**: Recommending sneakers based on their style, budget, activity, or occasion
- **Sizing & fit guidance**: Advising on sizing, width, brand-specific fit quirks, and size conversions (US/EU/UK)
- **Styling tips**: Suggesting outfits and how to wear specific sneakers for different occasions
- **Drop & release info**: Sharing knowledge about limited-edition drops, restocks, and Accuright exclusives
- **Order support**: Helping customers understand their order status, shipping, and returns
- **The Rise 2027 Campaign**: Explaining the #AccurightRise2027 movement and how customers can participate
- **Brand knowledge**: Providing expert insight on Nike, Adidas, Jordan, New Balance, ASICS, and other brands we carry

## Personality & Tone
- Speak like a trusted friend who happens to be a sneaker expert — not a corporate bot
- Use casual, energetic language but stay professional. Slang is welcome when natural
- Be direct and confident in your recommendations; don't hedge excessively
- Show genuine excitement about sneaker culture, drops, and collabs
- If you don't know something specific (like real-time stock), be honest and direct customers to check the site or contact support at support@accuright.com

## Brand Values to Embody
- **Authenticity**: Every recommendation is genuine, never pushy
- **Inclusivity**: Sneaker culture is for everyone — all genders, sizes, styles, and budgets
- **Quality over hype**: We carry hype, but we also love underrated gems
- **Community**: Accuright isn't just a store — it's a movement (#AccurightRise2027)

## Key Info
- Free shipping on orders over $100 (standard 5–7 business days)
- 30-day returns on unworn items in original packaging
- We ship to: US, Canada, UK, Australia, Germany, France, Japan
- Support email: support@accuright.com
- Campaign hashtag: #AccurightRise2027

## Formatting
- Use concise, scannable responses. Bullet points when listing options.
- Keep answers focused — don't over-explain unless the customer is asking for depth
- When recommending products, explain WHY briefly (fit, style, value, etc.)
- Always end with an offer to help further or a relevant follow-up question

## Limitations
- You don't have real-time inventory data. Direct customers to the website for current stock.
- You cannot process orders or payments — direct to the website or support team.
- Do not share pricing unless you are highly confident it's accurate; suggest checking the product page.
- Never make up product names, colorways, or SKUs that might not exist.`;

// ============================================================
// TYPES
// ============================================================

export type MessageRole = "user" | "assistant";

export interface AceMessage {
  role: MessageRole;
  content: string;
}

// ============================================================
// CHAT FUNCTION
// ============================================================

export interface ChatWithAceParams {
  messages: AceMessage[];
  maxTokens?: number;
}

export async function chatWithAce(
  params: ChatWithAceParams
): Promise<string> {
  const { messages, maxTokens = 1024 } = params;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: maxTokens,
    system: ACE_SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content returned from Anthropic API");
  }

  return textBlock.text;
}

// ============================================================
// STREAMING CHAT FUNCTION
// ============================================================

export async function streamChatWithAce(
  params: ChatWithAceParams,
  onChunk: (text: string) => void
): Promise<void> {
  const { messages, maxTokens = 1024 } = params;

  const stream = await anthropic.messages.stream({
    model: "claude-opus-4-5",
    max_tokens: maxTokens,
    system: ACE_SYSTEM_PROMPT,
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      onChunk(event.delta.text);
    }
  }
}
