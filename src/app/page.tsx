"use client";

import { featuresData, statsData, testimonialsData } from "@/data/home";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";

export default function Home() {

  return (
    <div className="flex flex-col gap-10">
      <Hero />

      {/* Stats Section */}
      <section className="py-16 bg-indigo-50 mt-5">
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
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {item.value}
                </div>
                <div className="text-gray-500 text-sm">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="pt-32 text-center -mt-22">
        <motion.div
          className="text-2xl font-bold pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Everything you need to manage your finances
        </motion.div>
        <div className="mx-auto px-5 sm:px-10 xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {featuresData.map((item, index) => (
              <motion.div
                key={index}
                className="text-left rounded-md border border-gray-100 p-7 space-y-3 shadow-md"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.10 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl font-bold text-indigo-500">
                  {item.icon}
                </div>
                <div className="text-black text-[18px] font-bold">
                  {item.title}
                </div>
                <div className="text-gray-600 text-sm">
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
          className="text-2xl font-bold pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          What Our Users Say
        </motion.h1>
        <div className="mx-auto px-5 sm:px-10 xl:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {testimonialsData.map((item, index) => (
              <motion.div
                key={index}
                className="text-left rounded-md border border-gray-100 p-7 space-y-3 shadow-md"
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
                    <div className="text-black text-[15px] font-bold">
                      {item.name}
                    </div>
                    <div className="text-black text-[13px] font-bold">
                      {item.role}
                    </div>
                  </div>
                </div>
                <div className="text-gray-600 text-sm">{item.quote}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <motion.section
        className="px-4 py-16 bg-indigo-50 mt-5 text-center flex flex-col items-center justify-center gap-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h1 className="font-bold text-2xl inline-block gradient-title">
          Ready to Take Control of Your Finances ?
        </h1>
        <span className="text-neutral-700">
          Join thousands of users who are already managing their finances
          smarter with Finance Tracker
        </span>
        <div className="relative inline-block mt-2">
          <span className="absolute -inset-[2px] rounded-md bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 animate-border-move bg-[length:200%_200%] blur-sm"></span>
          <Button className="relative z-10 border border-transparent bg-white text-black hover:bg-gray-100 transition-colors duration-300 rounded-md px-7 py-3 font-bold hover:cursor-pointer">
            Start Free Trial
          </Button>
        </div>
      </motion.section>
    </div>
  );
}
