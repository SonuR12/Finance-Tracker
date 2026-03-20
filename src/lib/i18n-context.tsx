"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./settings-context";

import enMessages from "../messages/en.json";

type Messages = Record<string, any>;

const I18nContext = createContext<{ t: (key: string) => string }>({
  t: (key) => key,
});

async function loadMessages(lang: string): Promise<Messages> {
  try {
    const msgs = await import(`../messages/${lang}.json`);
    return msgs.default;
  } catch {
    const msgs = await import(`../messages/en.json`);
    return msgs.default;
  }
}

function resolve(obj: Messages, key: string): string {
  const val = key.split(".").reduce((acc: any, k) => acc?.[k], obj);
  return typeof val === "string" ? val : key;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { language } = useSettings();
  const [messages, setMessages] = useState<Messages>(enMessages);

  useEffect(() => {
    loadMessages(language).then(setMessages);
  }, [language]);

  const t = (key: string) => resolve(messages, key);

  return <I18nContext.Provider value={{ t }}>{children}</I18nContext.Provider>;
}

export const useT = () => useContext(I18nContext).t;
