// Anthropic client and AI helper functions
import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

export const AI_MODEL = "claude-sonnet-4-6";

export const SYSTEM_PROMPT = `You are a helpful AI assistant. You are knowledgeable, concise, and friendly.
Provide accurate and useful responses. If you don't know something, say so clearly.
You can customize this system prompt to fit your specific use case.`;
