#!/usr/bin/env python3
"""
SPY_Scalp_Reviewer — Day Trader Agent

Reviews chart screenshots and trade ideas, replying with a single one-line
trade setup unless detailed analysis is explicitly requested.

Usage:
    # One-line setup (default)
    python day_trader_agent.py chart1.png chart2.png

    # With a trade idea
    python day_trader_agent.py chart1.png --idea "thinking about shorting here"

    # Request full analysis
    python day_trader_agent.py chart1.png --analyze

    # Specify ticker (default: SPY)
    python day_trader_agent.py chart1.png --ticker QQQ

Environment:
    ANTHROPIC_API_KEY  — your Anthropic API key
"""

import argparse
import base64
import os
import sys
from pathlib import Path

import anthropic

SYSTEM_PROMPT = """You are SPY_Scalp_Reviewer — a disciplined intraday scalping reviewer for SPY and other major liquid tickers.

PRIMARY TASK:
Analyze all uploaded chart screenshots and any trade idea provided, then determine the highest-probability scalp setup based on visible price structure, trend, momentum, support/resistance, range behavior, reclaim/rejection zones, and invalidation.

OUTPUT RULE — CRITICAL:
Unless the user explicitly asks for analysis, return ONLY one line in this exact format:
One-line version: <direction> <action> into <entry zone>, stop <above/below> <stop level>, target <target1> / <target2> / <target3>.

FORMAT RULE:
Do not include bullets, headers, reasoning, disclaimers, probabilities, or extra commentary unless explicitly asked for analysis.

ANALYSIS ON REQUEST:
If the user explicitly asks for analysis, provide: reasoning, timeframe alignment, key levels, trigger, invalidation, and trade management details.

DEFAULT BEHAVIOR:
- Bearish setup → give a short setup
- Bullish setup → give a long setup
- Unclear setup → return: One-line version: No trade unless price reclaims [level] for calls or rejects [level] for puts, stop [level] or [level], target [level] / [level] or [level] / [level].

CHART REVIEW RULES:
- Always review every screenshot before responding
- Use visible timeframe context: higher timeframe for bias, lower timeframe for entry
- Prioritize current price location relative to intraday highs/lows, opening range, trendlines, supply/demand zones, ATR trigger levels, and reclaim/rejection areas
- Do not chase extended candles; prefer bounce-and-fail shorts or dip-and-reclaim longs unless momentum is clearly expanding
- Include entry zone, stop level, and at least two targets in the one-line response
- Keep levels realistic and derived only from what is visible in the screenshots and the provided note
- If the trade idea is weak, improve it and return the better setup in the required one-line format
- If multiple screenshots conflict, favor the clearest alignment between higher timeframe bias and lower timeframe execution

STRICT OUTPUT EXAMPLES:
One-line version: Short a weak bounce into 651.1–651.7, stop above 652.2, target 650.2 / 649.2 / 647.3.
One-line version: Long a reclaim above 654.4–654.8, stop below 653.9, target 655.8 / 657.0 / 658.2.
One-line version: No trade unless price reclaims 652.8 for calls or rejects 651.7 for puts, stop 653.2 or 652.1, target 654.0 / 655.1 or 650.5 / 649.3."""


SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}

MEDIA_TYPES = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
}


def load_image(path: str) -> tuple[str, str]:
    """Return (base64_data, media_type) for an image file."""
    p = Path(path)
    ext = p.suffix.lower()
    if ext not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported image format '{ext}': {path}")
    with open(p, "rb") as f:
        data = base64.standard_b64encode(f.read()).decode("utf-8")
    return data, MEDIA_TYPES[ext]


def build_user_content(
    chart_paths: list[str],
    ticker: str,
    trade_idea: str | None,
    analyze: bool,
) -> list[dict]:
    """Assemble the multipart user message content."""
    content: list[dict] = []

    # Attach each chart screenshot
    for path in chart_paths:
        data, media_type = load_image(path)
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": media_type,
                "data": data,
            },
        })

    # Build the text prompt
    parts = [f"Ticker: {ticker}", "Goal: scalp"]
    if trade_idea:
        parts.append(f"Trade idea: {trade_idea}")
    if analyze:
        parts.append("Please provide full analysis.")

    content.append({"type": "text", "text": "\n".join(parts)})
    return content


def run_agent(
    chart_paths: list[str],
    ticker: str = "SPY",
    trade_idea: str | None = None,
    analyze: bool = False,
) -> str:
    """Call the Claude API and return the agent's response text."""
    client = anthropic.Anthropic()

    user_content = build_user_content(chart_paths, ticker, trade_idea, analyze)

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=1024 if not analyze else 4096,
        thinking={"type": "adaptive"},
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_content}],
    )

    text_blocks = [b.text for b in response.content if b.type == "text"]
    return "\n".join(text_blocks).strip()


def main() -> None:
    parser = argparse.ArgumentParser(
        description="SPY_Scalp_Reviewer — intraday scalping agent",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "charts",
        nargs="*",
        metavar="CHART",
        help="Path(s) to chart screenshot(s) (PNG, JPG, GIF, WebP)",
    )
    parser.add_argument(
        "--ticker",
        default="SPY",
        metavar="TICKER",
        help="Ticker symbol to analyze (default: SPY)",
    )
    parser.add_argument(
        "--idea",
        default=None,
        metavar="TEXT",
        help="Optional trade idea or note",
    )
    parser.add_argument(
        "--analyze",
        action="store_true",
        help="Request full analysis instead of one-line setup",
    )

    args = parser.parse_args()

    if not args.charts:
        parser.print_help()
        sys.exit(1)

    # Validate all paths exist before making the API call
    for path in args.charts:
        if not Path(path).is_file():
            print(f"Error: file not found — {path}", file=sys.stderr)
            sys.exit(1)

    if not os.environ.get("ANTHROPIC_API_KEY"):
        print("Error: ANTHROPIC_API_KEY environment variable is not set.", file=sys.stderr)
        sys.exit(1)

    result = run_agent(
        chart_paths=args.charts,
        ticker=args.ticker,
        trade_idea=args.idea,
        analyze=args.analyze,
    )
    print(result)


if __name__ == "__main__":
    main()
