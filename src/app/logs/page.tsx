
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import LogView from '@/components/views/log-view';

export default function LogsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
         <div className="flex flex-1 flex-col">
            <ContentHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <LogView />
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
