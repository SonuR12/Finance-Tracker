"use client";

import { forwardRef } from "react";
import { Loader2, Check } from "lucide-react";

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
  lg: "px-4 py-1.5 text-xs gap-1.5 sm:px-8 sm:py-3 sm:text-base sm:gap-2",
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
    const label = saving ? savingLabel : saved ? savedLabel : saveLabel;
    const content = children ?? label;

    const variantStyle: React.CSSProperties =
      variant === "primary"
        ? {
            background: "linear-gradient(to bottom, color-mix(in srgb, var(--app-accent) 80%, white), color-mix(in srgb, var(--app-accent) 72%, black))",
            boxShadow: "0 0 12px color-mix(in srgb, var(--app-accent) 33%, transparent), inset 0 1px 0 color-mix(in srgb, var(--app-accent) 80%, white)",
          }
        : variant === "outline"
        ? {
            color: "var(--app-accent)",
            border: "1.5px solid color-mix(in srgb, var(--app-accent) 35%, transparent)",
            background: "color-mix(in srgb, var(--app-accent) 6%, transparent)",
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
