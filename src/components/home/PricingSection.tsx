"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { Check, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppButton } from "@/components/ui/AppButton";

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

const allFeatures = [
  { label: "Transactions/month",     values: ["50/month",   "Unlimited",  "Unlimited"] },
  { label: "Analytics",              values: [true,          true,          true] },
  { label: "Accounts",               values: ["2 accounts", "Unlimited",  "Unlimited"] },
  { label: "AI insights",            values: [,     true,          true] },
  { label: "Multi-currency support", values: [false,         true,          true] },
  { label: "Export reports",         values: [false,         true,          true] },
  { label: "Team collaboration",     values: [false,         false,         true] },
  { label: "API access",             values: [false,         false,         true] },
  { label: "Dedicated support",      values: [false,         false,         true] },
];

const plans = [
  { name: "Free",     priceNum: "0",  period: "forever",   cta: "Get Started",      href: "/sign-in" },
  { name: "Pro",      priceNum: "9",  period: "per month", cta: "Start Free Trial",  href: "/sign-in" },
  { name: "Business", priceNum: "29", period: "per month", cta: "Contact Sales",     href: "/sign-in" },
];

export default function PricingSection() {
  const { chartColor, currencySymbol } = useSettings();
  const t = useT();
  const [active, setActive] = useState(1);

  const allFeatures = [
    { label: t("pricing.features.transactions"),     values: [t("pricing.features.50month"),   t("pricing.features.unlimited"),  t("pricing.features.unlimited")] },
    { label: t("pricing.features.analytics"),        values: [true,          true,          true] },
    { label: t("pricing.features.accounts"),         values: [t("pricing.features.2accounts"), t("pricing.features.unlimited"),  t("pricing.features.unlimited")] },
    { label: t("pricing.features.aiInsights"),       values: [,     true,          true] },
    { label: t("pricing.features.multiCurrency"),    values: [false,         true,          true] },
    { label: t("pricing.features.exportReports"),    values: [false,         true,          true] },
    { label: t("pricing.features.teamCollab"),       values: [false,         false,         true] },
    { label: t("pricing.features.apiAccess"),        values: [false,         false,         true] },
    { label: t("pricing.features.dedicatedSupport"), values: [false,         false,         true] },
  ];

  const plans = [
    { name: t("pricing.freeName"),     priceNum: "0",  period: t("pricing.forever"),   cta: t("pricing.free"),      href: "/sign-in" },
    { name: t("pricing.proName"),      priceNum: "9",  period: t("pricing.perMonth"), cta: t("pricing.pro"),  href: "/sign-in" },
    { name: t("pricing.businessName"), priceNum: "29", period: t("pricing.perMonth"), cta: t("pricing.business"),     href: "/sign-in" },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: chartColor }}>{t("pricing.label")}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("pricing.title")}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="relative flex rounded-full bg-neutral-200 dark:bg-neutral-800 p-1 gap-1">
            {plans.map((plan, i) => (
              <button
                key={plan.name}
                onClick={() => setActive(i)}
                className={cn(
                  "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  active === i ? "text-white" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                )}
              >
                {active === i && (
                  <motion.span
                    layoutId="pricing-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: `linear-gradient(to bottom, ${lighten(chartColor, 0.20)}, ${darken(chartColor, 0.28)})` }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{plan.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-stretch">
          {plans.map((plan, i) => {
            const isActive = i === active;

            return (
              <motion.div
                key={plan.name}
                onClick={() => setActive(i)}
                animate={{
                  scale: isActive ? 1.04 : 0.97,
                  opacity: isActive ? 1 : 0.8,
                  y: isActive ? -6 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="relative rounded-2xl p-6 flex flex-col cursor-pointer bg-white dark:bg-neutral-900"
                style={{
                  border: isActive ? `2px solid ${chartColor}` : `2px solid transparent`,
                  boxShadow: isActive
                    ? `0 0 0 1px ${chartColor}22, 0 20px 60px ${chartColor}25`
                    : "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                {/* Most Popular badge */}
                {i === 1 && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap text-white"
                    style={{ background: `linear-gradient(to bottom, ${lighten(chartColor, 0.20)}, ${darken(chartColor, 0.28)})` }}
                  >
                    {t("pricing.mostPopular")}
                  </div>
                )}

                {/* Plan name */}
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: isActive ? chartColor : "rgba(0,0,0,0.4)" }}
                >
                  {plan.name}
                </div>

                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                      {currencySymbol}{plan.priceNum}
                    </span>
                    <span className="text-sm mb-2 text-neutral-400">/{plan.period}</span>
                  </div>
                </div>

                {/* CTA button */}
                <AppButton
                  variant="primary"
                  size="lg"
                  className={`w-full rounded-xl mb-5 !border-0 ${!isActive ? "opacity-75" : ""}`}
                  onClick={(e) => { e.stopPropagation(); window.location.href = plan.href; }}
                >
                  {plan.cta}
                </AppButton>

                {/* Divider */}
                <div className="h-px w-full bg-neutral-100 dark:bg-neutral-800 mb-5" />

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {allFeatures.map((feature) => {
                    const val = feature.values[i];
                    const isString = typeof val === "string";
                    const isFalse = val === false;

                    return (
                      <li key={feature.label} className="flex items-center gap-2.5 text-sm">
                        <span
                          className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0"
                          style={{
                            background: isFalse ? "rgba(239,68,68,0.1)" : `${chartColor}18`,
                          }}
                        >
                          {isFalse
                            ? <X className="h-3 w-3 text-red-500" />
                            : <Check className="h-3 w-3" style={{ color: chartColor }} />
                          }
                        </span>
                        <span className={cn(
                          isFalse
                            ? "text-neutral-400 dark:text-neutral-600 line-through"
                            : "text-neutral-700 dark:text-neutral-300"
                        )}>
                          {feature.label}
                          {isString && (
                            <span className="ml-1 font-semibold" style={{ color: chartColor }}>
                              — {val}
                            </span>
                          )}
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
