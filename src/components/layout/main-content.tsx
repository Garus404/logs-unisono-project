"use client";

import { useView } from "@/contexts/view-context";
import ContentHeader from "./content-header";
import SummaryView from "../views/summary-view";
import LogView from "../views/log-view";
import PlayersView from "../views/players-view";
import type { LogType } from "@/lib/types";
import { usePathname } from "next/navigation";
import PlayerPage from "@/app/player/[steamId]/page";


export default function MainContent() {
  const { view } = useView();
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/player/')) {
    const steamId = pathname.split('/player/')[1];
    return (
       <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-auto">
          <PlayerPage params={{ steamId }} />
        </main>
      </div>
    )
  }

  const renderView = () => {
    if (view.startsWith('logs_')) {
        const logType = view.replace('logs_', '') as LogType | 'all';
        return <LogView filterType={logType === 'all' ? undefined : logType} />;
    }

    switch (view) {
      case "summary":
        return <SummaryView />;
      case "players":
        return <PlayersView />;
      default:
        return <SummaryView />;
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <ContentHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
}
