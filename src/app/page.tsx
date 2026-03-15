"use client";

import { featuresData, statsData, testimonialsData } from "@/data/home";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import Link from "next/link";
import { useT } from "@/lib/i18n-context";

export default function Home() {
  const t = useT();

  const statsLabels = [t("stats.users"), t("stats.transactions"), t("stats.uptime"), t("stats.rating")];
  const featuresTranslated = [
    { ...featuresData[0], title: t("features.analytics.title"), description: t("features.analytics.desc") },
    { ...featuresData[1], title: t("features.scanner.title"), description: t("features.scanner.desc") },
    { ...featuresData[2], title: t("features.budget.title"), description: t("features.budget.desc") },
    { ...featuresData[3], title: t("features.multiAccount.title"), description: t("features.multiAccount.desc") },
    { ...featuresData[4], title: t("features.multiCurrency.title"), description: t("features.multiCurrency.desc") },
    { ...featuresData[5], title: t("features.insights.title"), description: t("features.insights.desc") },
  ];
  return (
    <div className="flex flex-col gap-10 bg-white dark:bg-neutral-950 transition-colors duration-300">
      <Navbar />
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-indigo-50 dark:bg-indigo-950/30 mt-5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {statsData.map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {item.value}
                </div>
                <div className="text-gray-500 dark:text-neutral-400 text-sm">{statsLabels[index]}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-32 text-center -mt-22">
        <motion.div
          className="text-2xl font-bold pb-12 text-neutral-900 dark:text-neutral-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {t("features.title")}
        </motion.div>
        <div className="mx-auto px-5 sm:px-10 xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuresTranslated.map((item, index) => (
              <motion.div
                key={index}
                className="text-left rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-7 space-y-3 shadow-md hover:shadow-lg dark:hover:shadow-indigo-950/30 transition-shadow"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.10 }}
                viewport={{ once: true }}
              >
                <div className="text-indigo-500 dark:text-indigo-400">
                  {item.icon}
                </div>
                <div className="text-neutral-900 dark:text-neutral-100 text-[18px] font-bold">
                  {item.title}
                </div>
                <div className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {item.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 text-center">
        <motion.h1
          className="text-2xl font-bold pb-12 text-neutral-900 dark:text-neutral-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {t("testimonials.title")}
        </motion.h1>
        <div className="mx-auto px-5 sm:px-10 xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {testimonialsData.map((item, index) => (
              <motion.div
                key={index}
                className="text-left rounded-xl border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-7 space-y-3 shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="sm:flex gap-2 items-center">
                  <Image
                    src={item.image}
                    alt="User Image"
                    width={50}
                    height={50}
                    className="rounded-full object-cover w-12 h-12"
                  />
                  <div>
                    <div className="text-neutral-900 dark:text-neutral-100 text-[15px] font-bold">
                      {item.name}
                    </div>
                    <div className="text-neutral-500 dark:text-neutral-400 text-[13px]">
                      {item.role}
                    </div>
                  </div>
                </div>
                <div className="text-neutral-500 dark:text-neutral-400 text-sm">{item.quote}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <motion.section
        className="px-4 py-16 bg-indigo-50 dark:bg-indigo-950/30 mt-5 text-center flex flex-col items-center justify-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="font-bold text-2xl inline-block gradient-title">
          {t("cta.title")}
        </h1>
        <span className="text-neutral-600 dark:text-neutral-400">
          {t("cta.subtitle")}
        </span>
        <div className="relative inline-block mt-2">
          <span className="absolute -inset-[2px] rounded-md bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 animate-border-move bg-[length:200%_200%] blur-sm" />
          <Link href="/sign-in">
            <Button className="relative z-10 border border-transparent bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors duration-300 rounded-md px-7 py-3 font-bold hover:cursor-pointer">
              {t("cta.button")}
            </Button>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
