
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import SummaryView from '@/components/views/summary-view';

export default function DashboardPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
         <div className="flex flex-1 flex-col">
            <ContentHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <SummaryView />
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
