"use client";

import Link from "next/link";
import Image from "next/image";
import { useT } from "@/lib/i18n-context";
import { useSettings } from "@/lib/settings-context";

const links = {
  Product: [
    { label: "Features",  href: "/#features" },
    { label: "Pricing",   href: "/#pricing" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About",   href: "/about" },
    { label: "Blog",    href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy",   href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
  ],
};

export default function Footer() {
  const t = useT();
  const { chartColor } = useSettings();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 sm:mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/svg/logo.svg" alt="Logo" width={40} height={40} />
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base" style={{ color: chartColor }}>Finance</span>
                <span className="font-medium text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">Track</span>
              </div>
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-xs">
              AI-powered personal finance tracker. Take control of your money.
            </p>
            <div className="flex gap-3">
              <Link href="mailto:sonurai272004@gmail.com" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Image height={20} width={20} alt="mail" src="/svg/gmail.svg" />
              </Link>
              <Link href="https://github.com/SonuR12" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Image height={20} width={20} alt="github" src="/svg/github_logo_dark.svg" className="invert dark:invert-0" />
              </Link>
              <Link href="https://www.linkedin.com/in/sonu-rai-55473a289/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Image height={20} width={20} alt="linkedin" src="/svg/linkdin.svg" />
              </Link>
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-neutral-500 dark:text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
                      onMouseEnter={(e) => (e.currentTarget.style.color = chartColor)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "")}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>© {new Date().getFullYear()} Finance AI · Built by Sonu Rai</span>
          <span>{t("footer.tagline")}</span>
        </div>
      </div>
    </footer>
  );
}
