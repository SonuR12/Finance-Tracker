import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function computeDashboardData(email: string) {
  const db = await getDb();
  const doc = await db.collection("dashboard_data").findOne({ email });
  if (!doc) return null;
  const { _id, email: _email, updatedAt, ...data } = doc as any;
  return data;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await computeDashboardData(session.user.email);
  if (!data) return NextResponse.json({ error: "No data found" }, { status: 404 });
  return NextResponse.json(data);
}
