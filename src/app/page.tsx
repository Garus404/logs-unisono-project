"use client";

import AppSidebar from '@/components/layout/app-sidebar';
import MainContent from '@/components/layout/main-content';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ViewProvider } from '@/contexts/view-context';

export default function Home() {
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
