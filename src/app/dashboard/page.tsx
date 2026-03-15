import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
        Welcome, {session?.user?.name ?? "User"}
      </h1>
      <p className="text-zinc-500">{session?.user?.email}</p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white hover:bg-zinc-700 dark:bg-white dark:text-black"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
