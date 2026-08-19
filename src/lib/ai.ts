import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

export type AIProvider = "openai" | "gemini" | "groq";

const PROVIDER = (process.env.AI_PROVIDER ?? "groq") as AIProvider;

const SYSTEM_PROMPT = `You are a finance-only AI assistant embedded in a personal finance tracker app.
You ONLY answer questions related to finance: personal budgeting, savings, expenses, income, investments, stocks, mutual funds, ETFs, bonds, crypto, commodities, forex, Nifty, Sensex, global markets, economic news, and financial planning.
If the user asks about anything unrelated to finance, politely decline and remind them you only assist with finance topics.
The user's preferred currency and language are provided in the context — always use that currency symbol/code for all monetary values and always respond in the user's language.
When asked about current market prices or indices (e.g. Nifty, Sensex, S&P 500), use your knowledge up to your training cutoff and clearly mention prices may have changed.

STRICT FORMATTING RULES:
- NEVER write a paragraph. Every single sentence must be on its own separate line.
- Put a newline after every sentence, no exceptions.
- Maximum 5 lines total.
- For lists use "• item" format, one item per line.
- Bold key numbers, labels, or important terms using <strong>value</strong> HTML tags.
- Keep each line short and scannable.`;

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function chat(messages: ChatMessage[], context?: string): Promise<string> {
  const systemWithContext = context
    ? `${SYSTEM_PROMPT}\n\nUser's current financial snapshot:\n${context}`
    : SYSTEM_PROMPT;

  if (PROVIDER === "openai") return chatOpenAI(messages, systemWithContext);
  if (PROVIDER === "gemini") return chatGemini(messages, systemWithContext);
  return chatGroq(messages, systemWithContext);
}

async function chatOpenAI(messages: ChatMessage[], system: string): Promise<string> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [{ role: "system", content: system }, ...messages],
    max_tokens: 200,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}

async function chatGemini(messages: ChatMessage[], system: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-2.0-flash",
    systemInstruction: system,
  });
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;
  const chatSession = model.startChat({ history });
  const result = await chatSession.sendMessage(lastMessage);
  return result.response.text() ?? "Sorry, I couldn't generate a response.";
}

async function chatGroq(messages: ChatMessage[], system: string): Promise<string> {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL ?? "qwen/qwen3.6-27b",
    messages: [{ role: "system", content: system }, ...messages],
    max_tokens: 200,
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}
