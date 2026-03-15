"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X, User, SlidersHorizontal, PiggyBank,
  Bell, Shield, Palette, Loader2, Check, LogOut,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

/* ── Data ── */
const LANGUAGES = [
  { value: "en",  label: "English",             flag: "🇺🇸" },
  { value: "es",  label: "Spanish",             flag: "🇪🇸" },
  { value: "fr",  label: "French",              flag: "🇫🇷" },
  { value: "de",  label: "German",              flag: "🇩🇪" },
  { value: "hi",  label: "Hindi",               flag: "🇮🇳" },
  { value: "ja",  label: "Japanese",            flag: "🇯🇵" },
  { value: "zh",  label: "Chinese (Simplified)",flag: "🇨🇳" },
  { value: "ar",  label: "Arabic",              flag: "🇸🇦" },
  { value: "pt",  label: "Portuguese",          flag: "🇧🇷" },
  { value: "ru",  label: "Russian",             flag: "🇷🇺" },
  { value: "ko",  label: "Korean",              flag: "🇰🇷" },
  { value: "it",  label: "Italian",             flag: "🇮🇹" },
  { value: "nl",  label: "Dutch",               flag: "🇳🇱" },
  { value: "tr",  label: "Turkish",             flag: "🇹🇷" },
  { value: "pl",  label: "Polish",              flag: "🇵🇱" },
];

const CURRENCIES = [
  { value: "USD", label: "US Dollar",          symbol: "$",   flag: "🇺🇸" },
  { value: "EUR", label: "Euro",               symbol: "€",   flag: "🇪🇺" },
  { value: "GBP", label: "British Pound",      symbol: "£",   flag: "🇬🇧" },
  { value: "INR", label: "Indian Rupee",       symbol: "₹",   flag: "🇮🇳" },
  { value: "JPY", label: "Japanese Yen",       symbol: "¥",   flag: "🇯🇵" },
  { value: "AUD", label: "Australian Dollar",  symbol: "A$",  flag: "🇦🇺" },
  { value: "CAD", label: "Canadian Dollar",    symbol: "C$",  flag: "🇨🇦" },
  { value: "CHF", label: "Swiss Franc",        symbol: "Fr",  flag: "🇨🇭" },
  { value: "CNY", label: "Chinese Yuan",       symbol: "¥",   flag: "🇨🇳" },
  { value: "BRL", label: "Brazilian Real",     symbol: "R$",  flag: "🇧🇷" },
  { value: "MXN", label: "Mexican Peso",       symbol: "$",   flag: "🇲🇽" },
  { value: "KRW", label: "South Korean Won",   symbol: "₩",   flag: "🇰🇷" },
  { value: "SGD", label: "Singapore Dollar",   symbol: "S$",  flag: "🇸🇬" },
  { value: "AED", label: "UAE Dirham",         symbol: "د.إ", flag: "🇦🇪" },
  { value: "SAR", label: "Saudi Riyal",        symbol: "﷼",   flag: "🇸🇦" },
  { value: "RUB", label: "Russian Ruble",      symbol: "₽",   flag: "🇷🇺" },
  { value: "TRY", label: "Turkish Lira",       symbol: "₺",   flag: "🇹🇷" },
  { value: "ZAR", label: "South African Rand", symbol: "R",   flag: "🇿🇦" },
];

interface Settings {
  language: string;
  currency: string;
  showBalance: boolean;
  autoCategorize: boolean;
  budgets: Record<string, string>;
  budgetAlerts: boolean;
}

const DEFAULTS: Settings = {
  language: "en",
  currency: "USD",
  showBalance: true,
  autoCategorize: true,
  budgets: {},
  budgetAlerts: true,
};

const TABS = [
  { id: "profile",        labelKey: "settings.profile",       icon: User },
  { id: "preferences",   labelKey: "settings.preferences",   icon: SlidersHorizontal },
  { id: "budget",        labelKey: "settings.budget",         icon: PiggyBank },
  { id: "notifications", labelKey: "settings.notifications",  icon: Bell },
  { id: "security",      labelKey: "settings.security",       icon: Shield },
  { id: "appearance",    labelKey: "settings.appearance",     icon: Palette },
];

const BUDGET_CATEGORIES = [
  "Food & Dining", "Transport", "Shopping",
  "Entertainment", "Health", "Utilities",
];

function SLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">{children}</p>;
}
function Hr() {
  return <hr className="border-neutral-100 dark:border-neutral-800" />;
}
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${checked ? "bg-indigo-500" : "bg-neutral-300 dark:bg-neutral-600"}`}>
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
function SaveBtn({ onClick, saving, saved, t }: { onClick: () => void; saving: boolean; saved: boolean; t: (k: string) => string }) {
  return (
    <button onClick={onClick} disabled={saving}
      className="flex items-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm px-4 py-2 transition">
      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <Check className="h-3.5 w-3.5" /> : null}
      {saving ? t("settings.saving") : saved ? t("settings.saved") : t("settings.saveChanges")}
    </button>
  );
}

/* module-level cache — survives tab switches, cleared on sign out */
let settingsCache: Settings | null = null;

export function clearSettingsCache() { settingsCache = null; }

export function SettingsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState([true, true, true, true, true]);
  const [twoFA, setTwoFA] = useState(false);
  const [loginNotif, setLoginNotif] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [chartColor, setChartColor] = useState("indigo");
  const fetchedRef = useRef(false);

  const { language: ctxLang, currency: ctxCurrency, setLanguage: applyLanguage, setCurrency: applyCurrency } = useSettings();
  const t = useT();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.name) setFullName(user.name);
  }, [user?.name]);

  useEffect(() => {
    if (!open || !user || fetchedRef.current) return;
    // use cache if available — no API call
    if (settingsCache) {
      setSettings(settingsCache);
      return;
    }
    fetchedRef.current = true;
    setLoading(true);
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          const merged = { ...DEFAULTS, ...data };
          settingsCache = merged;
          setSettings(merged);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, user]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    try {
      setTheme((localStorage.getItem("theme") as any) || "system");
      setChartColor(localStorage.getItem("chartColor") || "indigo");
    } catch {}
    setSettings((s) => ({ ...s, language: ctxLang, currency: ctxCurrency }));
  }, [ctxLang, ctxCurrency]);

  function patch(p: Partial<Settings>) {
    setSettings((s) => ({ ...s, ...p }));
    setSaved(false);
    if (p.language) applyLanguage(p.language);
    if (p.currency) {
      const sym = CURRENCIES.find((c) => c.value === p.currency)?.symbol ?? "$";
      applyCurrency(p.currency, sym);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      applyLanguage(settings.language);
      const sym = CURRENCIES.find((c) => c.value === settings.currency)?.symbol ?? "$";
      applyCurrency(settings.currency, sym);
      settingsCache = { ...settings };
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function applyTheme(th: "light" | "dark" | "system") {
    setTheme(th);
    try { localStorage.setItem("theme", th); } catch {}
    const html = document.documentElement;
    html.dataset.theme = th;
    if (th === "dark") html.classList.add("dark");
    else if (th === "light") html.classList.remove("dark");
    else window.matchMedia("(prefers-color-scheme: dark)").matches
      ? html.classList.add("dark") : html.classList.remove("dark");
  }

  const currencySymbol = CURRENCIES.find((c) => c.value === settings.currency)?.symbol ?? "$";

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="relative flex w-full max-w-3xl h-[580px] rounded-2xl shadow-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">

        {/* Sidebar */}
        <div className="w-52 flex-shrink-0 border-r border-neutral-100 dark:border-neutral-800 flex flex-col py-5 px-3 rounded-l-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-2 mb-6">
            <Image src="/svg/logo.svg" alt="Logo" width={20} height={20} />
            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">Finance</span>
          </div>
          <nav className="flex flex-col gap-0.5">
            {TABS.map(({ id, labelKey, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition text-left w-full ${
                  activeTab === id
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium"
                    : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}>
                <Icon className="h-4 w-4 flex-shrink-0" />
                {t(labelKey)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 rounded-r-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
            <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
              {t(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? "")}
            </h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              <>
                {/* PROFILE */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.yourProfile")}</SLabel>
                      <div className="flex items-center gap-4 mb-5">
                        {user?.image ? (
                          <div className="h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                            <Image src={user.image} alt={fullName || (user.name ?? "User")} width={64} height={64} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                            {fullName?.[0]?.toUpperCase() ?? "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-100">{fullName || user?.name}</p>
                          <p className="text-sm text-neutral-500">{user?.email}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-neutral-500 mb-1 block">{t("settings.fullName")}</label>
                          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-400" />
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500 mb-1 block">{t("settings.email")}</label>
                          <input defaultValue={user?.email ?? ""} disabled className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800/50 px-3 py-2 text-sm text-neutral-500 outline-none cursor-not-allowed" />
                        </div>
                      </div>
                      <button
                        disabled={profileSaving}
                        onClick={async () => {
                          setProfileSaving(true);
                          try {
                            const res = await fetch("/api/authentication/update-name", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: fullName }),
                            });
                            if (res.ok) {
                              await update({ name: fullName });
                              setProfileSaved(true);
                              setTimeout(() => setProfileSaved(false), 2500);
                            }
                          } finally {
                            setProfileSaving(false);
                          }
                        }}
                        className="mt-4 flex items-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm px-4 py-2 transition"
                      >
                        {profileSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : profileSaved ? <Check className="h-3.5 w-3.5" /> : null}
                        {profileSaving ? t("settings.saving") : profileSaved ? t("settings.saved") : t("settings.saveChanges")}
                      </button>
                    </div>
                    <Hr />
                    <div>
                      <SLabel>Account</SLabel>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-800/50 text-sm px-4 py-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>

                  </div>
                )}

                {/* PREFERENCES */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.general")}</SLabel>
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs text-neutral-500 mb-1.5 block">{t("settings.language")}</label>
                          <Select value={settings.language} onValueChange={(v) => patch({ language: v })}>
                            <SelectTrigger className="w-full h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100">
                              <SelectValue>
                                {(() => {
                                  const l = LANGUAGES.find((x) => x.value === settings.language);
                                  return l ? <span>{l.flag} {l.label}</span> : "Select language";
                                })()}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="z-[200] max-h-60">
                              {LANGUAGES.map((l) => (
                                <SelectItem key={l.value} value={l.value}>
                                  <span className="flex items-center gap-2">{l.flag} {l.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-neutral-500 mb-1.5 block">{t("settings.currency")}</label>
                          <Select value={settings.currency} onValueChange={(v) => patch({ currency: v })}>
                            <SelectTrigger className="w-full h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100">
                              <SelectValue>
                                {(() => {
                                  const c = CURRENCIES.find((x) => x.value === settings.currency);
                                  return c ? <span>{c.flag} {c.value} — {c.label} ({c.symbol})</span> : "Select currency";
                                })()}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="z-[200] max-h-60">
                              {CURRENCIES.map((c) => (
                                <SelectItem key={c.value} value={c.value}>
                                  <span className="flex items-center gap-2">{c.flag} {c.value} — {c.label} ({c.symbol})</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <Hr />
                    <div>
                      <SLabel>{t("settings.dashboard")}</SLabel>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.showBalance")}</p>
                            <p className="text-xs text-neutral-500">{t("settings.showBalanceDesc")}</p>
                          </div>
                          <Toggle checked={settings.showBalance} onChange={(v) => patch({ showBalance: v })} />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.autoCategorize")}</p>
                            <p className="text-xs text-neutral-500">{t("settings.autoCategorizeDesc")}</p>
                          </div>
                          <Toggle checked={settings.autoCategorize} onChange={(v) => patch({ autoCategorize: v })} />
                        </div>
                      </div>
                    </div>
                    <SaveBtn onClick={save} saving={saving} saved={saved} t={t} />
                  </div>
                )}

                {/* BUDGET */}
                {activeTab === "budget" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.monthlyBudget")} ({currencySymbol})</SLabel>
                      <div className="space-y-3">
                        {BUDGET_CATEGORIES.map((cat) => (
                          <div key={cat} className="flex items-center gap-3">
                            <label className="text-sm text-neutral-700 dark:text-neutral-300 w-36 flex-shrink-0">{cat}</label>
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">{currencySymbol}</span>
                              <input
                                type="number" min="0" placeholder="0"
                                value={settings.budgets[cat] ?? ""}
                                onChange={(e) => patch({ budgets: { ...settings.budgets, [cat]: e.target.value } })}
                                className="w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 pl-7 pr-3 py-2 text-sm text-neutral-800 dark:text-neutral-100 outline-none focus:border-indigo-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Hr />
                    <div>
                      <SLabel>{t("settings.budgetAlerts")}</SLabel>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.alertNearLimit")}</p>
                          <p className="text-xs text-neutral-500">{t("settings.alertNearLimitDesc")}</p>
                        </div>
                        <Toggle checked={settings.budgetAlerts} onChange={(v) => patch({ budgetAlerts: v })} />
                      </div>
                    </div>
                    <SaveBtn onClick={save} saving={saving} saved={saved} t={t} />
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {activeTab === "notifications" && (
                  <div className="space-y-5">
                    <SLabel>{t("settings.notificationPrefs")}</SLabel>
                    {(([
                      ["settings.transactionAlerts", "settings.transactionAlertsDesc"],
                      ["settings.budgetWarnings",    "settings.budgetWarningsDesc"],
                      ["settings.weeklySummary",     "settings.weeklySummaryDesc"],
                      ["settings.monthlyReport",     "settings.monthlyReportDesc"],
                      ["settings.productUpdates",    "settings.productUpdatesDesc"],
                    ]) as [string, string][]).map(([lk, dk], i) => (
                      <div key={lk} className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t(lk)}</p>
                          <p className="text-xs text-neutral-500">{t(dk)}</p>
                        </div>
                        <Toggle checked={notifs[i]} onChange={(v) => setNotifs((n) => n.map((x, j) => j === i ? v : x))} />
                      </div>
                    ))}
                  </div>
                )}

                {/* SECURITY */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.security")}</SLabel>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.twoFA")}</p>
                            <p className="text-xs text-neutral-500">{t("settings.twoFADesc")}</p>
                          </div>
                          <Toggle checked={twoFA} onChange={setTwoFA} />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.loginNotifications")}</p>
                            <p className="text-xs text-neutral-500">{t("settings.loginNotificationsDesc")}</p>
                          </div>
                          <Toggle checked={loginNotif} onChange={setLoginNotif} />
                        </div>
                      </div>
                    </div>
                    <Hr />
                    <div>
                      <SLabel>{t("settings.dataPrivacy")}</SLabel>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.shareAnalytics")}</p>
                          <p className="text-xs text-neutral-500">{t("settings.shareAnalyticsDesc")}</p>
                        </div>
                        <Toggle checked={analytics} onChange={setAnalytics} />
                      </div>
                      <button className="mt-4 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition">{t("settings.exportData")}</button>
                    </div>
                  </div>
                )}

                {/* APPEARANCE */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.theme")}</SLabel>
                      <div className="flex gap-3">
                        {([
                          { id: "light"  as const, labelKey: "settings.light",        preview: "bg-white border border-neutral-200" },
                          { id: "dark"   as const, labelKey: "settings.dark",         preview: "bg-neutral-800" },
                          { id: "system" as const, labelKey: "settings.followSystem", preview: "bg-gradient-to-r from-white to-neutral-800" },
                        ]).map((th) => (
                          <button key={th.id} onClick={() => applyTheme(th.id)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${theme === th.id ? "border-indigo-500" : "border-neutral-200 dark:border-neutral-700"}`}>
                            <div className={`h-14 w-20 rounded-lg ${th.preview}`} />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{t(th.labelKey)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Hr />
                    <div>
                      <SLabel>{t("settings.chartColor")}</SLabel>
                      <div className="flex gap-3 flex-wrap">
                        {[
                          { id: "indigo",  bg: "bg-indigo-500" },
                          { id: "blue",    bg: "bg-blue-500" },
                          { id: "emerald", bg: "bg-emerald-500" },
                          { id: "violet",  bg: "bg-violet-500" },
                          { id: "rose",    bg: "bg-rose-500" },
                          { id: "amber",   bg: "bg-amber-500" },
                        ].map((c) => (
                          <button key={c.id}
                            onClick={() => { setChartColor(c.id); try { localStorage.setItem("chartColor", c.id); } catch {} }}
                            className={`h-8 w-8 rounded-full ${c.bg} transition-all ${chartColor === c.id ? "ring-2 ring-offset-2 ring-neutral-700 dark:ring-neutral-300 scale-110" : "ring-2 ring-offset-2 ring-transparent hover:scale-105"}`} />
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-neutral-400 capitalize">{t("settings.selected")}: {chartColor}</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
