"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/home/PageLayout";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { motion } from "framer-motion";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

const sections = [
  {
    title: "Information We Collect",
    content: [
      { subtitle: "Account Information", text: "When you create an account, we collect your name, email address, and a hashed password. We never store your password in plain text." },
      { subtitle: "Financial Data", text: "Transaction records, account balances, budget settings, and categories you create are stored securely in our database and are only accessible by you." },
      { subtitle: "Usage Data", text: "We collect anonymized usage analytics (pages visited, features used, session duration) to improve the product. This data cannot be linked back to you personally." },
      { subtitle: "Device & Technical Data", text: "IP address, browser type, operating system, and device identifiers are logged for security and fraud prevention purposes." },
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      { subtitle: "Providing the Service", text: "Your data is used to operate Finance AI — displaying your transactions, generating insights, sending notifications, and personalizing your experience." },
      { subtitle: "AI & Analytics", text: "Anonymized, aggregated transaction data may be used to train and improve our AI models. Individual transaction data is never shared with third parties." },
      { subtitle: "Communications", text: "We use your email to send account-related notifications (OTP codes, security alerts) and, with your consent, product updates and newsletters." },
      { subtitle: "Security", text: "Technical data helps us detect suspicious activity, prevent unauthorized access, and protect your account." },
    ],
  },
  {
    title: "Data Sharing & Third Parties",
    content: [
      { subtitle: "We Do Not Sell Your Data", text: "Finance AI does not sell, rent, or trade your personal information to any third party, ever." },
      { subtitle: "Service Providers", text: "We work with trusted providers (MongoDB Atlas for database hosting, Vercel for infrastructure) who process data on our behalf under strict data processing agreements." },
      { subtitle: "Legal Requirements", text: "We may disclose information if required by law, court order, or to protect the rights and safety of our users or the public." },
    ],
  },
  {
    title: "Data Security",
    content: [
      { subtitle: "Encryption", text: "All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption." },
      { subtitle: "Access Controls", text: "Access to production systems is restricted to authorized personnel only, with multi-factor authentication required." },
      { subtitle: "Incident Response", text: "In the event of a data breach, we will notify affected users within 72 hours as required by applicable law." },
    ],
  },
  {
    title: "Your Rights",
    content: [
      { subtitle: "Access & Portability", text: "You can export all your data at any time from Settings → Security → Export My Data." },
      { subtitle: "Correction", text: "You can update your profile information at any time from your account settings." },
      { subtitle: "Deletion", text: "You can delete your account and all associated data from Settings → Profile → Danger Zone. Deletion is permanent and irreversible." },
      { subtitle: "Opt-out", text: "You can opt out of marketing emails at any time by clicking 'Unsubscribe' in any email or updating your notification preferences in Settings." },
    ],
  },
  {
    title: "Cookies",
    content: [
      { subtitle: "Essential Cookies", text: "We use session cookies to keep you logged in. These are strictly necessary and cannot be disabled." },
      { subtitle: "Analytics Cookies", text: "With your consent, we use anonymized analytics cookies to understand how users interact with the app. You can opt out in your browser settings." },
    ],
  },
  {
    title: "Children's Privacy",
    content: [
      { subtitle: "Age Restriction", text: "Finance AI is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately." },
    ],
  },
  {
    title: "Changes to This Policy",
    content: [
      { subtitle: "Updates", text: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification at least 30 days before they take effect." },
    ],
  },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function PrivacyPolicyPage() {
  const { chartColor } = useSettings();
  const t = useT();
  const rgb = hexToRgb(chartColor);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(${rgb},0.1) 0%, transparent 60%)` }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.p {...fadeUp} className="text-lg font-semibold uppercase tracking-widest mb-4" style={{ color: chartColor }}>{t("privacy.label")}</motion.p>
          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
            {t("privacy.title")}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="text-neutral-500 dark:text-neutral-400">
            {t("privacy.lastUpdated")} <span className="font-medium text-neutral-700 dark:text-neutral-300">March 15, 2026</span>
          </motion.p>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.25 }} className="mt-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {t("privacy.intro")}
          </motion.p>
        </div>
      </section>

      {/* Table of contents + content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-[240px_1fr] gap-10 items-start">

          {/* Sticky TOC */}
          <aside className="hidden md:block sticky top-60 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: chartColor }}>{t("privacy.contents")}</p>
            <nav className="space-y-1">
              {sections.map((s, i) => (
                <button key={i}
                  onClick={() => {
                    const el = sectionRefs.current[i];
                    if (!el) return;
                    const y = el.getBoundingClientRect().top + window.scrollY - 96;
                    window.scrollTo({ top: y, behavior: "smooth" });
                  }}
                  className="w-full text-left block text-sm py-1 px-2 rounded-lg transition-all duration-200"
                  style={activeSection === i
                    ? { color: chartColor, background: `rgba(${rgb},0.08)`, fontWeight: 600 }
                    : { color: "", fontWeight: 400 }
                  }
                  onMouseEnter={(e) => { if (activeSection !== i) e.currentTarget.style.color = chartColor; }}
                  onMouseLeave={(e) => { if (activeSection !== i) e.currentTarget.style.color = ""; }}
                >
                  {i + 1}. {s.title}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <motion.section key={i} id={`section-${i}`} ref={(el) => { sectionRefs.current[i] = el; }} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.04 }}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-5 transition-colors duration-300"
                style={{ borderColor: activeSection === i ? `rgba(${rgb},0.5)` : "" }}
              >
                <div className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: chartColor }}>{i + 1}</span>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{section.title}</h2>
                </div>
                <div className="space-y-4 pl-10">
                  {section.content.map((item, j) => (
                    <div key={j} className="space-y-1 pl-3 border-l-2" style={{ borderColor: `rgba(${rgb},0.4)` }}>
                      <h3 className="text-sm font-semibold" style={{ color: chartColor }}>{item.subtitle}</h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            ))}

            {/* Contact */}
            <motion.div {...fadeUp} className="rounded-2xl p-6 sm:p-8 text-center space-y-3"
              style={{ background: `rgba(${rgb},0.06)`, border: `1.5px solid rgba(${rgb},0.2)` }}
            >
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">{t("privacy.questionsTitle")}</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t("privacy.questionsDesc")}</p>
              <a href="mailto:sonurai272004@gmail.com" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: chartColor }}>
                {t("privacy.email")}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
