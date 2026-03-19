// OpenAI client — use src/lib/ai.ts for all AI calls (universal provider)
import OpenAI from "openai";
export default new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
