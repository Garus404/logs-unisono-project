
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PermissionsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
         <div className="flex flex-1 flex-col">
            <ContentHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Управление разрешениями</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Здесь будет интерфейс для управления ролями и разрешениями пользователей.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
