"use client";

import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ViewProvider, useView } from '@/contexts/view-context';
import ContentHeader from '@/components/layout/content-header';
import SummaryView from '@/components/views/summary-view';
import PlayersView from '@/components/views/players-view';
import LogView from '@/components/views/log-view';
import type { LogType } from '@/lib/types';

function AppContent() {
  const { view } = useView();

  const renderView = () => {
    if (view.startsWith('logs_')) {
        const logType = view.replace('logs_', '') as LogType | 'all';
        return <LogView filterType={logType === 'all' ? undefined : logType} />;
    }

    switch (view) {
      case "summary":
        return <SummaryView />;
      case "players":
        return <PlayersView />;
      default:
        // Fallback to summary view if view is something unexpected
        return <SummaryView />;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <ContentHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}


export default function Home() {
  return (
    <ViewProvider>
      <SidebarProvider defaultOpen={true}>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <AppContent />
        </SidebarInset>
      </SidebarProvider>
    </ViewProvider>
  );
}
