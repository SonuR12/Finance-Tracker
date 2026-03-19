"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { Settings, LogOut } from "lucide-react";

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

export function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface UserMenuProps {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  onSettings?: () => void;
  size?: number;
  avatarColor?: string | null;
}

export function UserMenu({ image, name, email, onSettings, size = 36, avatarColor }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const color = avatarColor ?? getAvatarColor(name ?? "U");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center">
      <button onClick={() => setOpen((v) => !v)} className="focus:outline-none flex-shrink-0 flex items-center justify-center">
        {image ? (
          <div style={{ width: size, height: size }} className="rounded-full !w-7 !h-7 sm:!h-full sm:!w-full overflow-hidden">
            <Image src={image} alt={name ?? "User"} width={size} height={size} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div style={{ width: size, height: size, fontSize: size * 0.35 }} className={`flex items-center justify-center rounded-full font-bold text-white ${color}`}>
            {getInitials(name ?? "U")}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-48 w-52 rounded-xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate">{name}</p>
            {email && <p className="text-xs text-neutral-500 truncate">{email}</p>}
          </div>
          {onSettings && (
            <button
              onClick={() => { setOpen(false); onSettings(); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
