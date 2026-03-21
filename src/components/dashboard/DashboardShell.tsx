"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardClient from "./DashboardClient";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { NOTIFICATIONS } from "./notifications";
import DashboardSkeleton from "@/components/ui/skeleton/DashboardSkeleton";

import type { DashboardData } from "./DashboardClient";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatarColor?: string | null;
  initialData: DashboardData;
}

export default function DashboardShell({ name, email, image, avatarColor, initialData }: Props) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const [displayName, setDisplayName] = useState(name);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !readIds.includes(n.id)).length;

  useEffect(() => {
    const stored = localStorage.getItem("dashboardTab");
    if (stored) setActiveTab(stored);
    setMounted(true);
  }, []);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    try { localStorage.setItem("dashboardTab", tab); } catch {}
  }

  if (!mounted) return <DashboardSkeleton />;

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} name={displayName} email={email} image={image} avatarColor={avatarColor} onNameSaved={setDisplayName} />
      <Sidebar
        name={displayName}
        email={email}
        image={image}
        avatarColor={avatarColor}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        unreadCount={unreadCount}
        onSettingsOpen={() => setSettingsOpen(true)}
      />
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <DashboardClient
          name={displayName}
          image={image}
          activeTab={activeTab}
          onMobileMenuOpen={() => setMobileOpen(true)}
          onSettingsOpen={() => setSettingsOpen(true)}
          readIds={readIds}
          setReadIds={setReadIds}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
