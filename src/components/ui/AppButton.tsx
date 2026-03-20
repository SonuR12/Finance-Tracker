"use client";

import { forwardRef } from "react";
import { Loader2, Check } from "lucide-react";
import { useSettings } from "@/lib/settings-context";

function lighten(hex: string, amt: number) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return hex;
  return "#" + m.map((x) => Math.min(255, Math.round(parseInt(x, 16) + 255 * amt)).toString(16).padStart(2, "0")).join("");
}
function darken(hex: string, amt: number) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return hex;
  return "#" + m.map((x) => Math.max(0, Math.round(parseInt(x, 16) * (1 - amt))).toString(16).padStart(2, "0")).join("");
}
function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

export type AppButtonVariant = "primary" | "ghost" | "outline" | "danger" | "subtle";

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  saving?: boolean;
  saved?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  savedLabel?: string;
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const SIZE = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-8 py-3 text-base gap-2",
};

const AppButton = forwardRef<HTMLButtonElement, AppButtonProps>(
  (
    {
      variant = "primary",
      saving, saved,
      saveLabel = "Save Changes", savingLabel = "Saving...", savedLabel = "Saved",
      size = "md",
      children, className = "", disabled, style, ...props
    },
    ref
  ) => {
    const { chartColor } = useSettings();
    const rgb = hexToRgb(chartColor);

    const label = saving ? savingLabel : saved ? savedLabel : saveLabel;
    const content = children ?? label;

    const variantStyle: React.CSSProperties =
      variant === "primary"
        ? {
            background: `linear-gradient(to bottom, ${lighten(chartColor, 0.20)}, ${darken(chartColor, 0.28)})`,
            boxShadow: `0 0 12px ${chartColor}55, inset 0 1px 0 ${lighten(chartColor, 0.20)}`,
          }
        : variant === "outline"
        ? {
            color: chartColor,
            border: `1.5px solid rgba(${rgb},0.35)`,
            background: `rgba(${rgb},0.06)`,
          }
        : {};

    const variantClass =
      variant === "primary"
        ? "text-white"
        : variant === "ghost"
        ? "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        : variant === "outline"
        ? ""
        : variant === "danger"
        ? "text-rose-500 border border-red-200 dark:border-red-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        : variant === "subtle"
        ? "text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        : "";

    return (
      <button
        ref={ref}
        {...props}
        disabled={disabled || saving || saved}
        style={{ ...variantStyle, ...style }}
        className={`inline-flex items-center justify-center rounded-lg font-medium transition disabled:opacity-40 cursor-pointer ${SIZE[size]} ${variantClass} ${className}`}
      >
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {saved && <Check className="h-3.5 w-3.5" />}
        {content}
      </button>
    );
  }
);

AppButton.displayName = "AppButton";
export { AppButton };
