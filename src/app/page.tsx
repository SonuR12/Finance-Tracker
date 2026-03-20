"use client";

import Hero from "@/components/home/Hero";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import StatsSection from "@/components/home/StatsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div id="home"><Hero /></div>
      <div className="bg-white dark:bg-neutral-950">
        <StatsSection />
        <div id="features"><FeaturesSection /></div>
        <HowItWorks />
        <div id="testimonials"><TestimonialsSection /></div>
        <div id="pricing"><PricingSection /></div>
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
