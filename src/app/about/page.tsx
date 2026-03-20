"use client";

import PageLayout from "@/components/home/PageLayout";
import { useSettings } from "@/lib/settings-context";
import { motion } from "framer-motion";
import Image from "next/image";
import { BarChart3, Shield, Zap, Heart, Globe, Users } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

const values = [
  { Icon: Shield, title: "Security First", desc: "Your financial data is encrypted and protected with bank-grade security at every layer." },
  { Icon: Zap, title: "Speed & Simplicity", desc: "We believe powerful tools should be fast and easy to use, not complex and overwhelming." },
  { Icon: Heart, title: "User Obsessed", desc: "Every feature we build starts with a real user problem. Your feedback shapes our roadmap." },
  { Icon: Globe, title: "Built for Everyone", desc: "Multi-language, multi-currency support so anyone, anywhere can take control of their finances." },
  { Icon: BarChart3, title: "Data Transparency", desc: "We never sell your data. You own it, you control it, and you can export it anytime." },
  { Icon: Users, title: "Community Driven", desc: "50,000+ users help us improve every day. We grow together with our community." },
];

const stack = [
  { name: "Next.js 16", category: "Framework", desc: "App Router, Server Components, and API routes power the entire platform.", icon: "▲" },
  { name: "MongoDB", category: "Database", desc: "Flexible document storage for transactions, users, and financial data.", icon: "🍃" },
  { name: "Prisma", category: "ORM", desc: "Type-safe database access with auto-generated queries and migrations.", icon: "◈" },
  { name: "NextAuth v5", category: "Auth", desc: "Secure session management with OTP email verification via Nodemailer.", icon: "🔐" },
  { name: "Tailwind CSS v4", category: "Styling", desc: "Utility-first CSS with custom design tokens and dark mode support.", icon: "🎨" },
  { name: "Framer Motion", category: "Animation", desc: "Smooth page transitions, scroll animations, and micro-interactions.", icon: "✦" },
  { name: "Recharts", category: "Charts", desc: "Interactive area, bar, and pie charts for financial visualizations.", icon: "📊" },
  { name: "React Three Fiber", category: "3D", desc: "Three.js-powered animated 3D scene on the authentication page.", icon: "🌐" },
  { name: "OpenAI API", category: "AI", desc: "GPT-powered spending insights, anomaly detection, and smart suggestions.", icon: "🤖" },
  { name: "next-intl", category: "i18n", desc: "15-language support with locale-aware formatting and routing.", icon: "🌍" },
  { name: "Shadcn UI", category: "UI", desc: "Accessible, composable component primitives built on Radix UI.", icon: "⬡" },
  { name: "Vercel", category: "Deploy", desc: "Edge-optimized deployments with automatic CI/CD on every push.", icon: "⚡" },
];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55 } };

