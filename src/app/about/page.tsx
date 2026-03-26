"use client";

import PageLayout from "@/components/home/PageLayout";
import { useT } from "@/lib/i18n-context";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import { BarChart3, Shield, Zap, Heart, Globe, Users } from "lucide-react";

const stack = [
  { name: "Next.js 16", category: "Framework", desc: "App Router, Server Components, and API routes power the entire platform.", icon: "/icons/Nextjs.png" },
  { name: "MongoDB", category: "Database", desc: "Flexible document storage for transactions, users, and financial data.", icon: "/icons/Mongodb.png" },
  { name: "Prisma", category: "ORM", desc: "Type-safe database access with auto-generated queries and migrations.", icon: "/icons/Prisma.png" },
  { name: "NextAuth v5", category: "Auth", desc: "Secure session management with OTP email verification via Nodemailer.", icon: "/icons/NextAuth.png" },
  { name: "Tailwind CSS v4", category: "Styling", desc: "Utility-first CSS with custom design tokens and dark mode support.", icon: "/icons/TailwindCss.png" },
  { name: "Framer Motion", category: "Animation", desc: "Smooth page transitions, scroll animations, and micro-interactions.", icon: "/icons/FramerMotion.png" },
  { name: "Recharts", category: "Charts", desc: "Interactive area, bar, and pie charts for financial visualizations.", icon: "/icons/Rechart.jpeg" },
  { name: "React Three Fiber", category: "3D", desc: "Three.js-powered animated 3D scene on the authentication page.", icon: "/icons/ReactThreeFiber.png" },
  { name: "OpenAI API", category: "AI", desc: "GPT-powered spending insights, anomaly detection, and smart suggestions.", icon: "/icons/OpenAI.jpg" },
  { name: "next-intl", category: "i18n", desc: "15-language support with locale-aware formatting and routing.", icon: "/icons/NextIntl.png" },
  { name: "Shadcn UI", category: "UI", desc: "Accessible, composable component primitives built on Radix UI.", icon: "/icons/Shadcn.png" },
  { name: "Vercel", category: "Deploy", desc: "Edge-optimized deployments with automatic CI/CD on every push.", icon: "/icons/Vercel.png" },
];

const VALUE_ICONS = [Shield, Zap, Heart, Globe, BarChart3, Users];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
};

const stackContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const stackItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function AboutPage() {
  const t = useT();

  const values = [
    { Icon: VALUE_ICONS[0], titleKey: "about.value1Title", descKey: "about.value1Desc" },
    { Icon: VALUE_ICONS[1], titleKey: "about.value2Title", descKey: "about.value2Desc" },
    { Icon: VALUE_ICONS[2], titleKey: "about.value3Title", descKey: "about.value3Desc" },
    { Icon: VALUE_ICONS[3], titleKey: "about.value4Title", descKey: "about.value4Desc" },
    { Icon: VALUE_ICONS[4], titleKey: "about.value5Title", descKey: "about.value5Desc" },
    { Icon: VALUE_ICONS[5], titleKey: "about.value6Title", descKey: "about.value6Desc" },
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -10%, color-mix(in srgb, var(--app-accent) 12%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            {...fadeUp}
            className="text-xl font-semibold uppercase tracking-widest mb-4"
            style={{ color: "var(--app-accent)" }}
          >
            {t("about.label")}
          </motion.p>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6"
          >
            {t("about.title")}
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-md sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto"
          >
            {t("about.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} className="space-y-5">
            <p
              className="text-4xl sm:text-5xl font-semibold uppercase tracking-widest"
              style={{ color: "var(--app-accent)" }}
            >
              {t("about.storyLabel")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              {t("about.storyTitle")}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t("about.storyP1")}
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t("about.storyP2")}
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800"
          >
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85&auto=format&fit=crop"
              alt="Dashboard"
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--app-accent) 30%, transparent) 0%, transparent 60%)",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="pt-10 sm:pt-16 md:pt-24 pb-10 sm:pb-0 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3">
            <p className="text-lg font-medium uppercase tracking-widest" style={{ color: "var(--app-accent)"}}>
              {t("about.valuesLabel")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">{t("about.valuesTitle")}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3  gap-3 sm:gap-4">
            {values.map(({ Icon, titleKey, descKey }, i) => (
              <motion.div
                key={i}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-6 space-y-2 sm:space-y-3 transition-colors duration-300 flex flex-col items-center text-center sm:items-start sm:text-left"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--app-accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--app-accent) 12%, transparent)", color: "var(--app-accent)" }}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">{t(titleKey)}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed hidden sm:block">{t(descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p
              className="text-lg font-semibold uppercase tracking-widest"
              style={{ color: "var(--app-accent)" }}
            >
              {t("about.techLabel")}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">
              {t("about.techTitle")}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
              {t("about.techSubtitle")}
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
            variants={stackContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
          >
            {stack.map((item, i) => (
              <motion.div
                key={i}
                variants={stackItem}
                style={{ willChange: "opacity, transform" }}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start transition-colors duration-300"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--app-accent)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-white border border-neutral-100 dark:border-neutral-700 shadow-sm">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-contain rounded-2xl w-7 h-8"
                  />
                </div>
                <div className="min-w-0 space-y-0.5 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                      {item.name}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                      style={{
                        background: "color-mix(in srgb, var(--app-accent) 12%, transparent)",
                        color: "var(--app-accent)",
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Culture */}
      <section className="pb-10 sm:pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-8 sm:mb-12 space-y-2 sm:space-y-3">
            <p className="text-lg font-medium uppercase tracking-widest" style={{ color: "var(--app-accent)"}}>
              {t("about.cultureLabel")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">{t("about.cultureTitle")}</h2>
          </motion.div>

          <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Wide image */}
            <motion.div {...fadeUp} className="relative rounded-2xl overflow-hidden lg:col-span-2 h-48 sm:h-[200px]">
              <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=85&auto=format&fit=crop" alt="Remote team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">{t("about.cultureLabel")}</span>
                <p className="text-sm sm:text-base text-white font-semibold mt-0.5">{t("about.remoteFirst")}</p>
              </div>
            </motion.div>

            {/* Quote 1 */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 flex flex-col justify-between min-h-[150px] sm:min-h-0"
            >
              <p className="text-2xl leading-none" style={{ color: "var(--app-accent)" }}>&ldquo;</p>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed italic">{t("about.quote1")}</p>
              <p className="text-xs text-neutral-400 mt-2">{t("about.quote1Author")}</p>
            </motion.div>

            {/* Stats — side by side on mobile */}
            <div className="grid grid-cols-2 gap-3 sm:contents">
              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}
                className="rounded-2xl p-5 sm:p-6 flex flex-col justify-center items-center text-center"
                style={{ background: "color-mix(in srgb, var(--app-accent) 8%, transparent)", border: "1.5px solid color-mix(in srgb, var(--app-accent) 18%, transparent)" }}
              >
                <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--app-accent)" }}>40+</div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">{t("about.countriesLabel")}</div>
              </motion.div>

              <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 flex flex-col justify-center items-center text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold" style={{ color: "var(--app-accent)" }}>100%</div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">{t("about.remoteAsync")}</div>
              </motion.div>
            </div>

            {/* Deep work image */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.16 }} className="relative rounded-2xl overflow-hidden h-40 sm:h-[200px]">
              <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=85&auto=format&fit=crop" alt="Deep work" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-sm text-white font-semibold">{t("about.deepWork")}</p>
              </div>
            </motion.div>

            {/* Quote 2 */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.24 }}
              className="rounded-2xl p-5 sm:p-6 flex flex-col justify-center lg:col-span-2"
              style={{ background: "color-mix(in srgb, var(--app-accent) 6%, transparent)", border: "1.5px solid color-mix(in srgb, var(--app-accent) 18%, transparent)" }}
            >
              <p className="text-2xl leading-none mb-2" style={{ color: "var(--app-accent)" }}>&ldquo;</p>
              <p className="text-sm sm:text-base md:text-lg font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed italic">{t("about.quote2")}</p>
              <p className="text-xs text-neutral-400 mt-3">{t("about.quote2Author")}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}



