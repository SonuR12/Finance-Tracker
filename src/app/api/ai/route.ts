import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { chat } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const limited = rateLimit(req, 20, 60_000)
  if (limited) return limited

  try {
    const { messages, context } = await req.json();

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const reply = await chat(messages, context);
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("[AI Chat]", err);
    const status = err?.status ?? 500;
    const isQuota = status === 429;
    return NextResponse.json(
      { error: isQuota
          ? "AI quota exceeded. Please wait a moment and try again."
          : err?.message ?? "AI service error" },
      { status }
    );
  }
}
