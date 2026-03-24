"use client";

import { motion } from "framer-motion";
import { useT } from "@/lib/i18n-context";
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Aarav Mehta",    role: "Startup Founder",    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80&auto=format&fit=crop&crop=face", quote: "This app gave me total control over our startup expenses. The real-time AI insights are a game-changer for financial planning.", rating: 5 },
  { name: "Priya Sharma",   role: "Digital Marketer",   image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80&auto=format&fit=crop&crop=face", quote: "Tracking ad budgets and campaign spend is so much easier now. It's like having a personal finance assistant available 24/7.", rating: 5 },
  { name: "Rohit Desai",    role: "Software Engineer",  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80&auto=format&fit=crop&crop=face", quote: "The clean interface and powerful analytics help me stay on top of my finances without any stress. Highly recommended!", rating: 5 },
  { name: "Sarah Chen",     role: "Product Manager",    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80&auto=format&fit=crop&crop=face", quote: "The multi-currency support is fantastic. I travel frequently and this app handles all my international transactions seamlessly.", rating: 5 },
  { name: "Marcus Johnson", role: "Freelance Designer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80&auto=format&fit=crop&crop=face", quote: "Budget planning has never been this intuitive. The AI recommendations actually helped me save 30% more each month.", rating: 5 },
  { name: "Aisha Patel",    role: "Financial Analyst",  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80&auto=format&fit=crop&crop=face", quote: "As a finance professional, I'm impressed by the depth of analytics. The spending breakdown charts are incredibly detailed.", rating: 5 },
];

export default function TestimonialsSection() {
  const t = useT();

  return (
    <section id="testimonials" className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-16 space-y-2 sm:space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: "var(--app-accent)" }}>{t("testimonials.label")}</p>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("testimonials.title")}
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto hidden sm:block">
            {t("testimonials.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className={`rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-colors duration-300 ${index >= 3 ? "hidden sm:flex sm:flex-col" : "flex flex-col"}`}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--app-accent)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = ""; }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
              }}
            >
              {/* Mobile: horizontal compact layout */}
              <div className="flex sm:hidden items-start gap-3 p-4">
                <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-full object-cover w-10 h-10 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</div>
                      <div className="text-xs" style={{ color: "var(--app-accent)" }}>{item.role}</div>
                    </div>
                    <div className="flex gap-0.5 flex-shrink-0">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>

              {/* Desktop: original card layout */}
              <div className="hidden sm:flex flex-col p-6 space-y-4 flex-1">
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex-1">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                  <div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</div>
                    <div className="text-xs" style={{ color: "var(--app-accent)" }}>{item.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
