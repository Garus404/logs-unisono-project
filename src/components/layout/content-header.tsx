
"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from "@/components/ui/sidebar";

const viewTitles: Record<string, string> = {
    "/": "Сводка сервера",
    "/dashboard": "Сводка сервера",
    "/players": "Игроки на сервере",
    "/logs": "Все логи",
}

export default function ContentHeader() {
  const pathname = usePathname();
  const title = viewTitles[pathname] || "Панель управления";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    </header>
  );
}
