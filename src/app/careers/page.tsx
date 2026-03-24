"use client";

import PageLayout from "@/components/home/PageLayout";
import { useT } from "@/lib/i18n-context";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Zap, Heart, Globe, Users } from "lucide-react";

const openings = [
  { id: 1, title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build and scale the core Finance AI platform using Next.js, TypeScript, and MongoDB." },
  { id: 2, title: "AI/ML Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Design and train models for transaction categorization, anomaly detection, and spending insights." },
  { id: 3, title: "Product Designer", dept: "Design", location: "Remote", type: "Full-time", desc: "Own the end-to-end design of new features from research and wireframes to polished UI." },
  { id: 4, title: "Growth Marketing Manager", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Drive user acquisition and retention through data-driven campaigns and content strategy." },
  { id: 5, title: "Customer Success Lead", dept: "Support", location: "Remote", type: "Full-time", desc: "Be the voice of our users — help them get the most out of Finance AI and shape our roadmap." },
  { id: 6, title: "Frontend Engineer (Intern)", dept: "Engineering", location: "Remote", type: "Internship", desc: "Work alongside senior engineers to build responsive, accessible UI components in React." },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function CareersPage() {
  const t = useT();

  const perks = [
    { Icon: Globe,     titleKey: "careers.perk1Title", descKey: "careers.perk1Desc" },
    { Icon: Zap,       titleKey: "careers.perk2Title", descKey: "careers.perk2Desc" },
    { Icon: Heart,     titleKey: "careers.perk3Title", descKey: "careers.perk3Desc" },
    { Icon: Users,     titleKey: "careers.perk4Title", descKey: "careers.perk4Desc" },
    { Icon: Briefcase, titleKey: "careers.perk5Title", descKey: "careers.perk5Desc" },
    { Icon: Clock,     titleKey: "careers.perk6Title", descKey: "careers.perk6Desc" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--app-accent) 12%, transparent) 0%, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p {...fadeUp} className="text-lg font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--app-accent)" }}>{t("careers.label")}</motion.p>
          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
            {t("careers.title")}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            {t("careers.subtitle")}
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            {[`🌍 ${t("careers.fullyRemote")}`, `⚡ ${t("careers.fastMoving")}`, `📈 ${t("careers.equityAll")}`, `🎯 ${openings.length} ${t("careers.openRoles")}`].map((txt) => (
              <span key={txt} className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">{txt}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>{t("careers.whyLabel")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">{t("careers.perksTitle")}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {perks.map(({ Icon, titleKey, descKey }, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 sm:p-6 space-y-1 sm:space-y-3"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--app-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-0" style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)", color: "var(--app-accent)" }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{t(titleKey)}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>{t("careers.openRolesLabel")}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">{t("careers.joinTeam")}</h2>
          </motion.div>
          <div className="space-y-3">
            {openings.map((job, i) => (
              <motion.div key={job.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-colors duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--app-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{job.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)", color: "var(--app-accent)" }}>{job.dept}</span>
                    {job.type === "Internship" && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">Internship</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{job.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.type}</span>
                  </div>
                </div>
                <span
                  className="flex-shrink-0 w-fit inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "color-mix(in srgb, var(--app-accent) 10%, transparent)", color: "var(--app-accent)", border: "1.5px solid color-mix(in srgb, var(--app-accent) 20%, transparent)" }}
                >
                  {t("careers.comingSoon")}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center space-y-3"
          >
            <div className="text-2xl">🚧</div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{t("careers.noRoleTitle")}</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">{t("careers.noRoleDesc")}</p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
