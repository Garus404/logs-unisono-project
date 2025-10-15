
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import PlayersView from '@/components/views/players-view';

export default function PlayersPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
         <div className="flex flex-1 flex-col">
            <ContentHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <PlayersView />
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
