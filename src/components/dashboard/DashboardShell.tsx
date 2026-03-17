"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardClient from "./DashboardClient";
import { SettingsDialog } from "@/components/ui/SettingsDialog";
import { NOTIFICATIONS } from "./notifications";

interface Props {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  avatarColor?: string | null;
}

export default function DashboardShell({ name, email, image, avatarColor }: Props) {
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const stored = localStorage.getItem("dashboardTab");
    if (stored) setActiveTab(stored);
  }, []);

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    try { localStorage.setItem("dashboardTab", tab); } catch {}
  }
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readIds, setReadIds] = useState<number[]>([]);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !readIds.includes(n.id)).length;

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <SettingsDialog open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Sidebar
        name={name}
        email={email}
        image={image}
        avatarColor={avatarColor}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        unreadCount={unreadCount}
      />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardClient
          name={name}
          image={image}
          activeTab={activeTab}
          onMobileMenuOpen={() => setMobileOpen(true)}
          onSettingsOpen={() => setSettingsOpen(true)}
          readIds={readIds}
          setReadIds={setReadIds}
        />
      </div>
    </div>
  );
}
