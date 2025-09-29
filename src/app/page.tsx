"use client";

import AppSidebar from '@/components/layout/app-sidebar';
import MainContent from '@/components/layout/main-content';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ViewProvider } from '@/contexts/view-context';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import PlayerPage from './player/[steamId]/page';

export default function Home() {
  const pathname = usePathname();
  const [isPlayerPage, setIsPlayerPage] = useState(false);

  useEffect(() => {
    if (pathname) {
      setIsPlayerPage(pathname.includes('/player/'));
    }
  }, [pathname]);

  if (isPlayerPage) {
    // This logic seems complex. The routing should handle this.
    // Let's simplify and rely on Next.js's router.
    // For now, we will keep the logic but it might need refactoring.
    const steamId = pathname.split('/player/')[1];
    return <PlayerPage params={{ steamId }} />;
  }

  return (
    <ViewProvider>
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <MainContent />
        </SidebarInset>
      </SidebarProvider>
    </ViewProvider>
  );
}
