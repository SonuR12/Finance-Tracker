"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n-context";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

export default function CTASection() {
  const t = useT();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="relative overflow-hidden rounded-3xl p-7 sm:p-12 md:p-16 text-center"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% -10%, color-mix(in srgb, var(--app-accent) 25%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 80% 80%, color-mix(in srgb, var(--app-accent) 15%, transparent) 0%, transparent 60%),
              radial-gradient(ellipse 40% 40% at 20% 80%, color-mix(in srgb, var(--app-accent) 10%, transparent) 0%, transparent 60%)
            `,
            border: "1px solid color-mix(in srgb, var(--app-accent) 20%, transparent)",
            boxShadow: "0 0 0 1px color-mix(in srgb, var(--app-accent) 8%, transparent), 0 24px 60px color-mix(in srgb, var(--app-accent) 12%, transparent)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Mesh grid */}
          <div
            className="absolute inset-0 opacity-40 dark:opacity-20"
            style={{
              backgroundImage: `linear-gradient(color-mix(in srgb, var(--app-accent) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--app-accent) 8%, transparent) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Glow orbs */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl" style={{ background: "color-mix(in srgb, var(--app-accent) 20%, transparent)" }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl" style={{ background: "color-mix(in srgb, var(--app-accent) 15%, transparent)" }} />

          <div className="relative z-10 space-y-6">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
              style={{
              background: "color-mix(in srgb, var(--app-accent) 10%, transparent)",
                border: "1px solid color-mix(in srgb, var(--app-accent) 25%, transparent)",
                color: "var(--app-accent)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {t("cta.badge")}
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-neutral-900 dark:text-neutral-100">
              {t("cta.title")}
            </h2>

            {/* Subtitle */}
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-base sm:text-lg">
              {t("cta.subtitle")}
            </p>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <AppButton
                variant="primary"
                className="!rounded-full !border-0 group text-xs !py-2 !px-4 sm:!py-3.5 sm:!px-6"
                style={{ boxShadow: "0 0 24px color-mix(in srgb, var(--app-accent) 33%, transparent), inset 0 1px 0 rgba(255,255,255,0.2)" }}
                onClick={() => window.location.href = "/sign-in"}
              >
                {t("cta.button")}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </AppButton>
              <AppButton
                variant="outline"
                className="!rounded-full text-xs !py-2 !px-4 sm:!py-3.5 sm:!px-6"
                onClick={() => window.location.href = "/#features"}
              >
                {t("cta.learnMore")}
              </AppButton>
            </div>

            <p className="text-sm text-neutral-400 dark:text-neutral-500">
              {t("cta.noCard")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
