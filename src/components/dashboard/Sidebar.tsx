"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, TrendingUp, TrendingDown, PiggyBank,
  CreditCard, BarChart3, Wallet, Bell, Settings, LogOut,
  ChevronLeft, ChevronRight, Sparkles, Receipt, Target,
  ArrowLeftRight, ShieldCheck, X,
} from "lucide-react";
import { UserMenu } from "@/components/ui/UserMenu";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatarColor?: string | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
  unreadCount: number;
  onSettingsOpen: () => void;
}

const NAV_GROUPS = [
  {
    labelKey: "dashboard.overview",
    items: [
      { id: "dashboard",     labelKey: "dashboard.overview",      icon: LayoutDashboard },
      { id: "analytics",     labelKey: "dashboard.analytics",     icon: BarChart3       },
      { id: "ai-insights",   labelKey: "dashboard.aiInsightsTab", icon: Sparkles        },
    ],
  },
  {
    labelKey: "dashboard.money",
    items: [
      { id: "transactions",  labelKey: "dashboard.transactionsTab", icon: ArrowLeftRight  },
      { id: "income",        labelKey: "dashboard.income",          icon: TrendingUp      },
      { id: "expenses",      labelKey: "dashboard.expenses",        icon: TrendingDown    },
      { id: "budget",        labelKey: "dashboard.budget",          icon: PiggyBank       },
      { id: "savings",       labelKey: "dashboard.savings",         icon: Target          },
    ],
  },
  {
    labelKey: "dashboard.accounts",
    items: [
      { id: "accounts",      labelKey: "dashboard.accounts",     icon: Wallet          },
      { id: "cards",         labelKey: "dashboard.cards",        icon: CreditCard      },
      { id: "bills",         labelKey: "dashboard.bills",        icon: Receipt         },
      { id: "investments",   labelKey: "dashboard.investments",  icon: TrendingUp      },
    ],
  },
  {
    labelKey: "dashboard.other",
    items: [
      { id: "notifications", labelKey: "dashboard.notifications", icon: Bell },
      { id: "security",      labelKey: "dashboard.security",      icon: ShieldCheck     },
    ],
  },
];

export default function Sidebar({ name, email, image, avatarColor, activeTab, onTabChange, mobileOpen, onMobileOpenChange, unreadCount, onSettingsOpen }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { chartColor } = useSettings();
  const t = useT();

  function NavItems({ forMobile = false }: { forMobile?: boolean }) {
    return (
      <>
        {NAV_GROUPS.map((group) => (
          <div key={group.labelKey}>
            {(!collapsed || forMobile) && (
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1">
                {t(group.labelKey)}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const label = t(item.labelKey);
                return (
                  <button
                    key={item.id}
                    onClick={() => { onTabChange(item.id); onMobileOpenChange(false); }}
                    style={isActive ? { color: chartColor, backgroundColor: chartColor + "15" } : {}}
                    className={`relative flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm transition group ${
                      isActive
                        ? "font-medium"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200"
                    } ${collapsed && !forMobile ? "justify-center" : ""}`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {(!collapsed || forMobile) && <span className="flex-1 text-left">{label}</span>}
                    {item.id === "notifications" && unreadCount > 0 && (!collapsed || forMobile) && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                    {item.id === "notifications" && unreadCount > 0 && collapsed && !forMobile && (
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
                    )}
                    {collapsed && !forMobile && (
                      <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-50">
                        {label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-300 flex-shrink-0 ${collapsed ? "w-[68px]" : "w-60"}`}>
        <div className={`flex items-center h-14 px-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2">
              <Image src="/svg/logo.svg" alt="Logo" width={22} height={22} />
              <span className="font-bold text-sm text-neutral-800 dark:text-neutral-100">Finance</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/"><Image src="/svg/logo.svg" alt="Logo" width={22} height={22} /></Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:flex h-6 w-6 rounded-md items-center justify-center text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition flex-shrink-0"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <NavItems />
        </nav>

        <div className="px-3 pb-4 space-y-1 border-t border-neutral-200 dark:border-neutral-800 pt-3 flex-shrink-0">
          <button
            onClick={onSettingsOpen}
            className={`relative flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition group ${collapsed ? "justify-center" : ""}`}
          >
            <Settings className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{t("settings.title")}</span>}
            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-2 px-2 py-1 rounded-lg bg-neutral-900 dark:bg-neutral-700 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition z-50">
                {t("settings.title")}
              </span>
            )}
          </button>
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 ${collapsed ? "justify-center" : ""}`}>
            <UserMenu image={image} name={name} email={email} onSettings={onSettingsOpen} width={28} height={28} avatarColor={avatarColor} />
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate leading-none">{name}</p>
                  <p className="text-[10px] text-neutral-400 truncate mt-0.5">{email}</p>
                </div>
                <button onClick={() => { try { localStorage.removeItem("ai_chat_history"); } catch {} signOut({ callbackUrl: "/" }); }} className="text-neutral-400 hover:text-rose-500 hover:cursor-pointer transition flex-shrink-0" title="Sign out">
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => onMobileOpenChange(false)}
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
                <button onClick={() => onMobileOpenChange(false)} className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col h-[calc(100%-56px)]">
                <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
                  <NavItems forMobile />
                </nav>
                <div className="px-3 pb-4 space-y-1 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <button onClick={() => { onMobileOpenChange(false); onSettingsOpen(); }}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
                    <Settings className="h-4 w-4" /> {t("settings.title")}
                  </button>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    <UserMenu image={image} name={name} email={email} onSettings={() => { onMobileOpenChange(false); onSettingsOpen(); }} width={28} height={28} avatarColor={avatarColor} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate leading-none">{name}</p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">{email}</p>
                    </div>
                    <button onClick={() => { try { localStorage.removeItem("ai_chat_history"); } catch {} signOut({ callbackUrl: "/" }); }} className="text-neutral-400 hover:text-rose-500 transition flex-shrink-0" title="Sign out">
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
