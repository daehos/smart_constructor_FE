import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppNavbar } from "@/components/AppNavbar";
import { SidebarDrawer } from "@/components/SidebarDrawer";
import { ProfileMenu } from "@/components/ProfileMenu";

export function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="relative flex min-h-svh w-full flex-col bg-(--bg)">
      <AppNavbar
        onMenuClick={() => setDrawerOpen(true)}
        onProfileClick={() => setProfileOpen(true)}
      />
      <main className="relative z-0 flex-1 bg-[#EEF3FA]">
        <Outlet />
      </main>
      <SidebarDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
      <ProfileMenu open={profileOpen} onOpenChange={setProfileOpen} />
    </div>
  );
}
