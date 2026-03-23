"use client";

import { createContext, useContext, useEffect, useState } from "react";

export interface FullSettings {
  language: string;
  currency: string;
  currencySymbol: string;
  showBalance: boolean;
  autoCategorize: boolean;
  budgets: Record<string, string>;
  budgetAlerts: boolean;
  chartColor: string;
  theme: "light" | "dark" | "system";
}

interface SettingsCtx extends FullSettings {
  settingsLoaded: boolean;
  setChartColor: (v: string) => void;
  applyTheme: (v: "light" | "dark" | "system") => void;
  applySettings: (s: FullSettings) => void;
}

const DEFAULTS: FullSettings = {
  language: "en",
  currency: "USD",
  currencySymbol: "$",
  showBalance: true,
  autoCategorize: true,
  budgets: {},
  budgetAlerts: true,
  chartColor: "#6366f1",
  theme: "system",
};

const Ctx = createContext<SettingsCtx>({
  ...DEFAULTS,
  settingsLoaded: false,
  setChartColor: () => {},
  applyTheme: () => {},
  applySettings: () => {},
});

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥", AUD: "A$",
  CAD: "C$", CHF: "Fr", CNY: "¥", BRL: "R$", MXN: "$", KRW: "₩",
  SGD: "S$", AED: "د.إ", SAR: "﷼", RUB: "₽", TRY: "₺", ZAR: "R",
};

function applyThemeToDom(th: "light" | "dark" | "system") {
  const html = document.documentElement;
  html.dataset.theme = th;
  if (th === "dark") html.classList.add("dark");
  else if (th === "light") html.classList.remove("dark");
  else window.matchMedia("(prefers-color-scheme: dark)").matches
    ? html.classList.add("dark") : html.classList.remove("dark");
}

function applyToDom(s: FullSettings) {
  document.documentElement.lang = s.language;
  document.documentElement.style.setProperty("--app-accent", s.chartColor);
  document.documentElement.style.setProperty("--ring", s.chartColor);
  applyThemeToDom(s.theme);
}

const LS_KEY = "app_settings_v2";

function saveToLocalStorage(s: FullSettings) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

function loadFromLocalStorage(): FullSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
    // migrate legacy keys
    return {
      ...DEFAULTS,
      language:       localStorage.getItem("language")        || DEFAULTS.language,
      currency:       localStorage.getItem("currency")        || DEFAULTS.currency,
      currencySymbol: localStorage.getItem("currencySymbol") || DEFAULTS.currencySymbol,
      chartColor:     localStorage.getItem("chartColor")      || DEFAULTS.chartColor,
      theme: (localStorage.getItem("theme") || DEFAULTS.theme) as FullSettings["theme"],
    };
  } catch { return DEFAULTS; }
}

export function clearSettingsCache() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<FullSettings>(DEFAULTS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const local = loadFromLocalStorage();
    setSettings(local);
    applyToDom(local);
    setSettingsLoaded(true);
  }, []);

  function setChartColor(v: string) {
    setSettings((s) => {
      const next = { ...s, chartColor: v };
      saveToLocalStorage(next);
      return next;
    });
    document.documentElement.style.setProperty("--app-accent", v);
    document.documentElement.style.setProperty("--ring", v);
  }

  function applyTheme(th: "light" | "dark" | "system") {
    setSettings((s) => {
      const next = { ...s, theme: th };
      saveToLocalStorage(next);
      return next;
    });
    applyThemeToDom(th);
  }

  function applySettings(s: FullSettings) {
    setSettings(s);
    applyToDom(s);
    saveToLocalStorage(s);
  }

  return (
    <Ctx.Provider value={{ ...settings, settingsLoaded, setChartColor, applyTheme, applySettings }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);
