"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, Sun, Moon, Monitor } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";

const COLORS = ["#6366f1","#3b82f6","#10b981","#8b5cf6","#f43f5e","#f59e0b","#06b6d4","#ec4899"];

export default function QuickAppearance() {
  const { accentColor, setAccentColor, theme, applyTheme } = useSettings();
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/50 backdrop-blur-sm transition hover:scale-105"
        style={{ color: "var(--app-accent)" }}
        title="Appearance"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed sm:absolute right-[30%] sm:right-0 top-12 w-52 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-xl p-4 space-y-4 z-[200]">
          {/* Theme */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{t("settings.theme")}</p>
            <div className="flex gap-1.5">
              {([
                { id: "light"  as const, Icon: Sun },
                { id: "dark"   as const, Icon: Moon },
                { id: "system" as const, Icon: Monitor },
              ]).map(({ id, Icon }) => (
                <button key={id} onClick={() => applyTheme(id)}
                  className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl border transition text-xs capitalize"
                  style={theme === id
                    ? { borderColor: "var(--app-accent)", color: "var(--app-accent)", background: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }
                    : { borderColor: "transparent", color: "" }
                  }
                >
                  <Icon className="h-4 w-4" />
                  {t(`settings.${id === "system" ? "followSystem" : id}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">{t("settings.accentColor")}</p>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((hex) => (
                <button key={hex} onClick={() => setAccentColor(hex)}
                  className="h-6 w-6 rounded-full transition-all hover:scale-110"
                  style={{
                    background: hex,
                    ...(accentColor === hex ? { outline: `2px solid ${hex}`, outlineOffset: "2px" } : {}),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
