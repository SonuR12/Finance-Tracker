"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useT } from "@/lib/i18n-context";
import { useSession } from "next-auth/react";
import { useSettings } from "@/lib/settings-context";
import { UserMenu } from "@/components/ui/UserMenu";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import QuickAppearance from "@/components/ui/QuickAppearance";
import { AppButton } from "@/components/ui/AppButton";

function lighten(hex: string, amt: number) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return hex;
  return "#" + m.map((x) => Math.min(255, Math.round(parseInt(x, 16) + 255 * amt)).toString(16).padStart(2, "0")).join("");
}
function darken(hex: string, amt: number) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return hex;
  return "#" + m.map((x) => Math.max(0, Math.round(parseInt(x, 16) * (1 - amt))).toString(16).padStart(2, "0")).join("");
}

export default function Navbar({ showLinks = true }: { showLinks?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const t = useT();
  const { data: session, status } = useSession();
  const { chartColor } = useSettings();

  const NAV_LINKS = [
    { label: t("nav.home"),         href: "#home" },
    { label: t("nav.features"),     href: "#features" },
    { label: t("nav.testimonials"), href: "#testimonials" },
    { label: t("nav.pricing"),      href: "#pricing" },
  ];

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      for (const item of NAV_LINKS) {
        const section = document.querySelector(item.href);
        if (section && section.getBoundingClientRect().top <= 150 && section.getBoundingClientRect().bottom > 150) {
          setActiveSection(item.href);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = useCallback((href: string) => {
    setActiveSection(href);
    requestAnimationFrame(() => setTimeout(() => {
      const section = document.querySelector(href);
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100));
  }, []);

  return (
    <>
      {/* Floating pill nav — desktop only */}
      {showLinks && <div className="fixed top-4 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full shadow-sm px-2 py-1 backdrop-blur-md bg-white/75 dark:bg-black/60 border border-black/10 dark:border-white/10">
          {NAV_LINKS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="rounded-full px-4 py-1.5 text-sm transition-colors cursor-pointer"
                style={isActive
                  ? { color: "var(--app-accent)", background: "color-mix(in srgb, var(--app-accent) 9%, transparent)" }
                  : undefined
                }
              >
                <span className={isActive ? "" : "text-black/55 dark:text-white/60 hover:text-black dark:hover:text-white"}>
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className={`flex items-center gap-1 transition-all duration-300 ${scrolled ? "max-w-xs opacity-100 ml-1" : "max-w-0 opacity-0 overflow-hidden"}`}>
            <div className="h-4 w-px mx-1 bg-black/10 dark:bg-white/10" />
            {status === "loading" ? null : session?.user ? (
              <UserMenu
                image={session.user.image}
                name={session.user.name}
                email={session.user.email}
                avatarColor={(session.user as any).avatarColor}
                width={32}
                height={32}
                onSettings={() => setSettingsOpen(true)}
              />
            ) : (
              <>
                <QuickAppearance />
                <Link href="/sign-in" className="rounded-full px-4 py-1.5 text-sm transition-colors whitespace-nowrap text-black/50 dark:text-white/55 hover:bg-black/5 dark:hover:bg-white/8 hover:text-black dark:hover:text-white !border-0">
                  {t("nav.login")}
                </Link>
                <AppButton
                  variant="primary"
                  size="sm"
                  className="navbar-cta whitespace-nowrap rounded-full !border-0"
                  onClick={() => window.location.href = "/sign-in"}
                >
                  {t("nav.getStarted")}
                </AppButton>
              </>
            )}
          </div>
        </div>
      </div>}

      {/* Top bar */}
      <nav className="absolute top-0 z-40 w-full">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/svg/logo.svg" alt="Logo" width={40} height={40} />
            <div className="flex flex-col leading-none">
              <span className="font-bold text-base" style={{ color: "var(--app-accent)" }}>Finance</span>
              <span className="font-medium text-[10px] tracking-widest uppercase text-neutral-500 dark:text-neutral-400">Track</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {status === "loading" ? null : session?.user ? (
              <UserMenu
                image={session.user.image}
                name={session.user.name}
                email={session.user.email}
                avatarColor={(session.user as any).avatarColor}
                width={32}
                height={32}
                onSettings={() => setSettingsOpen(true)}
              />
            ) : (
              <>
                <QuickAppearance />
                <Link href="/sign-in" className="text-sm text-black/50 dark:text-white/55 transition-colors !border-0">
                  {t("nav.login")}
                </Link>
                <AppButton
                  variant="primary"
                  size="sm"
                  className="navbar-cta rounded-full !border-0"
                  onClick={() => window.location.href = "/sign-in"}
                >
                  {t("nav.getStarted")}
                </AppButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {session?.user && (
        <SettingsDialog
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          name={session.user.name}
          email={session.user.email}
          image={session.user.image}
          avatarColor={(session.user as any).avatarColor}
        />
      )}
    </>
  );
}
