"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Home, TrendingUp, TrendingDown, PiggyBank,
  CreditCard, BarChart3, Wallet, Bell, Settings, LogOut,
  ChevronLeft, ChevronRight, Sparkles, Receipt, Target,
  ArrowLeftRight, ShieldCheck, X, Menu,
} from "lucide-react";
import { SettingsDialog } from "@/components/home/SettingsDialog";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard",     label: "Dashboard",      icon: LayoutDashboard, href: "/dashboard" },
      { id: "analytics",     label: "Analytics",      icon: BarChart3,        href: "/dashboard?tab=analytics" },
      { id: "ai-insights",   label: "AI Insights",    icon: Sparkles,         href: "/dashboard?tab=ai-insights" },
    ],
  },
  {
    label: "Money",
    items: [
      { id: "transactions",  label: "Transactions",   icon: ArrowLeftRight,   href: "/dashboard?tab=transactions" },
      { id: "income",        label: "Income",         icon: TrendingUp,        href: "/dashboard?tab=income" },
      { id: "expenses",      label: "Expenses",       icon: TrendingDown,      href: "/dashboard?tab=expenses" },
      { id: "budget",        label: "Budget",         icon: PiggyBank,         href: "/dashboard?tab=budget" },
      { id: "savings",       label: "Savings",        icon: Target,            href: "/dashboard?tab=savings" },
    ],
  },
  {
    label: "Accounts",
    items: [
      { id: "accounts",      label: "Accounts",       icon: Wallet,            href: "/dashboard?tab=accounts" },
      { id: "cards",         label: "Cards",          icon: CreditCard,        href: "/dashboard?tab=cards" },
      { id: "bills",         label: "Bills",          icon: Receipt,           href: "/dashboard?tab=bills" },
      { id: "investments",   label: "Investments",    icon: TrendingUp,        href: "/dashboard?tab=investments" },
    ],
  },
  {
    label: "Other",
    items: [
      { id: "notifications", label: "Notifications",  icon: Bell,              href: "/dashboard?tab=notifications", badge: 3 },
      { id: "security",      label: "Security",       icon: ShieldCheck,       href: "/dashboard?tab=security" },
    ],
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

export default function Sidebar({ name, email, image }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();

  // close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const initials = name ? getInitials(name) : "U";

  const activeId = (() => {
    if (typeof window === "undefined") return "dashboard";
    const tab = new URLSearchParams(window.location.search).get("tab");
    return tab ?? "dashboard";
  })();

  const SidebarContent = (
    <div className={`flex flex-col h-full ${collapsed ? "w-[68px]" : "w-60"} transition-all duration-300`}>

      {/* Logo + collapse */}
      <div className={`flex items-center h-14 px-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <Image src="/svg/logo.svg" alt="Logo" width={22} height={22} />
            <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100">Finance</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/">
            <Image src="/svg/logo.svg" alt="Logo" width={22} height={22} />
          </Link>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="hidden lg:flex h-6 w-6 rounded-md items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition group ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-indigo-500" />
                    )}
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span className="flex-1">{item.label}</span>}
                    {"badge" in item && item.badge && !collapsed && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {"badge" in item && item.badge && collapsed && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
                    )}
                    {/* tooltip on collapsed */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-50">
                        {item.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: settings + user */}
      <div className="px-3 pb-4 space-y-1 border-t border-neutral-200 dark:border-neutral-800 pt-3 flex-shrink-0">
        <button
          onClick={() => setSettingsOpen(true)}
          className={`relative flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200 transition group ${collapsed ? "justify-center" : ""}`}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-50">
              Settings
            </span>
          )}
        </button>

        {/* User card */}
        <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 ${collapsed ? "justify-center" : ""}`}>
          {image ? (
            <Image src={image} alt={name ?? "User"} width={28} height={28} className="rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate leading-none">{name}</p>
              <p className="text-[10px] text-neutral-400 truncate mt-0.5">{email}</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-neutral-400 hover:text-rose-500 transition flex-shrink-0"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[68px]" : "w-60"}`}>
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/svg/logo.svg" alt="Logo" width={22} height={22} />
          <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100">Finance</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto"
            >
              <div className="flex items-center justify-between h-14 px-4 border-b border-neutral-200 dark:border-neutral-800">
                <Link href="/" className="flex items-center gap-2">
                  <Image src="/svg/logo.svg" alt="Logo" width={22} height={22} />
                  <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100">Finance</span>
                </Link>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              {/* reuse same content without collapse */}
              <div className="flex flex-col h-[calc(100%-56px)]">
                <div className="px-3 pt-3">
                  <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    <Home className="h-4 w-4" /> Home
                  </Link>
                </div>
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
                  {NAV_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1">{group.label}</p>
                      <div className="space-y-0.5">
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeId === item.id;
                          return (
                            <Link key={item.id} href={item.href}
                              className={`relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                                isActive
                                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-medium"
                                  : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                              }`}>
                              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-indigo-500" />}
                              <Icon className="h-4 w-4 flex-shrink-0" />
                              <span className="flex-1">{item.label}</span>
                              {"badge" in item && item.badge && (
                                <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">{item.badge}</span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                <div className="px-3 pb-4 space-y-1 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <button onClick={() => { setMobileOpen(false); setSettingsOpen(true); }}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    <Settings className="h-4 w-4" /> Settings
                  </button>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60">
                    {image ? (
                      <Image src={image} alt={name ?? "User"} width={28} height={28} className="rounded-full object-cover" />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate leading-none">{name}</p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">{email}</p>
                    </div>
                    <button onClick={() => signOut({ callbackUrl: "/" })} className="text-neutral-400 hover:text-rose-500 transition">
                      <LogOut className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
