
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookCopy,
  LayoutDashboard,
  LogOut,
  Users,
  UserCircle,
  KeyRound,
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
import React from 'react';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    setCurrentUser(user);

    const handleStorageChange = () => {
        setCurrentUser(localStorage.getItem("loggedInUser"));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.dispatchEvent(new Event("storage"));
    router.push('/login');
  };

  const isAdmin = currentUser === 'Intercom';

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
          {isAdmin && (
             <SidebarMenuItem>
               <Link href="/permissions" className="w-full">
                  <SidebarMenuButton
                  isActive={pathname === '/permissions'}
                  tooltip="Управление разрешениями"
                  >
                  <KeyRound />
                  <span>Управление</span>
                  </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Separator className="my-2" />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton>
                    <UserCircle />
                    <span>{currentUser || 'Гость'}</span>
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
