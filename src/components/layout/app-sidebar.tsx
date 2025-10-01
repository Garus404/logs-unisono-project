
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookCopy,
  LayoutDashboard,
  LogOut,
  Users,
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
import { Logo } from "@/components/icons/logo";
import { Separator } from "../ui/separator";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you'd also clear the user's session/token here.
    router.push('/login');
  };

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
             <Link href="/dashboard" className="w-full">
                <SidebarMenuButton
                isActive={pathname === '/dashboard' || pathname === '/'}
                tooltip="Сводка сервера"
                >
                <LayoutDashboard />
                <span>Сводка</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Link href="/players" className="w-full">
                <SidebarMenuButton
                isActive={pathname === '/players'}
                tooltip="Игроки на сервере"
                >
                <Users />
                <span>Игроки</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <Link href="/logs" className="w-full">
                <SidebarMenuButton
                isActive={pathname === '/logs'}
                tooltip="Все логи сервера"
                >
                <BookCopy />
                <span>Все логи</span>
                </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
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
                <SidebarMenuButton 
                    variant="outline" 
                    className="text-destructive-foreground/80 hover:bg-destructive/80 hover:text-destructive-foreground bg-destructive/90"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span>Выйти</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
