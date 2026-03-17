import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  return (
    <DashboardShell
      name={session.user.name}
      email={session.user.email}
      image={session.user.image}
      avatarColor={session.user.avatarColor}
    />
  );
}
