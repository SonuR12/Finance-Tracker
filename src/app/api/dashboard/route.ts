import { auth } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

const SEED_DATA = {
  stats: {
    totalBalance: 24680,
    monthlyIncome: 5400,
    monthlyExpenses: 3600,
    totalSavings: 1800,
  },
  monthlyData: [
    { month: "Jul", income: 4200, expenses: 2800 },
    { month: "Aug", income: 4800, expenses: 3100 },
    { month: "Sep", income: 4500, expenses: 2600 },
    { month: "Oct", income: 5200, expenses: 3400 },
    { month: "Nov", income: 4900, expenses: 3200 },
    { month: "Dec", income: 6100, expenses: 4100 },
    { month: "Jan", income: 5400, expenses: 3600 },
  ],
  spendingByCategory: [
    { name: "Housing",       value: 1200, color: "#ef4444" },
    { name: "Food",          value: 680,  color: "#f43f5e" },
    { name: "Transport",     value: 420,  color: "#f97316" },
    { name: "Entertainment", value: 310,  color: "#8b5cf6" },
    { name: "Healthcare",    value: 250,  color: "#14b8a6" },
    { name: "Shopping",      value: 540,  color: "#ec4899" },
  ],
  weeklySpending: [
    { day: "Mon", amount: 120 },
    { day: "Tue", amount: 85  },
    { day: "Wed", amount: 210 },
    { day: "Thu", amount: 95  },
    { day: "Fri", amount: 340 },
    { day: "Sat", amount: 280 },
    { day: "Sun", amount: 160 },
  ],
  transactions: [
    { id: 1, name: "Netflix",        category: "Entertainment", amount: -15.99,  date: "Today, 2:30 PM",  icon: "🎬" },
    { id: 2, name: "Salary",         category: "Income",        amount: 5400,    date: "Today, 9:00 AM",  icon: "💰" },
    { id: 3, name: "Whole Foods",    category: "Groceries",     amount: -87.43,  date: "Yesterday",       icon: "🛒" },
    { id: 4, name: "Uber",           category: "Transport",     amount: -12.50,  date: "Yesterday",       icon: "🚗" },
    { id: 5, name: "Gym Membership", category: "Health",        amount: -49.99,  date: "Jan 14",          icon: "💪" },
    { id: 6, name: "Amazon",         category: "Shopping",      amount: -134.20, date: "Jan 13",          icon: "📦" },
    { id: 7, name: "Freelance",      category: "Income",        amount: 850,     date: "Jan 12",          icon: "💻" },
    { id: 8, name: "Electric Bill",  category: "Utilities",     amount: -92.00,  date: "Jan 11",          icon: "⚡" },
  ],
  budgets: [
    { category: "Food & Dining", spent: 680, limit: 800,  color: "#f43f5e" },
    { category: "Transport",     spent: 420, limit: 500,  color: "#f97316" },
    { category: "Shopping",      spent: 540, limit: 600,  color: "#ec4899" },
    { category: "Entertainment", spent: 310, limit: 300,  color: "#8b5cf6" },
    { category: "Health",        spent: 250, limit: 400,  color: "#14b8a6" },
    { category: "Utilities",     spent: 92,  limit: 200,  color: "#06b6d4" },
  ],
  aiInsights: [
    { type: "warning", title: "Entertainment over budget",  desc: "You've exceeded your entertainment budget by $10. Consider cutting streaming services.", icon: "⚠️" },
    { type: "tip",     title: "Great savings this month!",  desc: "You saved 33% of your income this month — $200 more than last month. Keep it up!",    icon: "🎉" },
    { type: "info",    title: "Recurring charge detected",  desc: "Amazon Prime renews in 3 days for $14.99. Make sure you still need this subscription.", icon: "🔔" },
    { type: "tip",     title: "Investment opportunity",     desc: "Based on your savings rate, you could invest $500/month and grow wealth by $72K in 10 years.", icon: "📈" },
  ],
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const doc = await db.collection("dashboard_data").findOne({ email: session.user.email });

  if (!doc) {
    await db.collection("dashboard_data").insertOne({ email: session.user.email, ...SEED_DATA, updatedAt: new Date() });
    return NextResponse.json(SEED_DATA);
  }

  const { _id, email, updatedAt, ...data } = doc as any;
  return NextResponse.json(data);
}
