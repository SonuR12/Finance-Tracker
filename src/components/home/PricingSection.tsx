"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AppButton } from "@/components/ui/AppButton";

export default function PricingSection() {
  const { currencySymbol } = useSettings();
  const t = useT();
  const [active, setActive] = useState(1);

  const allFeatures = [
    { label: t("pricing.features.transactions"),     values: [t("pricing.features.50month"),   t("pricing.features.unlimited"),  t("pricing.features.unlimited")] },
    { label: t("pricing.features.analytics"),        values: [true,          true,          true] },
    { label: t("pricing.features.accounts"),         values: [t("pricing.features.2accounts"), t("pricing.features.unlimited"),  t("pricing.features.unlimited")] },
    { label: t("pricing.features.aiInsights"),       values: [undefined,     true,          true] },
    { label: t("pricing.features.multiCurrency"),    values: [false,         true,          true] },
    { label: t("pricing.features.exportReports"),    values: [false,         true,          true] },
    { label: t("pricing.features.teamCollab"),       values: [false,         false,         true] },
    { label: t("pricing.features.apiAccess"),        values: [false,         false,         true] },
    { label: t("pricing.features.dedicatedSupport"), values: [false,         false,         true] },
  ];

  const plans = [
    { name: t("pricing.freeName"),     priceNum: "0",  period: t("pricing.forever"),   cta: t("pricing.free"),     href: "/sign-in" },
    { name: t("pricing.proName"),      priceNum: "9",  period: t("pricing.perMonth"),  cta: t("pricing.pro"),      href: "/sign-in" },
    { name: t("pricing.businessName"), priceNum: "29", period: t("pricing.perMonth"),  cta: t("pricing.business"), href: "/sign-in" },
  ];

  const gradientStyle = {
    background: "linear-gradient(to bottom, color-mix(in srgb, var(--app-accent) 85%, white), color-mix(in srgb, var(--app-accent) 72%, black))",
  };

  return (
    <section id="pricing" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>{t("pricing.label")}</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("pricing.title")}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto hidden sm:block">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-12">
          <div className="relative flex rounded-full bg-neutral-200 dark:bg-neutral-800 p-1 gap-1">
            {plans.map((plan, i) => (
              <button
                key={plan.name}
                onClick={() => setActive(i)}
                className={cn(
                  "relative z-10 px-4 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-sm font-medium rounded-full transition-colors duration-200",
                  active === i ? "text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                {active === i && (
                  <motion.span
                    layoutId="pricing-pill"
                    className="absolute inset-0 rounded-full"
                    style={gradientStyle}
                  />
                )}
                <span className="relative z-10">{plan.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile: show only active plan */}
        <div className="sm:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl p-5 bg-white dark:bg-neutral-900"
              style={{
                border: "2px solid var(--app-accent)",
                boxShadow: "0 0 0 1px color-mix(in srgb, var(--app-accent) 13%, transparent), 0 20px 60px color-mix(in srgb, var(--app-accent) 15%, transparent)",
              }}
            >
              {active === 1 && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap text-white"
                  style={gradientStyle}
                >
                  {t("pricing.mostPopular")}
                </div>
              )}

              <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--app-accent)" }}>
                {plans[active].name}
              </div>

              <div className="flex items-end gap-1 mb-4">
                <span className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {currencySymbol}{plans[active].priceNum}
                </span>
                <span className="text-sm mb-1 text-neutral-400">/{plans[active].period}</span>
              </div>

              <AppButton
                variant="primary" size="lg"
                className="w-full rounded-xl mb-4 h-10 !border-0"
                onClick={() => window.location.href = plans[active].href}
              >
                {plans[active].cta}
              </AppButton>

              <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800 mb-4" />

              <ul className="space-y-2.5">
                {allFeatures.map((feature) => {
                  const val = feature.values[active];
                  const isString = typeof val === "string";
                  const isFalse = val === false;
                  return (
                    <li key={feature.label} className="flex items-center gap-2.5 text-sm">
                      <span
                        className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                        style={{ background: isFalse ? "rgba(239,68,68,0.1)" : "color-mix(in srgb, var(--app-accent) 9%, transparent)" }}
                      >
                        {isFalse
                          ? <X className="h-3 w-3 text-red-500" />
                          : <Check className="h-3 w-3" style={{ color: "var(--app-accent)" }} />
                        }
                      </span>
                      <span className={cn(isFalse ? "text-neutral-400 line-through" : "text-neutral-700 dark:text-neutral-300")}>
                        {feature.label}
                        {isString && <span className="ml-1 font-semibold" style={{ color: "var(--app-accent)" }}>— {val}</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: 3-col grid */}
        <div className="hidden sm:grid grid-cols-3 gap-4 items-stretch">
          {plans.map((plan, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={plan.name}
                onClick={() => setActive(i)}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
                className="relative rounded-2xl p-6 flex flex-col cursor-pointer bg-white dark:bg-neutral-900"
                style={{
                  border: isActive ? "2px solid var(--app-accent)" : "2px solid transparent",
                  boxShadow: isActive
                    ? "0 0 0 1px color-mix(in srgb, var(--app-accent) 13%, transparent), 0 20px 60px color-mix(in srgb, var(--app-accent) 15%, transparent)"
                    : "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {i === 1 && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap text-white" style={gradientStyle}>
                    {t("pricing.mostPopular")}
                  </div>
                )}
                <div className={cn("text-xs font-bold uppercase tracking-widest mb-3", !isActive && "text-neutral-400 dark:text-neutral-500")} style={isActive ? { color: "var(--app-accent)" } : {}}>
                  {plan.name}
                </div>
                <div className="mb-5">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                      {currencySymbol}{plan.priceNum}
                    </span>
                    <span className="text-sm mb-2 text-neutral-400">/{plan.period}</span>
                  </div>
                </div>
                <AppButton
                  variant="primary" size="lg"
                  className={`w-full rounded-xl mb-5 !border-0 ${!isActive ? "opacity-75" : ""}`}
                  onClick={(e) => { e.stopPropagation(); window.location.href = plan.href; }}
                >
                  {plan.cta}
                </AppButton>
                <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800 mb-5" />
                <ul className="space-y-3 flex-1">
                  {allFeatures.map((feature) => {
                    const val = feature.values[i];
                    const isString = typeof val === "string";
                    const isFalse = val === false;
                    return (
                      <li key={feature.label} className="flex items-center gap-2.5 text-sm">
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                          style={{ background: isFalse ? "rgba(239,68,68,0.1)" : "color-mix(in srgb, var(--app-accent) 9%, transparent)" }}
                        >
                          {isFalse
                            ? <X className="h-3 w-3 text-red-500" />
                            : <Check className="h-3 w-3" style={{ color: "var(--app-accent)" }} />
                          }
                        </span>
                        <span className={cn(isFalse ? "text-neutral-400 dark:text-neutral-600 line-through" : "text-neutral-700 dark:text-neutral-300")}>
                          {feature.label}
                          {isString && <span className="ml-1 font-semibold" style={{ color: "var(--app-accent)" }}>— {val}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
