"use client";

import * as React from "react";
import { generateLiveLog } from "@/lib/data";
import type { LogEntry, LogType, ServerStateResponse, Player } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Search,
  X,
  MessageSquare,
  LogIn,
  LogOut,
  HeartCrack,
  Swords,
  LocateFixed,
  Megaphone,
  Bell,
  Scroll,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const logTypeLabels: Record<LogType, string> = {
  CONNECTION: "Подключение",
  CHAT: "Чат",
  DAMAGE: "Урон",
  KILL: "Убийство",
  SPAWN: "Событие",
  ANNOUNCEMENT: "Объявление",
  NOTIFICATION: "Оповещение",
  RP: "Действие",
};

const MAX_LOGS = 100; // Keep the list from growing indefinitely

interface LogViewProps {
  filterType?: LogType;
}

export default function LogView({ filterType }: LogViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<LogType | "all">(filterType || "all");
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch initial players to start the simulation
  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/server-stats');
        const data: ServerStateResponse = await response.json();
        if (data && data.players) {
          setPlayers(data.players);
        }
      } catch (error) {
        console.error("Failed to fetch initial player data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Live log simulation effect
  React.useEffect(() => {
    if (players.length === 0) return;

    // Generate a new log at a random interval between 5 and 20 seconds
    const generateRandomInterval = () => Math.random() * (20000 - 5000) + 5000;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextLog = () => {
        timeoutId = setTimeout(() => {
            const newLogs = generateLiveLog(players);
            if (newLogs) {
                 setLogs(prevLogs => [...newLogs, ...prevLogs].slice(0, MAX_LOGS));
            }
            scheduleNextLog();
        }, generateRandomInterval());
    }

    scheduleNextLog();

    return () => clearTimeout(timeoutId);
  }, [players]);

  React.useEffect(() => {
    setTypeFilter(filterType || "all");
  }, [filterType]);
  
  const filteredLogs = React.useMemo(() => {
    return logs.filter((log) => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const searchMatch =
        (log.user?.name.toLowerCase().includes(lowerCaseSearch) ||
        log.details.toLowerCase().includes(lowerCaseSearch) ||
        log.user?.steamId.toLowerCase().includes(lowerCaseSearch)) ?? log.details.toLowerCase().includes(lowerCaseSearch);

      const typeMatch = typeFilter === "all" || log.type === typeFilter;

      const dateMatch = !date || (log.timestamp >= (date.from || 0) && log.timestamp <= (date.to || Infinity));

      return searchMatch && typeMatch && dateMatch;
    });
  }, [searchTerm, typeFilter, date, logs]);
  
  const LogSkeleton = () => (
    <div className="flex items-center gap-4 p-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full" />
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по пользователю, деталям или SteamID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
            <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as LogType | "all")}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Фильтр по типу" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {Object.keys(logTypeLabels).map((type) => (
                    <SelectItem key={type} value={type}>
                    {logTypeLabels[type as LogType]}
                    </SelectItem>
                ))}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className={cn(
                        "w-full md:w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                    >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                        date.to ? (
                        <>
                            {format(date.from, "LLL dd, y", { locale: ru })} -{" "}
                            {format(date.to, "LLL dd, y", { locale: ru })}
                        </>
                        ) : (
                        format(date.from, "LLL dd, y", { locale: ru })
                        )
                    ) : (
                        <span>Выберите диапазон дат</span>
                    )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                    locale={ru}
                    />
                </PopoverContent>
            </Popover>
            {(searchTerm || typeFilter !== (filterType || 'all') || date) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter(filterType || 'all');
                setDate(undefined);
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          )}
        </div>
      </div>

      <Card className="border shadow-sm rounded-lg">
        <CardContent className="p-0">
            <div className="bg-black/80 rounded-lg p-4 font-mono text-sm text-green-400 space-y-2 h-[calc(100vh-20rem)] overflow-y-auto">
                {isLoading ? (
                    Array.from({length: 15}).map((_, i) => <LogSkeleton key={i} />)
                ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                    const sourceName = log.user ? `Игрок ${log.user.name}` : '[Система]';
                    return (
                        <div key={log.id} className="flex items-start gap-3 transition-opacity animate-in fade-in-0">
                            <span className="text-muted-foreground tabular-nums shrink-0">
                                {format(log.timestamp, "yyyy-MM-dd HH:mm:ss", { locale: ru })}
                            </span>
                            <span className="font-bold text-sky-300 shrink-0">{sourceName}</span>
                            <p className="text-green-300/90">{log.details}</p>
                        </div>
                    );
                })
                ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                    Ожидание логов с сервера...
                </div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
