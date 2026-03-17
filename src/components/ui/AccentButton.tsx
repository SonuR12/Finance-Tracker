"use client";

import { Loader2, Check } from "lucide-react";

interface AccentButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  saving?: boolean;
  saved?: boolean;
  saveLabel?: string;
  savingLabel?: string;
  savedLabel?: string;
}

export function AccentButton({
  saving, saved, saveLabel = "Save Changes", savingLabel = "Saving...", savedLabel = "Saved",
  children, className = "", disabled, ...props
}: AccentButtonProps) {
  const label = saving ? savingLabel : saved ? savedLabel : saveLabel;
  return (
    <button
      {...props}
      disabled={disabled || saving || saved}
      style={{ background: "var(--app-accent)" }}
      className={`inline-flex items-center justify-center gap-2 rounded-lg text-white text-sm px-4 py-2 transition disabled:opacity-40 ${className}`}
    >
      {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {saved && <Check className="h-3.5 w-3.5" />}
      {children ?? label}
    </button>
  );
}

export function AccentToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      style={checked ? { background: "var(--app-accent)" } : {}}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${checked ? "" : "bg-neutral-300 dark:bg-neutral-600"}`}>
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