export default function AboutPage() {
  const { chartColor } = useSettings();
  const rgb = hexToRgb(chartColor);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(${rgb},0.12) 0%, transparent 60%)` }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p {...fadeUp} className="text-xl font-semibold uppercase tracking-widest mb-4" style={{ color: chartColor }}>About Us</motion.p>
          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
            We&apos;re on a mission to make<br />
            <span style={{ color: chartColor }}>finance simple</span> for everyone
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            Finance AI was built by a small team of developers and designers who were frustrated with complex, expensive financial tools. We set out to build something better.
          </motion.p>
        </div>
      </section>

      {/* Stats banner */}
      {/* <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[["50K+", "Active Users"], ["$2B+", "Tracked"], ["15", "Languages"], ["4.9★", "Rating"]].map(([val, label], i) => (
            <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <div className="text-3xl font-extrabold" style={{ color: chartColor }}>{val}</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section> */}

      {/* Story */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp} className="space-y-5">
            <p className="text-5xl font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Our Story</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">Started with a spreadsheet, built into a platform</h2>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              It started in 2026 when our founder, tired of juggling spreadsheets and disconnected banking apps, decided to build a unified finance tracker. What began as a personal project quickly grew into something thousands of people wanted.
            </p>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Today, Finance AI combines real-time transaction tracking, AI-powered insights, and beautiful visualizations into one platform — available in 15 languages and trusted by users across 40+ countries.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.15 }} className="relative h-72 sm:h-96 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
            <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=85&auto=format&fit=crop" alt="Dashboard" fill className="object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, rgba(${rgb},0.3) 0%, transparent 60%)` }} />
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-xl font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Our Values</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">What we stand for</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {values.map(({ Icon, title, desc }, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3 transition-colors duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = chartColor)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `rgba(${rgb},0.12)`, color: chartColor }}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ── Tech Stack ── */}
      <section className="pt-16 sm:pt-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Built With</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">Our tech stack</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">Every tool chosen for a reason — performance, developer experience, and reliability.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stack.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.45, delay: i * 0.04 }}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 flex gap-4 items-start transition-all duration-300 hover:-translate-y-0.5"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = chartColor)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `rgba(${rgb},0.1)` }}>
                  {item.icon}
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{item.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{ background: `rgba(${rgb},0.12)`, color: chartColor }}>{item.category}</span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Source / Community ── */}
      {/* <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Open Source</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">Built in public</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">Finance AI is open source. Read the code, report issues, or contribute — everyone is welcome.</p>
          </motion.div>

          GitHub stats row
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { Icon: Star, label: "Stars", value: "1.2k" },
              { Icon: GitFork, label: "Forks", value: "184" },
              { Icon: GitPullRequest, label: "Pull Requests", value: "96" },
            ].map(({ Icon, label, value }, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `rgba(${rgb},0.1)`, color: chartColor }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">{value}</div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">{label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          Contributors + CTA
          <div className="grid md:grid-cols-2 gap-6">
            Contributors list
            <motion.div {...fadeUp} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Top contributors</p>
              <div className="space-y-3">
                {contributors.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Image src={c.avatar} alt={c.name} width={36} height={36} className="rounded-full object-cover w-9 h-9 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">{c.name}</p>
                      <p className="text-xs text-neutral-400">{c.role}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0" style={{ background: `rgba(${rgb},0.1)`, color: chartColor }}>
                      {c.commits} commits
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            CTA card
            <motion.div {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-2xl p-6 flex flex-col justify-between gap-6"
              style={{ background: `rgba(${rgb},0.06)`, border: `1.5px solid rgba(${rgb},0.2)` }}
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: `rgba(${rgb},0.12)` }}>
                  🐙
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Want to contribute?</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Whether it's fixing a bug, adding a feature, or improving docs — every contribution matters. Check out our GitHub to get started.
                </p>
                <ul className="space-y-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                  {["Fork the repo and clone locally", "Pick an issue tagged good first issue", "Submit a PR — we review within 48h"].map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: chartColor }}>{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="https://github.com/SonuR12" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white self-start transition-all hover:opacity-90"
                style={{ background: chartColor, boxShadow: `0 4px 14px rgba(${rgb},0.35)` }}
              >
                View on GitHub <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* ── Culture Bento ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Culture</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">How we work</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">

            {/* Large image — spans 2 cols on lg */}
            <motion.div {...fadeUp} className="relative rounded-2xl overflow-hidden lg:col-span-2 row-span-1">
              <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=85&auto=format&fit=crop" alt="Remote team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="text-xs font-bold uppercase tracking-widest text-white/60">Culture</span>
                <p className="text-white font-semibold mt-0.5">Remote-first, results-driven</p>
              </div>
            </motion.div>

            {/* Quote card */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.08 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between"
            >
              <p className="text-2xl leading-none" style={{ color: chartColor }}>&ldquo;</p>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                We ship fast, learn faster, and always put the user first.
              </p>
              <p className="text-xs text-neutral-400 mt-2">— Sonu Rai, Founder</p>
            </motion.div>

            {/* Stat — 40+ countries */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.12 }}
              className="rounded-2xl p-6 flex flex-col justify-center items-center text-center"
              style={{ background: `rgba(${rgb},0.08)`, border: `1.5px solid rgba(${rgb},0.18)` }}
            >
              <div className="text-4xl font-extrabold" style={{ color: chartColor }}>40+</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Countries represented</div>
            </motion.div>

            {/* Image 2 */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.16 }} className="relative rounded-2xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=85&auto=format&fit=crop" alt="Deep work" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <p className="text-white text-sm font-semibold">Deep work culture</p>
              </div>
            </motion.div>

            {/* Stat — 100% remote */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col justify-center items-center text-center"
            >
              <div className="text-4xl font-extrabold" style={{ color: chartColor }}>100%</div>
              <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Remote & async</div>
            </motion.div>

            {/* Wide quote — spans 2 cols on lg */}
            <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.24 }}
              className="rounded-2xl p-6 flex flex-col justify-center lg:col-span-2"
              style={{ background: `rgba(${rgb},0.06)`, border: `1.5px solid rgba(${rgb},0.18)` }}
            >
              <p className="text-2xl leading-none mb-2" style={{ color: chartColor }}>&ldquo;</p>
              <p className="text-base sm:text-lg font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                Great financial tools should feel invisible — they just work.
              </p>
              <p className="text-xs text-neutral-400 mt-3">— Design principle at Finance AI</p>
            </motion.div>

          </div>
        </div>
      </section>
    </PageLayout>
  );
}
