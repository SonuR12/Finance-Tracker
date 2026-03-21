"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Bell, Settings, LogOut, Home, LayoutDashboard, Menu, X } from "lucide-react";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function DashboardNav({ name, email, image }: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currencySymbol } = useSettings();
  const t = useT();

  const initials = name
    ? name.trim().split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "U";

  return (
    <>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/svg/logo.svg" alt="Logo" width={24} height={24} />
              <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100 hidden sm:block">Finance</span>
            </Link>
            <div className="hidden sm:flex items-center gap-1 ml-4">
              <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                <Home className="h-3.5 w-3.5" /> {t("dashboard.home")}
              </Link>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium">
                <LayoutDashboard className="h-3.5 w-3.5" /> {t("nav.features") === "Features" ? "Dashboard" : t("dashboard.overview")}
              </span>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>
            <button onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              <Settings className="h-4 w-4" />
            </button>
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-neutral-200 dark:border-neutral-700">
              {image ? (
                <Image src={image} alt={name ?? "User"} width={30} height={30} className="rounded-full object-cover" />
              ) : (
                <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
              )}
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 leading-none">{name}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5 truncate max-w-[120px]">{email}</p>
              </div>
            </div>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition">
              <LogOut className="h-3.5 w-3.5" /> {t("dashboard.signOut")}
            </button>
            <button onClick={() => setMobileOpen((v) => !v)} className="sm:hidden p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-neutral-100 dark:border-neutral-800 px-4 py-3 space-y-1 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              {image ? (
                <Image src={image} alt={name ?? "User"} width={32} height={32} className="rounded-full" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
              )}
              <div>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">{name}</p>
                <p className="text-xs text-neutral-400">{email}</p>
              </div>
            </div>
            <Link href="/" className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800">
              <Home className="h-4 w-4" /> {t("dashboard.home")}
            </Link>
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2 px-2 py-2 rounded-lg text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30">
              <LogOut className="h-4 w-4" /> {t("dashboard.signOut")}
            </button>
          </div>
        )}
      </header>
    </>
  );
}
