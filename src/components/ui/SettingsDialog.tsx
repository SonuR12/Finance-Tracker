"use client";

import { signOut } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  X, User, SlidersHorizontal, PiggyBank,
  Bell, Shield, Palette, Loader2, LogOut,
} from "lucide-react";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSettings, clearSettingsCache } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { UserMenu } from "@/components/ui/UserMenu";
import { AccentButton, AccentToggle } from "@/components/ui/AccentButton";
import { AppButton } from "@/components/ui/AppButton";

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
  { id: "profile",       labelKey: "settings.profile",        icon: User },
  { id: "preferences",   labelKey: "settings.preferences",    icon: SlidersHorizontal },
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

/* module-level cache removed — settings-context handles sessionStorage caching */

export function SettingsDialog({ open, onClose, name: nameProp, email: emailProp, image: imageProp, avatarColor: avatarColorProp, onNameSaved }: { 
  open: boolean; 
  onClose: () => void;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatarColor?: string | null;
  onNameSaved?: (name: string) => void;
}) {
  const user = { name: nameProp, email: emailProp, image: imageProp, avatarColor: avatarColorProp };

  const [activeTab, setActiveTab] = useState("profile");
  const [fullName, setFullName] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const savedSettingsRef = useRef<Settings>(DEFAULTS);
  const savedAppearanceRef = useRef({ chartColor: "#6366f1", theme: "system" as "light" | "dark" | "system" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [appearanceSaving, setAppearanceSaving] = useState(false);
  const [appearanceSaved, setAppearanceSaved] = useState(false);
  const [notifs, setNotifs] = useState([true, true, true, true, true]);
  const [twoFA, setTwoFA] = useState(false);
  const [loginNotif, setLoginNotif] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  const { setChartColor: applyChartColor, applyTheme, applySettings, chartColor, theme, settingsLoaded, language, currency, showBalance, autoCategorize, budgets, budgetAlerts } = useSettings();
  const t = useT();
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync savedAppearanceRef from localStorage on mount
  useEffect(() => {
    try {
      savedAppearanceRef.current = {
        chartColor: localStorage.getItem("chartColor") ?? "#6366f1",
        theme: (localStorage.getItem("theme") ?? "system") as "light" | "dark" | "system",
      };
    } catch {}
  }, []);

  useEffect(() => { if (user?.name) { setFullName(user.name); setOriginalName(user.name); } }, [user?.name]);

  // Sync dialog state once settings are loaded from context (sessionStorage or DB)
  useEffect(() => {
    if (!settingsLoaded) return;
    const merged = { ...DEFAULTS, language, currency, showBalance, autoCategorize, budgets, budgetAlerts };
    setSettings(merged);
    savedSettingsRef.current = merged;
  }, [settingsLoaded]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Only update local draft — no DB/localStorage write until Save
  function patch(p: Partial<Settings>) {
    setSettings((s) => ({ ...s, ...p }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const sym = CURRENCIES.find((c) => c.value === settings.currency)?.symbol ?? "$";
      const full = { ...settings, currencySymbol: sym, chartColor, theme };
      applySettings(full);
      savedSettingsRef.current = { ...settings };
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function saveAppearance() {
    setAppearanceSaving(true);
    try {
      localStorage.setItem("chartColor", chartColor);
      localStorage.setItem("theme", theme);
      savedAppearanceRef.current = { chartColor, theme };
      setAppearanceSaved(true);
      setTimeout(() => setAppearanceSaved(false), 2500);
    } finally {
      setAppearanceSaving(false);
    }
  }

  const currencySymbol = CURRENCIES.find((c) => c.value === settings.currency)?.symbol ?? "$";
  const profileChanged = fullName.trim() !== originalName.trim();
  const prefsChanged = (
    settings.language !== savedSettingsRef.current.language ||
    settings.currency !== savedSettingsRef.current.currency ||
    settings.showBalance !== savedSettingsRef.current.showBalance ||
    settings.autoCategorize !== savedSettingsRef.current.autoCategorize
  );
  const budgetChanged = (
    JSON.stringify(settings.budgets) !== JSON.stringify(savedSettingsRef.current.budgets) ||
    settings.budgetAlerts !== savedSettingsRef.current.budgetAlerts
  );
  const appearanceChanged = (
    chartColor !== savedAppearanceRef.current.chartColor ||
    theme !== savedAppearanceRef.current.theme
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4"
    >
      <div className="relative flex w-full max-w-3xl h-[calc(100dvh-24px)] sm:h-[580px] !max-h-[600px] rounded-2xl shadow-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-scroll">

        {/* Sidebar — icon-only on mobile, icon+label on sm+ */}
        <div className="flex-shrink-0 border-r border-neutral-100 dark:border-neutral-800 flex flex-col py-4 sm:py-5 px-2 sm:px-3 w-14 sm:w-52">
          <div className="hidden sm:flex items-center gap-2 px-2 mb-6">
            <Image src="/svg/logo.svg" alt="Logo" width={40} height={40} />
            <span className="font-semibold text-sm text-neutral-800 dark:text-neutral-100">Finance</span>
          </div>
          <div className="sm:hidden flex justify-center mb-4">
            <Image src="/svg/logo.svg" alt="Logo" width={30} height={30} />
          </div>
          <nav className="flex flex-col gap-0.5">
            {TABS.map(({ id, labelKey, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)} title={t(labelKey)}
                style={activeTab === id ? { background: chartColor + "15", color: chartColor } : {}}
                className={`flex items-center gap-2.5 rounded-lg px-2 sm:px-3 py-2 text-sm transition w-full ${
                  activeTab === id
                    ? "font-medium"
                    : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}>
                <Icon className="h-4 w-4 flex-shrink-0 mx-auto sm:mx-0" />
                <span className="hidden sm:inline">{t(labelKey)}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
            <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
              {t(TABS.find((tab) => tab.id === activeTab)?.labelKey ?? "")}
            </h2>
            <button onClick={onClose} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {!settingsLoaded ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--app-accent)" }} />
              </div>
            ) : (
              <>
                {/* PROFILE */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.yourProfile")}</SLabel>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="relative group flex-shrink-0">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const result = ev.target?.result as string;
                                setImagePreview(result);
                                setImageBase64(result);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <UserMenu
                              image={imagePreview ?? user?.image}
                              name={originalName || user?.name}
                              email={user?.email}
                              avatarColor={(user as any)?.avatarColor}
                              width={64}
                              height={64}
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-800 dark:text-neutral-100">{originalName || user?.name}</p>
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
                      <AccentButton
                        className="mt-4 min-w-[120px]"
                        saving={profileSaving}
                        saved={profileSaved}
                        saveLabel={t("settings.saveChanges")}
                        savingLabel={t("settings.saving")}
                        savedLabel={t("settings.saved")}
                        disabled={!profileChanged && !imageBase64}
                        onClick={async () => {
                          setProfileSaving(true);
                          try {
                            const res = await fetch("/api/authentication/update-name", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ name: fullName, image: imageBase64 }),
                            });
                            if (res.ok) {
                              setOriginalName(fullName);
                              onNameSaved?.(fullName);
                              setImageBase64(null);
                              setProfileSaved(true);
                              setTimeout(() => setProfileSaved(false), 2500);
                            }
                          } finally {
                            setProfileSaving(false);
                          }
                        }}
                      />
                    </div>
                    <Hr />
                    <div>
                      <SLabel>{t("settings.account")}</SLabel>
                      <AppButton
                        variant="danger"
                        onClick={() => {
                          try { localStorage.removeItem("ai_chat_history"); } catch {}
                          clearSettingsCache();
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("settings.signOut")}
                      </AppButton>
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
                          <AccentToggle checked={settings.showBalance} onChange={(v) => patch({ showBalance: v })} />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.autoCategorize")}</p>
                            <p className="text-xs text-neutral-500">{t("settings.autoCategorizeDesc")}</p>
                          </div>
                          <AccentToggle checked={settings.autoCategorize} onChange={(v) => patch({ autoCategorize: v })} />
                        </div>
                      </div>
                    </div>
                    <AccentButton onClick={save} saving={saving} saved={saved} disabled={!prefsChanged} saveLabel={t("settings.saveChanges")} savingLabel={t("settings.saving")} savedLabel={t("settings.saved")} />
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
                            <label className="text-sm text-neutral-700 dark:text-neutral-300 w-28 sm:w-36 flex-shrink-0">{cat}</label>
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
                        <AccentToggle checked={settings.budgetAlerts} onChange={(v) => patch({ budgetAlerts: v })} />
                      </div>
                    </div>
                    <AccentButton onClick={save} saving={saving} saved={saved} disabled={!budgetChanged} saveLabel={t("settings.saveChanges")} savingLabel={t("settings.saving")} savedLabel={t("settings.saved")} />
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
                        <AccentToggle checked={notifs[i]} onChange={(v) => setNotifs((n) => n.map((x, j) => j === i ? v : x))} />
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
                          <AccentToggle checked={twoFA} onChange={setTwoFA} />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{t("settings.loginNotifications")}</p>
                            <p className="text-xs text-neutral-500">{t("settings.loginNotificationsDesc")}</p>
                          </div>
                          <AccentToggle checked={loginNotif} onChange={setLoginNotif} />
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
                        <AccentToggle checked={analytics} onChange={setAnalytics} />
                      </div>
                      <AppButton variant="subtle" onClick={() => {}}>{t("settings.exportData")}</AppButton>
                    </div>
                  </div>
                )}

                {/* APPEARANCE */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div>
                      <SLabel>{t("settings.theme")}</SLabel>
                      <div className="flex gap-2 sm:gap-3">
                        {([
                          { id: "light"  as const, labelKey: "settings.light",        preview: "bg-white border border-neutral-200" },
                          { id: "dark"   as const, labelKey: "settings.dark",         preview: "bg-neutral-800" },
                          { id: "system" as const, labelKey: "settings.followSystem", preview: "bg-gradient-to-r from-white to-neutral-800" },
                        ]).map((th) => (
                          <button key={th.id} onClick={() => applyTheme(th.id)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition ${theme === th.id ? "" : "border-neutral-200 dark:border-neutral-700"}`}
                            style={theme === th.id ? { borderColor: chartColor } : {}}>
                            <div className={`h-10 w-14 sm:h-14 sm:w-20 rounded-lg ${th.preview}`} />
                            <span className="text-xs text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{t(th.labelKey)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <Hr />
                    <div>
                      <SLabel>{t("settings.chartColor")}</SLabel>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {["#6366f1","#3b82f6","#10b981","#8b5cf6","#f43f5e","#f59e0b","#06b6d4","#ec4899"].map((hex) => (
                          <button key={hex} onClick={() => applyChartColor(hex)}
                            className={`h-7 w-7 rounded-full transition-all ${
                              chartColor === hex ? "ring-2 ring-offset-2 ring-neutral-500 dark:ring-neutral-300 scale-110" : "hover:scale-105"
                            }`}
                            style={{ background: hex }} />
                        ))}
                      </div>
                    </div>
                    <AccentButton onClick={saveAppearance} saving={appearanceSaving} saved={appearanceSaved} disabled={!appearanceChanged} saveLabel={t("settings.saveChanges")} savingLabel={t("settings.saving")} savedLabel={t("settings.saved")} />
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
