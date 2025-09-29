
"use client";

import * as React from "react";
import { historicalLogs } from "@/lib/data";
import type { LogEntry, LogType } from "@/lib/types";
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
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
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
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate fetching historical data
    setIsLoading(true);
    // Sort logs once on load
    const sortedLogs = [...historicalLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setLogs(sortedLogs);
    setIsLoading(false);
  }, []);


  React.useEffect(() => {
    setTypeFilter(filterType || "all");
  }, [filterType]);
  
  const filteredLogs = React.useMemo(() => {
    if (isLoading) return [];
    return logs.filter((log) => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const searchMatch =
        (log.user?.name.toLowerCase().includes(lowerCaseSearch) ||
        log.details.toLowerCase().includes(lowerCaseSearch) ||
        log.user?.steamId?.toLowerCase().includes(lowerCaseSearch)) ?? log.details.toLowerCase().includes(lowerCaseSearch);

      const typeMatch = typeFilter === "all" || log.type === typeFilter;
      
      const logDate = new Date(log.timestamp);
      const dateMatch = (!date || !date.from) || 
        (logDate >= date.from && logDate <= (date.to || new Date(date.from.getTime() + 24 * 60 * 60 * 1000 - 1)));

      return searchMatch && typeMatch && dateMatch;
    });
  }, [searchTerm, typeFilter, date, logs, isLoading]);
  
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
    const Icon = log.details.toLowerCase().includes('отключился') ? LogOut : config.icon;
    const sourceName = log.user ? `${log.user.name}` : '[Система]';

    return (
        <div className="flex items-start gap-3 p-3 border-b border-border/50 transition-colors hover:bg-muted/30">
            <Icon className={cn("w-4 h-4 mt-1 flex-shrink-0", config.color)} />
            <div className="flex-1 grid grid-cols-[140px_160px_1fr] items-start gap-4">
                 <span className="text-muted-foreground tabular-nums text-xs mt-0.5">
                    {format(log.timestamp, "dd MMM, HH:mm:ss", { locale: ru })}
                </span>
                 <div className="flex items-center gap-2">
                    <Badge variant={sourceName === '[Система]' ? 'secondary' : 'outline'} className="truncate font-medium">{sourceName}</Badge>
                 </div>
                 <p className="text-sm text-foreground/90 whitespace-pre-wrap break-words">{log.details}</p>
            </div>
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

      <Card className="border shadow-sm rounded-lg flex-1 flex flex-col min-h-0">
        <CardContent className="p-0 flex-1 flex">
            <ScrollArea className="w-full h-full">
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
