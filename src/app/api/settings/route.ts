import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const s = await db.collection("user_settings").findOne({ email: session.user.email });

  return NextResponse.json({
    language:        s?.language        ?? "English",
    currency:        s?.currency        ?? "USD ($)",
    showBalance:     s?.showBalance     ?? true,
    autoCategorize:  s?.autoCategorize  ?? true,
    budgets:         s?.budgets         ?? {},
    budgetAlerts:    s?.budgetAlerts    ?? true,
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // strip any fields we don't want persisted
  const { language, currency, showBalance, autoCategorize, budgets, budgetAlerts } = body;

  const db = await getDb();
  await db.collection("user_settings").updateOne(
    { email: session.user.email },
    { $set: { language, currency, showBalance, autoCategorize, budgets, budgetAlerts, email: session.user.email, updatedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ success: true });
}
