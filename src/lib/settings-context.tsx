"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SettingsCtx {
  language: string;
  currency: string;
  currencySymbol: string;
  chartColor: string;
  theme: "light" | "dark" | "system";
  setLanguage: (v: string) => void;
  setCurrency: (v: string, symbol: string) => void;
  setChartColor: (v: string) => void;
  applyTheme: (v: "light" | "dark" | "system") => void;
}

const Ctx = createContext<SettingsCtx>({
  language: "en",
  currency: "USD",
  currencySymbol: "$",
  chartColor: "#6366f1",
  theme: "system",
  setLanguage: () => {},
  setCurrency: () => {},
  setChartColor: () => {},
  applyTheme: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState("en");
  const [currency, setCurr] = useState("USD");
  const [currencySymbol, setCurrSymbol] = useState("$");
  const [chartColor, setChartColorState] = useState(() => {
    if (typeof window === "undefined") return "#6366f1";
    try { return localStorage.getItem("chartColor") || "#6366f1"; } catch { return "#6366f1"; }
  });
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    if (typeof window === "undefined") return "system";
    try { return (localStorage.getItem("theme") || "system") as "light" | "dark" | "system"; } catch { return "system"; }
  });

  useEffect(() => {
    try {
      const lang = localStorage.getItem("language") || "en";
      const curr = localStorage.getItem("currency") || "USD";
      const sym  = localStorage.getItem("currencySymbol") || "$";
      setLang(lang);
      setCurr(curr);
      setCurrSymbol(sym);
      document.documentElement.lang = lang;
      document.documentElement.style.setProperty("--app-accent", chartColor);
      document.documentElement.style.setProperty("--ring", chartColor);
    } catch {}
  }, []);

  function setLanguage(v: string) {
    setLang(v);
    try { localStorage.setItem("language", v); } catch {}
    document.documentElement.lang = v;
  }

  function setCurrency(v: string, symbol: string) {
    setCurr(v);
    setCurrSymbol(symbol);
    try {
      localStorage.setItem("currency", v);
      localStorage.setItem("currencySymbol", symbol);
    } catch {}
  }

  function setChartColor(v: string) {
    setChartColorState(v);
    document.documentElement.style.setProperty("--app-accent", v);
    document.documentElement.style.setProperty("--ring", v);
    try { localStorage.setItem("chartColor", v); } catch {}
  }

  function applyTheme(th: "light" | "dark" | "system") {
    setThemeState(th);
    try { localStorage.setItem("theme", th); } catch {}
    const html = document.documentElement;
    html.dataset.theme = th;
    if (th === "dark") html.classList.add("dark");
    else if (th === "light") html.classList.remove("dark");
    else window.matchMedia("(prefers-color-scheme: dark)").matches
      ? html.classList.add("dark") : html.classList.remove("dark");
  }

  return (
    <Ctx.Provider value={{ language, currency, currencySymbol, chartColor, theme, setLanguage, setCurrency, setChartColor, applyTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);
