import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { computeDashboardData } from "@/app/api/dashboard/route";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const initialData = await computeDashboardData(session.user.email!) ?? {
    stats: { totalBalance: 0, monthlyIncome: 0, monthlyExpenses: 0, totalSavings: 0 },
    monthlyData: [],
    spendingByCategory: [],
    weeklySpending: [],
    transactions: [],
    budgets: [],
    aiInsights: [{ type: "info", title: "Welcome! No data yet", desc: "Your dashboard is empty. Data will appear here once added to your account.", icon: "👋" }],
  };

  return (
    <DashboardShell
      name={session.user.name}
      email={session.user.email}
      image={session.user.image}
      avatarColor={session.user.avatarColor}
      initialData={initialData}
    />
  );
}
