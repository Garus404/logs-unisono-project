"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";

const viewTitles: Record<string, string> = {
    "/": "Сводка сервера",
    "/dashboard": "Сводка сервера",
    "/players": "Игроки на сервере",
    "/logs": "Все логи",
    "/permissions": "Управление пользователями",
}

export default function ContentHeader() {
  const pathname = usePathname();
  // Basic title logic, can be expanded
  const isPlayerProfile = pathname.startsWith('/player/');
  let title = viewTitles[pathname] || "Панель управления";
  if (isPlayerProfile) {
    title = "Профиль игрока"
  }


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-lg md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    </header>
  );
}
