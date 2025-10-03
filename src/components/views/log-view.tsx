
"use client";

import * as React from "react";
import { generateSingleRandomLog, historicalLogs } from "@/lib/data";
import type { LogEntry, LogType, Player } from "@/lib/types";
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
  Skull,
  Sparkles,
  Megaphone,
  Bell,
  Fingerprint
} from "lucide-react";
import { format, isSameDay, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";

const logTypeConfig: Record<LogType, { label: string; icon: React.ElementType, color: string }> = {
  CONNECTION: { label: "Подключение", icon: LogIn, color: "text-sky-400" },
  CHAT: { label: "Чат", icon: MessageSquare, color: "text-gray-400" },
  DAMAGE: { label: "Урон", icon: HeartCrack, color: "text-orange-400" },
  KILL: { label: "Убийство", icon: Skull, color: "text-red-500" },
  SPAWN: { label: "Событие", icon: Sparkles, color: "text-yellow-400" },
  ANNOUNCEMENT: { label: "Объявление", icon: Megaphone, color: "text-purple-400" },
  NOTIFICATION: { label: "Оповещение", icon: Bell, color: "text-indigo-400" },
  RP: { label: "Действие", icon: Fingerprint, color: "text-lime-400" },
};


interface LogViewProps {
  filterType?: LogType;
}

export default function LogView({ filterType }: LogViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<LogType | "all">(filterType || "all");
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [players, setPlayers] = React.useState<Player[]>([]);

  React.useEffect(() => {
    // Simulate fetching historical data and players
    setIsLoading(true);
    
    // In a real app, you'd fetch players. Here we'll use a subset from the logs.
    const uniquePlayers = Array.from(new Set(historicalLogs.map(l => l.user?.name).filter(Boolean)))
      .map(name => ({
        name: name as string,
        score: Math.floor(Math.random() * 200),
        time: Math.floor(Math.random() * 3000),
        timeFormatted: 'mock',
        ping: Math.floor(Math.random() * 100),
        kills: Math.floor(Math.random() * 50),
        timeHours: 0,
        steamId: `STEAM_0:${Math.random() > 0.5 ? 1 : 0}:${Math.floor(Math.random() * 100000000)}`,
      }));
    setPlayers(uniquePlayers);
    
    // Sort logs once on load
    const sortedLogs = [...historicalLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setLogs(sortedLogs);
    setIsLoading(false);
  }, []);
  
  React.useEffect(() => {
    if (isLoading || players.length === 0) return;

    // Only add new logs in real-time if the user is viewing today's logs
    if (date && !isSameDay(date, new Date())) {
        return;
    }

    const interval = setInterval(() => {
        const newLog = generateSingleRandomLog(players, new Date());
        
        const addLogs = (logOrLogs: LogEntry | LogEntry[] | null) => {
            if (!logOrLogs) return;
            if (Array.isArray(logOrLogs)) {
                setLogs(prevLogs => [...logOrLogs.reverse(), ...prevLogs]);
            } else {
                setLogs(prevLogs => [logOrLogs, ...prevLogs]);
            }
        }
        addLogs(newLog);

    }, 3000 + Math.random() * 4000); // Add a new log every 3-7 seconds

    return () => clearInterval(interval);
  }, [isLoading, players, date]);


  React.useEffect(() => {
    setTypeFilter(filterType || "all");
  }, [filterType]);
  
  const filteredLogs = React.useMemo(() => {
    const selectedDate = date ? startOfDay(date) : startOfDay(new Date());

    return logs.filter((log) => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const searchMatch =
        !searchTerm ||
        (log.user?.name.toLowerCase().includes(lowerCaseSearch) ||
        log.details.toLowerCase().includes(lowerCaseSearch) ||
        log.user?.steamId?.toLowerCase().includes(lowerCaseSearch));

      const typeMatch = typeFilter === "all" || log.type === typeFilter;
      
      const logDate = new Date(log.timestamp);
      const dateMatch = isSameDay(logDate, selectedDate);

      return searchMatch && typeMatch && dateMatch;
    });
  }, [searchTerm, typeFilter, date, logs]);
  
  const LogSkeleton = () => (
    <div className="flex items-center gap-4 p-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
    </div>
  )

  const LogItem = ({log}: {log: LogEntry}) => {
    const config = logTypeConfig[log.type] || { icon: Bell, color: "text-gray-500" };
    let Icon = config.icon;
    let sourceName = log.user?.name || '[Система]';

    if (log.type === 'CONNECTION' && log.details.toLowerCase().includes('отключился')) {
        Icon = LogOut;
    }
    if (log.type === 'KILL' && log.details.toLowerCase().includes('убит падением')) {
        sourceName = log.user?.name || '[Система]';
    } else if (log.type === 'KILL') {
        sourceName = log.user?.name || '[Система]';
    } else if(log.type === 'DAMAGE') {
        // For damage, the user is the one receiving damage, not the source.
        // We find the source from the details string.
        const match = log.details.match(/от (.+)\.$/);
        if (match && match[1]) {
             sourceName = match[1];
        } else {
            sourceName = '[Система]'; // Fallback
        }
    }

    return (
        <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3 p-3 border-b border-border/50 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4 flex-shrink-0", config.color)} />
                <span className="text-muted-foreground tabular-nums text-xs md:w-[120px]">
                    {format(log.timestamp, "dd MMM, HH:mm:ss", { locale: ru })}
                </span>
                 <div className="md:w-[160px] flex-shrink-0">
                    <Badge variant={sourceName === '[Система]' ? 'secondary' : 'outline'} className="truncate font-medium">
                        {sourceName}
                    </Badge>
                </div>
            </div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words pl-7 md:pl-0">
                {log.details}
            </p>
        </div>
    )
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
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
                {Object.entries(logTypeConfig).map(([type, {label}]) => (
                    <SelectItem key={type} value={type}>
                    {label}
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
                    {date ? (
                        format(date, "PPP", { locale: ru })
                    ) : (
                        <span>Выберите дату</span>
                    )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={ru}
                    />
                </PopoverContent>
            </Popover>
            {(searchTerm || typeFilter !== (filterType || 'all') || date && !isSameDay(date, new Date())) && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("");
                setTypeFilter(filterType || 'all');
                setDate(new Date());
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Сбросить
            </Button>
          )}
        </div>
      </div>

      <Card className="border shadow-sm rounded-lg flex-1 flex flex-col min-h-0">
        <CardContent className="p-0 flex-1 flex">
            <ScrollArea className="w-full h-[calc(100vh-220px)]">
                {isLoading ? (
                    Array.from({length: 25}).map((_, i) => <LogSkeleton key={i} />)
                ) : filteredLogs.length > 0 ? (
                    <div>
                        {filteredLogs.map((log) => <LogItem key={log.id} log={log} />)}
                    </div>
                ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-center p-8">
                    Нет логов, соответствующих вашему запросу.
                </div>
                )}
            </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
