"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import { useSettings } from "@/lib/settings-context";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const { chartColor } = useSettings();
  const rgb = hexToRgb(chartColor);

  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-neutral-950">

      {/* Top spotlight */}
      <div
        aria-hidden={true}
        suppressHydrationWarning
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-0"
        style={{
          width: 900,
          height: 600,
          background: `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.18) 0%, rgba(${rgb},0.07) 40%, transparent 70%)`,
        }}
      />

      {/* Ambient orbs */}
      <div suppressHydrationWarning className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div suppressHydrationWarning className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: `rgba(${rgb},0.08)` }} />
        <div suppressHydrationWarning className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: `rgba(${rgb},0.06)` }} />
        <div suppressHydrationWarning className="absolute -bottom-24 left-1/4 w-[350px] h-[350px] rounded-full blur-[90px]" style={{ background: `rgba(${rgb},0.05)` }} />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden={true}
        suppressHydrationWarning
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(${rgb},1) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <Navbar showLinks={false} />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
