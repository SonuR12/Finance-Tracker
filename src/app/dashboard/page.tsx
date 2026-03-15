import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Sidebar
        name={session.user.name}
        email={session.user.email}
        image={session.user.image}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardClient name={session.user.name} />
      </div>
    </div>
  );
}
