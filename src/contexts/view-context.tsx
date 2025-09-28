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
    summary: "Server Summary",
    logs_all: "All Logs",
    logs_connection: "Connection Logs",
    logs_chat: "Chat Logs",
    logs_damage: "Damage Logs",
    logs_kill: "Kill Logs",
    logs_spawn: "Spawn Logs",
    logs_admin: "Admin Logs",
    anomaly_detection: "AI Anomaly Detection",
}

export function ViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewType>('summary');
  const viewTitle = viewTitles[view] || "Dashboard";

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
