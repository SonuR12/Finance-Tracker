import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const s = await db.collection("user_settings").findOne({ email: session.user.email });

  return NextResponse.json({
    budgets:       s?.budgets       ?? {},
    budgetAlerts:  s?.budgetAlerts  ?? true,
    notifications: s?.notifications ?? [true, true, true, true, true],
    twoFA:         s?.twoFA         ?? false,
    loginNotif:    s?.loginNotif    ?? true,
    analytics:     s?.analytics     ?? true,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { budgets, budgetAlerts, notifications, twoFA, loginNotif, analytics } = body;

  const db = await getDb();
  await db.collection("user_settings").updateOne(
    { email: session.user.email },
    { $set: { budgets, budgetAlerts, notifications, twoFA, loginNotif, analytics, email: session.user.email, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
