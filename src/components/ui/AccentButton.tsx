"use client";

import { useSettings } from "@/lib/settings-context";

// Backward-compat re-exports — use AppButton directly in new code
export { AppButton as AccentButton } from "@/components/ui/AppButton";

export function AccentToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const { chartColor } = useSettings();
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={checked ? {
        background: chartColor,
        boxShadow: `0 0 8px ${chartColor}44`,
      } : {}}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${checked ? "" : "bg-neutral-300 dark:bg-neutral-600"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
