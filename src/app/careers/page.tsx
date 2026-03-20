"use client";

import PageLayout from "@/components/home/PageLayout";
import { useSettings } from "@/lib/settings-context";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Zap, Heart, Globe, Users } from "lucide-react";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

const openings = [
  { id: 1, title: "Senior Full-Stack Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Build and scale the core Finance AI platform using Next.js, TypeScript, and MongoDB." },
  { id: 2, title: "AI/ML Engineer", dept: "Engineering", location: "Remote", type: "Full-time", desc: "Design and train models for transaction categorization, anomaly detection, and spending insights." },
  { id: 3, title: "Product Designer", dept: "Design", location: "Remote", type: "Full-time", desc: "Own the end-to-end design of new features from research and wireframes to polished UI." },
  { id: 4, title: "Growth Marketing Manager", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Drive user acquisition and retention through data-driven campaigns and content strategy." },
  { id: 5, title: "Customer Success Lead", dept: "Support", location: "Remote", type: "Full-time", desc: "Be the voice of our users — help them get the most out of Finance AI and shape our roadmap." },
  { id: 6, title: "Frontend Engineer (Intern)", dept: "Engineering", location: "Remote", type: "Internship", desc: "Work alongside senior engineers to build responsive, accessible UI components in React." },
];

const perks = [
  { Icon: Globe, title: "100% Remote", desc: "Work from anywhere in the world. We're async-first and results-driven." },
  { Icon: Zap, title: "Equity Package", desc: "Every team member gets meaningful equity. We grow together." },
  { Icon: Heart, title: "Health & Wellness", desc: "Full health coverage plus a $100/month wellness stipend." },
  { Icon: Users, title: "Learning Budget", desc: "$1,500/year for courses, books, conferences — whatever helps you grow." },
  { Icon: Briefcase, title: "Home Office Setup", desc: "$1,000 one-time budget to build your perfect workspace." },
  { Icon: Clock, title: "Flexible Hours", desc: "No 9-to-5. Work when you're most productive, hit your goals." },
];

const deptColors: Record<string, string> = { Engineering: "blue", Design: "purple", Marketing: "green", Support: "orange" };

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function CareersPage() {
  const { chartColor } = useSettings();
  const rgb = hexToRgb(chartColor);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(${rgb},0.12) 0%, transparent 60%)` }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p {...fadeUp} className="text-lg font-semibold uppercase tracking-widest mb-4" style={{ color: chartColor }}>Careers</motion.p>
          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-6">
            Build the future of <span style={{ color: chartColor }}>personal finance</span>
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
            We&apos;re a small, fully remote team on a mission to make financial clarity accessible to everyone. If that excites you, we&apos;d love to meet you.
          </motion.p>
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.3 }} className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
            {["🌍 Fully Remote", "⚡ Fast-moving team", "📈 Equity for all", `🎯 ${openings.length} open roles`].map((t) => (
              <span key={t} className="px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">{t}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Why Finance AI</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">Perks & benefits</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {perks.map(({ Icon, title, desc }, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3"
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

      {/* Open roles */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 space-y-3">
            <p className="text-lg font-semibold uppercase tracking-widest" style={{ color: chartColor }}>Open Roles</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white">Join our team</h2>
          </motion.div>
          <div className="space-y-3">
            {openings.map((job, i) => (
              <motion.div key={job.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer transition-colors duration-300"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = chartColor)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{job.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `rgba(${rgb},0.12)`, color: chartColor }}>{job.dept}</span>
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
                  className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: `rgba(${rgb},0.1)`, color: chartColor, border: `1.5px solid rgba(${rgb},0.2)` }}
                >
                  Coming Soon
                </span>
              </motion.div>
            ))}
          </div>

          {/* No role? */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 p-8 text-center space-y-3"
          >
            <div className="text-2xl">🚧</div>
            <p className="font-semibold text-neutral-900 dark:text-neutral-100">Hiring not open yet</p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">This is a personal project. Roles are listed for showcase purposes only — no positions are currently available.</p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
