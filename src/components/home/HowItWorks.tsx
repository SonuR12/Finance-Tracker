"use client";

import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { CreditCard, BarChart3, PieChart } from "lucide-react";
import Image from "next/image";

const steps = [
  {
    Icon: CreditCard,
    title: "Create Your Account",
    description: "Get started in minutes with our simple and secure sign-up process.",
    image: "https://images.unsplash.com/photo-1633265486064-086b219458ec?w=600&q=80&auto=format&fit=crop",
  },
  {
    Icon: BarChart3,
    title: "Track Your Spending",
    description: "Automatically categorize and track your transactions in real-time.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop",
  },
  {
    Icon: PieChart,
    title: "Get AI Insights",
    description: "Receive AI-powered insights and recommendations to optimize your finances.",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format&fit=crop",
  },
];

export default function HowItWorks() {
  const { chartColor } = useSettings();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-10 sm:mb-16 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-lg font-medium uppercase tracking-widest" style={{ color: chartColor }}>How It Works</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            Up and running in 3 steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative flex flex-col gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] w-full h-px bg-gradient-to-r from-neutral-300 to-transparent dark:from-neutral-700" />
              )}

              <div className="relative h-48 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800">
                <Image src={step.image} alt={step.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div
                  className="absolute bottom-3 left-3 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-900 shadow-md"
                  style={{ color: chartColor }}
                >
                  <step.Icon className="h-5 w-5" />
                </div>
                <div
                  className="absolute top-3 right-3 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: chartColor }}
                >
                  {index + 1}
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{step.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
