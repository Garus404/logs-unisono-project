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
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { Separator } from "../ui/separator";
import React from 'react';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<string | null>(null);
  const { state } = useSidebar();
  
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

  const handleLogout = async () => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login: user }),
        });
    }
    localStorage.removeItem("loggedInUser");
    window.dispatchEvent(new Event("storage"));
    router.push('/login');
  };

  const isAdmin = currentUser === 'Intercom';

  return (
    <>
      <SidebarHeader className='p-4'>
        <div className="flex items-center gap-3">
          <Logo className={cn(
              "size-9 text-primary transition-all duration-300",
              state === 'collapsed' && 'size-8'
          )} />
          <div className={cn(
              "flex flex-col transition-opacity duration-200",
               state === 'collapsed' && 'opacity-0 pointer-events-none'
            )}>
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
                 <SidebarMenuButton variant="ghost">
                    <UserCircle />
                    <span>{currentUser || 'Гость'}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    variant="outline" 
                    className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
