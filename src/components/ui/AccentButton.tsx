"use client";

// Backward-compat re-exports — use AppButton directly in new code
export { AppButton as AccentButton } from "@/components/ui/AppButton";

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

export function AccentToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const { chartColor } = useSettings();
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={checked ? {
        background: `linear-gradient(to bottom, ${lighten(chartColor, 0.15)}, ${darken(chartColor, 0.20)})`,
        boxShadow: `0 0 8px ${chartColor}44`,
      } : {}}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${checked ? "" : "bg-neutral-300 dark:bg-neutral-600"}`}
    >
      <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}
