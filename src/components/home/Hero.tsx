"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useT } from "@/lib/i18n-context";
import { useSettings } from "@/lib/settings-context";
import { useSession } from "next-auth/react";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

function hexToRgb(hex: string): string {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

const GRADIENTS: Record<string, string> = {
  "#6366f1": "linear-gradient(90deg, #6366f1 0%, #a78bfa 25%, #38bdf8 50%, #a78bfa 75%, #6366f1 100%)",
  "#3b82f6": "linear-gradient(90deg, #3b82f6 0%, #93c5fd 25%, #06b6d4 50%, #93c5fd 75%, #3b82f6 100%)",
  "#10b981": "linear-gradient(90deg, #10b981 0%, #6ee7b7 25%, #06b6d4 50%, #6ee7b7 75%, #10b981 100%)",
  "#8b5cf6": "linear-gradient(90deg, #8b5cf6 0%, #c084fc 25%, #f472b6 50%, #c084fc 75%, #8b5cf6 100%)",
  "#f43f5e": "linear-gradient(90deg, #f43f5e 0%, #fb7185 25%, #fb923c 50%, #fb7185 75%, #f43f5e 100%)",
  "#f59e0b": "linear-gradient(90deg, #f59e0b 0%, #fcd34d 25%, #f87171 50%, #fcd34d 75%, #f59e0b 100%)",
  "#06b6d4": "linear-gradient(90deg, #06b6d4 0%, #67e8f9 25%, #818cf8 50%, #67e8f9 75%, #06b6d4 100%)",
  "#ec4899": "linear-gradient(90deg, #ec4899 0%, #f9a8d4 25%, #c084fc 50%, #f9a8d4 75%, #ec4899 100%)",
};

function getGradient(color: string): string {
  return GRADIENTS[color] ?? `linear-gradient(90deg, ${color} 0%, ${color}99 25%, ${color}cc 50%, ${color}99 75%, ${color} 100%)`;
}

export default function Hero() {
  const t = useT();
  const { chartColor } = useSettings();
  const { data: session } = useSession();
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = imageRef.current;
    const handleScroll = () => {
      if (window.scrollY > 100) el?.classList.add("image-animate");
      else el?.classList.remove("image-animate");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rgb = hexToRgb(chartColor);

  return (
    // Hero is always a dark section — black bg regardless of theme
    <section className="hero-root">
      <div className="hero-lines" aria-hidden />

      {/* Spotlight */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)",
          width: 900, height: 600, pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.28) 0%, rgba(${rgb},0.1) 40%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-20 sm:pt-28 pb-0">

        {/* Pill */}
        <motion.a
          href="/sign-in"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-pill group mb-6 sm:mb-10"
          style={{ borderColor: `${chartColor}40` }}
        >
          <span className="hero-pill-dot" style={{ background: chartColor, boxShadow: `0 0 6px 2px ${chartColor}99` }} />
          <span className="text-sm text-white/70">Introducing AI Finance Insights</span>
          <ArrowRight className="h-3.5 w-3.5 text-white/70 transition-transform group-hover:translate-x-0.5" />
        </motion.a>

        {/* Headline */}
        <h1 className="hero-headline">
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              backgroundImage: `linear-gradient(135deg, #ffffff 0%, #a0a0a0 50%, #ffffff 100%)`,
            }}
          >
            Track Budget
          </motion.span>
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.22 }}
            style={{
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              backgroundImage: getGradient(chartColor),
              backgroundSize: "200% auto",
              animation: "shimmerMove 3s linear infinite",
            }}
          >
            Grow Smarter
          </motion.span>
        </h1>

        {/* Subtitle */}
        <motion.p className="hero-subtitle px-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.42 }}>
          {t("hero.subtitle")}
        </motion.p>

        {/* Buttons */}
        <motion.div className="flex flex-wrap items-center justify-center gap-3 mt-8" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.58 }}>
          <AppButton
            variant="primary" size="lg"
            className="hero-btn-primary group rounded-full !border-0"
            style={{ boxShadow: `0 0 24px ${chartColor}55, inset 0 1px 0 rgba(255,255,255,0.2)` }}
            onClick={() => window.location.href = session?.user ? "/dashboard" : "/sign-in"}
          >
            {session?.user
              ? <><LayoutDashboard className="h-4 w-4" />Dashboard</>
              : <>{t("hero.cta")}<ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" /></>
            }
          </AppButton>
          <Link href="#features" className="hero-btn-ghost">
            {t("hero.demo")}
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p className="mt-6 text-sm text-black/35 dark:text-white/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.75 }}>
          Trusted by <span className="text-black/60 dark:text-white/60 font-medium">50,000+</span> users · Free to start · No credit card required
        </motion.p>

        {/* Dashboard image */}
        <motion.div className="heroimage-wrapper mt-10 sm:mt-16 w-full max-w-5xl" initial={{ opacity: 0, y: 48 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.85 }}>
          <div
            ref={imageRef}
            className="heroimage relative w-full min-h-[380px] sm:min-h-[480px] md:min-h-[580px] overflow-hidden rounded-xl"
            style={{ border: "1px solid rgba(255,255,255,0.08)", boxShadow: `0 0 0 1px ${chartColor}22, 0 40px 100px rgba(0,0,0,0.8), 0 0 80px ${chartColor}14` }}
          >
            <Image
              src="/images/hero.jpeg"
              alt="Finance Dashboard"
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 h-48" style={{ background: "linear-gradient(to top, #000, transparent)" }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
