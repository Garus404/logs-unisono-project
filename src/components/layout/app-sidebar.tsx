"use client";

import {
  BookCopy,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  UserCircle,
} from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "@/components/icons/logo";
import { useView } from "@/contexts/view-context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import type { LogType, ViewType } from "@/lib/types";

const logViews: { view: ViewType; label: string; type: LogType }[] = [
  { view: 'logs_connection', label: 'Подключения', type: 'CONNECTION' },
  { view: 'logs_chat', label: 'Чаты', type: 'CHAT' },
  { view: 'logs_damage', label: 'Урон', type: 'DAMAGE' },
  { view: 'logs_kill', label: 'Убийства', type: 'KILL' },
  { view: 'logs_spawn', label: 'Появления', type: 'SPAWN' },
];

export default function AppSidebar() {
  const { view, setView } = useView();

  const handleSetView = (newView: ViewType) => () => setView(newView);
  const isLogsActive = view.startsWith('logs_');

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tighter">
              Unisono Logs
            </h2>
            <p className="text-xs text-muted-foreground -mt-1">۞ Area-51 | SCP-RP</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSetView('summary')}
              isActive={view === 'summary'}
              tooltip="Сводка сервера"
            >
              <LayoutDashboard />
              <span>Сводка</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Collapsible>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton isActive={isLogsActive}>
                  <BookCopy />
                  <span>Логи</span>
                  <ChevronDown className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>

            <CollapsibleContent className="pl-4">
               <SidebarMenu className="py-1">
                 <SidebarMenuItem>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSetView('logs_all')} data-active={view === 'logs_all'}>
                      Все логи
                  </Button>
                 </SidebarMenuItem>
                {logViews.map(logView => (
                   <SidebarMenuItem key={logView.view}>
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSetView(logView.view)} data-active={view === logView.view}>
                      {logView.label}
                    </Button>
                  </SidebarMenuItem>
                ))}
               </SidebarMenu>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-2" />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <UserCircle />
                    <span>Админ</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton variant="outline" className="text-destructive-foreground/80 hover:bg-destructive/80 hover:text-destructive-foreground bg-destructive/90">
                    <LogOut />
                    <span>Выйти</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
