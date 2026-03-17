"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { UserMenu, getAvatarColor } from "@/components/ui/UserMenu";
import { useT } from "@/lib/i18n-context";



export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const [scrolled, setScrolled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const t = useT();

  const NAV_LINKS = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.pricing"), href: "/#pricing" },
    { label: t("nav.testimonials"), href: "/#testimonials" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Floating pill nav */}
      <div className="sticky top-4 z-50 hidden md:flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-neutral-200 bg-white/80 backdrop-blur-md shadow-sm px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900/80">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-1.5 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:shadow-sm dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {item.label}
            </Link>
          ))}

          <div
            className={`flex items-center gap-1 transition-all duration-300 ${
              scrolled ? "max-w-xs opacity-100 ml-1" : "max-w-0 opacity-0 overflow-hidden"
            }`}
          >
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 mx-1" />
            {user ? (
              <UserMenu image={user.image} name={user.name} email={user.email} onSettings={() => setSettingsOpen(true)} avatarColor={(user as any).avatarColor} />
            ) : (
              <>
                <Link href="/sign-in" className="rounded-full px-4 py-1.5 text-sm text-neutral-600 transition hover:bg-neutral-100 hover:shadow-sm dark:text-neutral-300 dark:hover:bg-neutral-800 whitespace-nowrap">
                  {t("nav.login")}
                </Link>
                <Button asChild size="sm" className="button-gradient text-white rounded-full px-4 h-8 text-sm whitespace-nowrap">
                  <Link href="/sign-in">{t("nav.getStarted")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top bar */}
      <nav className="absolute top-0 z-40 w-full">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} />
            Finance
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <UserMenu image={user.image} name={user.name} email={user.email} onSettings={() => setSettingsOpen(true)} avatarColor={(user as any).avatarColor} />
            ) : (
              <>
                <Link href="/sign-in" className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300">
                  {t("nav.login")}
                </Link>
                <Button asChild size="sm" className="button-gradient text-white rounded-full px-5">
                  <Link href="/sign-in">{t("nav.getStarted")}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
