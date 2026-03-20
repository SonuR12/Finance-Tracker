"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/home/PageLayout";
import { useSettings } from "@/lib/settings-context";
import { motion } from "framer-motion";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      { subtitle: "Agreement", text: "By accessing or using Finance AI (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service." },
      { subtitle: "Eligibility", text: "You must be at least 13 years old to use Finance AI. By using the Service, you represent that you meet this requirement." },
      { subtitle: "Updates", text: "We reserve the right to modify these terms at any time. We will notify you of material changes via email or in-app notification. Continued use after changes constitutes acceptance." },
    ],
  },
  {
    title: "Your Account",
    content: [
      { subtitle: "Account Creation", text: "You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your credentials." },
      { subtitle: "Account Security", text: "You are responsible for all activity that occurs under your account. Notify us immediately at sonurai272004@gmail.com if you suspect unauthorized access." },
      { subtitle: "One Account Per Person", text: "Each person may maintain only one free account. Creating multiple accounts to circumvent plan limits is prohibited." },
    ],
  },
  {
    title: "Acceptable Use",
    content: [
      { subtitle: "Permitted Use", text: "Finance AI is provided for personal, non-commercial financial tracking and management purposes." },
      { subtitle: "Prohibited Activities", text: "You may not: (a) use the Service for illegal purposes; (b) attempt to gain unauthorized access to our systems; (c) scrape, crawl, or extract data in bulk; (d) reverse engineer any part of the Service; (e) use the Service to harm, harass, or defraud others." },
      { subtitle: "Content Standards", text: "Any content you submit (transaction notes, category names, etc.) must not contain illegal, harmful, or offensive material." },
    ],
  },
  {
    title: "Subscription & Billing",
    content: [
      { subtitle: "Free Plan", text: "The Free plan is available at no cost with the limitations described on our Pricing page. We reserve the right to modify free plan limits with 30 days notice." },
      { subtitle: "Paid Plans", text: "Paid subscriptions are billed monthly or annually as selected. All fees are in USD unless otherwise stated." },
      { subtitle: "Cancellation", text: "You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. We do not provide refunds for partial periods." },
      { subtitle: "Price Changes", text: "We will provide at least 30 days notice before changing subscription prices. Price changes take effect at your next renewal date." },
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      { subtitle: "Our IP", text: "Finance AI, including its design, code, trademarks, and content, is owned by Finance AI and protected by intellectual property laws." },
      { subtitle: "Your Data", text: "You retain full ownership of all financial data you enter into Finance AI. We claim no ownership over your personal financial information." },
      { subtitle: "License to Us", text: "By using the Service, you grant us a limited license to process your data solely for the purpose of providing and improving the Service." },
    ],
  },
  {
    title: "Disclaimers",
    content: [
      { subtitle: "Not Financial Advice", text: "Finance AI provides tools for tracking and visualizing your finances. Nothing in the Service constitutes financial, investment, tax, or legal advice. Always consult a qualified professional for financial decisions." },
      { subtitle: "Service Availability", text: "We strive for 99.9% uptime but do not guarantee uninterrupted access. We are not liable for losses resulting from service downtime or data unavailability." },
      { subtitle: "Accuracy", text: "While we work hard to ensure accuracy, we are not responsible for errors in AI-generated insights or categorizations. Always verify important financial information independently." },
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      { subtitle: "Cap on Liability", text: "To the maximum extent permitted by law, Finance AI's total liability to you for any claims arising from use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim." },
      { subtitle: "Exclusions", text: "We are not liable for indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill." },
    ],
  },
  {
    title: "Termination",
    content: [
      { subtitle: "By You", text: "You may delete your account at any time from Settings → Profile → Danger Zone. This permanently removes all your data." },
      { subtitle: "By Us", text: "We may suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or if we discontinue the Service. We will provide reasonable notice where possible." },
    ],
  },
  {
    title: "Governing Law",
    content: [
      { subtitle: "Jurisdiction", text: "These Terms are governed by the laws of India. Any disputes shall be resolved in the courts of Mumbai, Maharashtra, India." },
      { subtitle: "Dispute Resolution", text: "Before filing a formal dispute, we encourage you to contact us directly. We aim to resolve all issues amicably within 30 days." },
    ],
  },
];

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function TermsOfServicePage() {
  const { chartColor } = useSettings();
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
          <motion.p {...fadeUp} className="text-lg font-semibold uppercase tracking-widest mb-4" style={{ color: chartColor }}>Legal</motion.p>
          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
            Terms of Service
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="text-neutral-500 dark:text-neutral-400">
            Last updated: <span className="font-medium text-neutral-700 dark:text-neutral-300">March 15, 2026</span>
          </motion.p>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.25 }} className="mt-4 text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Please read these Terms of Service carefully before using Finance AI. These terms govern your use of our platform and services.
          </motion.p>
        </div>
      </section>

      {/* TOC + Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-[240px_1fr] gap-10 items-start">

          {/* Sticky TOC */}
          <aside className="hidden md:block sticky top-60 self-start max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: chartColor }}>Contents</p>
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
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.section key={i} id={`tos-${i}`} ref={(el) => { sectionRefs.current[i] = el; }} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.03 }}
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
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">Questions about these terms?</p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Contact us and we&apos;ll get back to you within 2 business days.</p>
              <a href="mailto:sonurai272004@gmail.com" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: chartColor }}>
                E mail
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
