export const dynamic = "force-dynamic";

// AI chat endpoint — streams responses from Claude, enforces plan limits
import { auth } from "@/lib/auth";
import { anthropic, AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai";
import { checkAIAccess, incrementAIUsage } from "@/lib/plans";
import { z } from "zod";

const schema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const access = await checkAIAccess(session.user.id);
    if (!access.allowed) {
      return Response.json({ error: access.reason, code: "LIMIT_REACHED" }, { status: 429 });
    }

    await incrementAIUsage(session.user.id);

    const stream = await anthropic.messages.stream({
      model: AI_MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: parsed.data.messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("[AI_CHAT]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
