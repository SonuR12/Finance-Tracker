"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SettingsCtx {
  language: string;
  currency: string;
  currencySymbol: string;
  chartColor: string;
  setLanguage: (v: string) => void;
  setCurrency: (v: string, symbol: string) => void;
  setChartColor: (v: string) => void;
}

const Ctx = createContext<SettingsCtx>({
  language: "en",
  currency: "USD",
  currencySymbol: "$",
  chartColor: "#6366f1",
  setLanguage: () => {},
  setCurrency: () => {},
  setChartColor: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState("en");
  const [currency, setCurr] = useState("USD");
  const [currencySymbol, setCurrSymbol] = useState("$");
  const [chartColor, setChartColorState] = useState("#6366f1");

  useEffect(() => {
    try {
      const lang = localStorage.getItem("language") || "en";
      const cur = localStorage.getItem("currency") || "USD";
      const sym = localStorage.getItem("currencySymbol") || "$";
      const color = localStorage.getItem("chartColor") || "#6366f1";
      setLang(lang);
      setCurr(cur);
      setCurrSymbol(sym);
      setChartColorState(color);
      document.documentElement.style.setProperty("--app-accent", color);
      document.documentElement.lang = lang;
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
    try { localStorage.setItem("chartColor", v); } catch {}
  }

  return (
    <Ctx.Provider value={{ language, currency, currencySymbol, chartColor, setLanguage, setCurrency, setChartColor }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);
