"use client";

import React from "react";
import PageLayout from "@/components/home/PageLayout";
import { useSettings } from "@/lib/settings-context";
import { useT } from "@/lib/i18n-context";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { AppButton } from "@/components/ui/AppButton";

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m || m.length < 3) return "99,102,241";
  return m.slice(0, 3).map((x) => parseInt(x, 16)).join(",");
}

const posts = [
  {
    slug: "ai-budgeting-tips",
    category: "AI & Finance",
    title: "How AI is Revolutionizing Personal Budgeting in 2025",
    excerpt: "Discover how machine learning models analyze your spending patterns to give you hyper-personalized budget recommendations that actually work.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=85&auto=format&fit=crop",
    author: { name: "Sonu Rai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&crop=face" },
    date: "Mar 15, 2025",
    readTime: "5 min read",
    featured: true,
  },
  {
    slug: "multi-currency-guide",
    category: "Tips & Tricks",
    title: "Managing Multi-Currency Finances as a Digital Nomad",
    excerpt: "A practical guide to tracking expenses across multiple currencies without losing your mind — or your money.",
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=85&auto=format&fit=crop",
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop&crop=face" },
    date: "Mar 8, 2025",
    readTime: "7 min read",
    featured: false,
  },
  {
    slug: "savings-habits",
    category: "Personal Finance",
    title: "5 Savings Habits That Will Change Your Financial Life",
    excerpt: "Small, consistent habits compound into massive results. Here are the five habits our most financially successful users share.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=85&auto=format&fit=crop",
    author: { name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&crop=face" },
    date: "Dec 28, 2024",
    readTime: "4 min read",
    featured: false,
  },
  {
    slug: "spending-analytics",
    category: "Product",
    title: "Introducing Advanced Spending Analytics: Know Where Every Dollar Goes",
    excerpt: "Our new analytics dashboard gives you a 360° view of your spending with interactive charts, category breakdowns, and trend analysis.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=85&auto=format&fit=crop",
    author: { name: "Rohit Desai", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop&crop=face" },
    date: "Dec 15, 2024",
    readTime: "6 min read",
    featured: false,
  },
  {
    slug: "debt-payoff-strategy",
    category: "Personal Finance",
    title: "The Avalanche vs Snowball Method: Which Debt Strategy Wins?",
    excerpt: "We ran the numbers on both popular debt payoff strategies. The results might surprise you — and save you thousands.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=85&auto=format&fit=crop",
    author: { name: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop&crop=face" },
    date: "Dec 5, 2024",
    readTime: "8 min read",
    featured: false,
  },
  {
    slug: "receipt-scanner",
    category: "Product",
    title: "Smart Receipt Scanner: Never Manually Enter a Transaction Again",
    excerpt: "Our AI-powered receipt scanner extracts merchant, amount, date, and category automatically. Here's how it works under the hood.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85&auto=format&fit=crop",
    author: { name: "Sonu Rai", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&crop=face" },
    date: "Nov 22, 2024",
    readTime: "5 min read",
    featured: false,
  },
];

const categories = ["All", "AI & Finance", "Personal Finance", "Tips & Tricks", "Product"];

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function BlogPage() {
  const { chartColor } = useSettings();
  const t = useT();
  const rgb = hexToRgb(chartColor);
  const [activeCategory, setActiveCategory] = React.useState("All");

  const categories = [t("blog.all"), t("blog.aiFinance"), t("blog.personalFinance"), t("blog.tipsTricks"), t("blog.product")];
  const categoryMap: Record<string, string> = {
    [t("blog.all")]: "All",
    [t("blog.aiFinance")]: "AI & Finance",
    [t("blog.personalFinance")]: "Personal Finance",
    [t("blog.tipsTricks")]: "Tips & Tricks",
    [t("blog.product")]: "Product",
  };

  const featured = posts.find((p) => p.featured)!;
  const activeCategoryEn = categoryMap[activeCategory] ?? "All";
  const showFeatured = activeCategoryEn === "All" || featured.category === activeCategoryEn;
  const rest = posts.filter((p) => !p.featured && (activeCategoryEn === "All" || p.category === activeCategoryEn));

  return (
    <PageLayout>
      {/* Header */}
      <section className="relative overflow-hidden pt-24 sm:pt-32 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse 80% 50% at 50% -10%, rgba(${rgb},0.12) 0%, transparent 60%)` }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p {...fadeUp} className="text-lg font-semibold uppercase tracking-widest mb-4" style={{ color: chartColor }}>{t("blog.label")}</motion.p>
          <motion.h1 {...fadeUp} transition={{ duration: 0.55, delay: 0.1 }} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-4">
            {t("blog.title")}
          </motion.h1>
          <motion.p {...fadeUp} transition={{ duration: 0.55, delay: 0.2 }} className="text-lg text-neutral-500 dark:text-neutral-400">
            {t("blog.subtitle")}
          </motion.p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category pills */}
        <motion.div {...fadeUp} className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <AppButton
              key={cat}
              variant={activeCategory === cat ? "primary" : "subtle"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </AppButton>
          ))}
        </motion.div>

        {/* Featured post */}
        {showFeatured && (
        <motion.div {...fadeUp} className="group relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 mb-8 cursor-pointer"
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = chartColor)}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
        >
          <div className="grid md:grid-cols-2">
            <div className="relative h-64 md:h-auto min-h-[280px] overflow-hidden">
              <Image src={featured.image} alt={featured.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:to-black/40" />
            </div>
            <div className="p-7 sm:p-10 flex flex-col justify-center bg-white dark:bg-neutral-900 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: chartColor }}>{featured.category} · {t("blog.featured")}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white leading-snug">{featured.title}</h2>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-3 pt-2">
                <Image src={featured.author.avatar} alt={featured.author.name} width={36} height={36} className="rounded-full object-cover w-9 h-9" />
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{featured.author.name}</p>
                  <p className="text-xs text-neutral-400 flex items-center gap-1"><Clock className="h-3 w-3" />{featured.date} · {featured.readTime}</p>
                </div>
              </div>
              <Link href={`/blog/${featured.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold group/link mt-1" style={{ color: chartColor }}>
                {t("blog.readArticle")} <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>
          </div>
        </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {rest.map((post, i) => (
            <motion.article key={post.slug} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden cursor-pointer transition-colors duration-300"
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = chartColor)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
            >
              <div className="relative h-44 overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-5 space-y-3">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: chartColor }}>{post.category}</span>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2">{post.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2.5 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <Image src={post.author.avatar} alt={post.author.name} width={28} height={28} className="rounded-full object-cover w-7 h-7" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">{post.author.name}</p>
                    <p className="text-xs text-neutral-400 flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{post.readTime}</p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
