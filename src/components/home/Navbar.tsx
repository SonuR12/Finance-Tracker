"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings } from "lucide-react";
import { SettingsDialog } from "@/components/home/SettingsDialog";
import { useT } from "@/lib/i18n-context";

const COLORS = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500",
  "bg-teal-500", "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
];

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

function getColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}



function UserMenu({ image, name, email, color, onSettings }: { image?: string | null; name?: string | null; email?: string | null; color: string; onSettings: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useT();
  const dim = 36;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((v) => !v)} className="focus:outline-none flex-shrink-0">
        {image ? (
          <div style={{ width: dim, height: dim }} className="rounded-full overflow-hidden">
            <Image src={image} alt={name ?? "User"} width={dim} height={dim} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div style={{ width: dim, height: dim }} className={`flex items-center justify-center rounded-full text-sm font-bold text-white ${color}`}>
            {getInitials(name ?? "U")}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{name}</p>
            {email && <p className="text-xs text-neutral-500 truncate">{email}</p>}
          </div>
          <div className="py-0">
            <button
              onClick={() => { setOpen(false); onSettings(); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition"
            >
              <Settings className="h-4 w-4" />
              {t("nav.settings")}
            </button>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            >
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

  const color = useMemo(() => (user?.name ? getColor(user.name) : "bg-indigo-500"), [user?.name]);

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
              <UserMenu image={user.image} name={user.name} email={user.email} color={color} onSettings={() => setSettingsOpen(true)} />
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
              <UserMenu image={user.image} name={user.name} email={user.email} color={color} onSettings={() => setSettingsOpen(true)} />
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
