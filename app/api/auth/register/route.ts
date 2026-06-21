// User registration endpoint
import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return Response.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 12);
    await db.user.create({
      data: { name: parsed.data.name, email: parsed.data.email, password: hashed },
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER]", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
