import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim())
    return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const db = await getDb();
  await db.collection("users").updateOne(
    { email: session.user.email },
    { $set: { name: name.trim() } }
  );

  return NextResponse.json({ success: true, name: name.trim() });
}
