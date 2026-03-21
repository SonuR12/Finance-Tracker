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

const SESSION_KEY = "app_settings";

function saveToLocalStorage(s: FullSettings) {
  try {
    localStorage.setItem("language", s.language);
    localStorage.setItem("currency", s.currency);
    localStorage.setItem("currencySymbol", s.currencySymbol);
    localStorage.setItem("chartColor", s.chartColor);
    localStorage.setItem("theme", s.theme);
  } catch {}
}

function saveToSession(s: FullSettings) {
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch {}
}

function loadFromSession(): FullSettings | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as FullSettings) : null;
  } catch { return null; }
}

function loadFromLocalStorage(): FullSettings {
  try {
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
  try { sessionStorage.removeItem(SESSION_KEY); } catch {}
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<FullSettings>(DEFAULTS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    // 1. Apply localStorage instantly (no flash)
    const local = loadFromLocalStorage();
    setSettings(local);
    applyToDom(local);

    // 2. If sessionStorage has cached settings, skip DB fetch entirely
    const cached = loadFromSession();
    if (cached) {
      setSettings(cached);
      applyToDom(cached);
      setSettingsLoaded(true);
      return;
    }

    // 3. First load of this session — fetch from DB once, cache in sessionStorage
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        const sym = CURRENCY_SYMBOLS[data.currency] ?? "$";
        const merged: FullSettings = {
          ...local,
          language:       data.language       ?? local.language,
          currency:       data.currency       ?? local.currency,
          currencySymbol: sym,
          showBalance:    data.showBalance    ?? local.showBalance,
          autoCategorize: data.autoCategorize ?? local.autoCategorize,
          budgets:        data.budgets        ?? local.budgets,
          budgetAlerts:   data.budgetAlerts   ?? local.budgetAlerts,
        };
        saveToSession(merged);
        setSettings(merged);
        applyToDom(merged);
        saveToLocalStorage(merged);
      })
      .catch(() => {})
      .finally(() => setSettingsLoaded(true));
  }, []);

  function setChartColor(v: string) {
    setSettings((s) => {
      const next = { ...s, chartColor: v };
      saveToSession(next);
      return next;
    });
    document.documentElement.style.setProperty("--app-accent", v);
    document.documentElement.style.setProperty("--ring", v);
    try { localStorage.setItem("chartColor", v); } catch {}
  }

  function applyTheme(th: "light" | "dark" | "system") {
    setSettings((s) => {
      const next = { ...s, theme: th };
      saveToSession(next);
      return next;
    });
    applyThemeToDom(th);
    try { localStorage.setItem("theme", th); } catch {}
  }

  // Called by SettingsDialog after a successful save
  function applySettings(s: FullSettings) {
    saveToSession(s);
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
