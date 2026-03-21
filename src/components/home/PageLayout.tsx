"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-neutral-950">

      {/* Top spotlight */}
      <div
        aria-hidden={true}
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 z-0"
        style={{
          width: 900,
          height: 600,
          background: "radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--app-accent) 18%, transparent) 0%, color-mix(in srgb, var(--app-accent) 7%, transparent) 40%, transparent 70%)",
        }}
      />

      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "color-mix(in srgb, var(--app-accent) 8%, transparent)" }} />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "color-mix(in srgb, var(--app-accent) 6%, transparent)" }} />
        <div className="absolute -bottom-24 left-1/4 w-[350px] h-[350px] rounded-full blur-[90px]" style={{ background: "color-mix(in srgb, var(--app-accent) 5%, transparent)" }} />
      </div>

      {/* Dot grid */}
      <div
        aria-hidden={true}
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--app-accent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <Navbar showLinks={false} />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
