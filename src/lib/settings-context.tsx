"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SettingsCtx {
  language: string;
  currency: string;
  currencySymbol: string;
  setLanguage: (v: string) => void;
  setCurrency: (v: string, symbol: string) => void;
}

const Ctx = createContext<SettingsCtx>({
  language: "en",
  currency: "USD",
  currencySymbol: "$",
  setLanguage: () => {},
  setCurrency: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState("en");
  const [currency, setCurr] = useState("USD");
  const [currencySymbol, setCurrSymbol] = useState("$");

  useEffect(() => {
    try {
      const lang = localStorage.getItem("language") || "en";
      const cur = localStorage.getItem("currency") || "USD";
      const sym = localStorage.getItem("currencySymbol") || "$";
      setLang(lang);
      setCurr(cur);
      setCurrSymbol(sym);
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

  return (
    <Ctx.Provider value={{ language, currency, currencySymbol, setLanguage, setCurrency }}>
      {children}
    </Ctx.Provider>
  );
}

export const useSettings = () => useContext(Ctx);
