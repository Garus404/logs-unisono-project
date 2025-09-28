"use client";

import type { ViewType } from "@/lib/types";
import { createContext, useContext, useState, ReactNode } from "react";

type ViewContextType = {
  view: ViewType;
  setView: (view: ViewType) => void;
  viewTitle: string;
};

const ViewContext = createContext<ViewContextType | undefined>(undefined);

const viewTitles: Record<ViewType, string> = {
    summary: "Сводка сервера",
    logs_all: "Все логи",
    logs_connection: "Логи подключений",
    logs_chat: "Логи чата",
    logs_damage: "Логи урона",
    logs_kill: "Логи убийств",
    logs_spawn: "Логи появлений",
    logs_admin: "Логи админа",
    anomaly_detection: "Обнаружение аномалий ИИ",
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>('summary');
  const viewTitle = viewTitles[view] || "Панель управления";

  return (
    <ViewContext.Provider value={{ view, setView, viewTitle }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
}
