"use client";

// Backward-compat re-exports — use AppButton directly in new code
export { AppButton as AccentButton } from "@/components/ui/AppButton";

export function AccentToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={checked ? {
        background: "linear-gradient(to bottom, color-mix(in srgb, var(--app-accent) 115%, white), color-mix(in srgb, var(--app-accent) 80%, black))",
        boxShadow: "0 0 8px color-mix(in srgb, var(--app-accent) 27%, transparent)",
      } : {}}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${checked ? "" : "bg-neutral-300 dark:bg-neutral-600"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
