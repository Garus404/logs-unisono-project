"use client";

import * as React from "react";
import { mockLogs } from "@/lib/data";
import type { LogEntry, LogType } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const logTypeIcons: Record<LogType, React.ElementType> = {
  CONNECTION: LogIn,
  CHAT: MessageSquare,
  DAMAGE: HeartCrack,
  KILL: Swords,
  SPAWN: LocateFixed,
  ADMIN: UserCog,
};

const logTypeLabels: Record<LogType, string> = {
  CONNECTION: "Connection",
  CHAT: "Chat",
  DAMAGE: "Damage",
  KILL: "Kill",
  SPAWN: "Spawn",
  ADMIN: "Admin",
};

interface LogViewProps {
  filterType?: LogType;
}

export default function LogView({ filterType }: LogViewProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<LogType | "all">(filterType || "all");
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);

  React.useEffect(() => {
    setTypeFilter(filterType || "all");
  }, [filterType]);
  
  const filteredLogs = React.useMemo(() => {
    return mockLogs.filter((log) => {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const searchMatch =
        log.user.name.toLowerCase().includes(lowerCaseSearch) ||
        log.details.toLowerCase().includes(lowerCaseSearch) ||
        log.user.steamId.includes(lowerCaseSearch);

      const typeMatch = typeFilter === "all" || log.type === typeFilter;

      const dateMatch = !date || (log.timestamp >= (date.from || 0) && log.timestamp <= (date.to || Infinity));

      return searchMatch && typeMatch && dateMatch;
    });
  }, [searchTerm, typeFilter, date]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, details, or SteamID..."
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
                <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
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
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                        </>
                        ) : (
                        format(date.from, "LLL dd, y")
                        )
                    ) : (
                        <span>Pick a date range</span>
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
              Reset
            </Button>
          )}
        </div>
      </div>

      <Card className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
              <TableHead className="w-[200px]">User</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const Icon = log.details.includes('disconnected') ? LogOut : logTypeIcons[log.type];
                return (
                    <TableRow key={log.id}>
                    <TableCell className="font-medium tabular-nums">
                      {format(log.timestamp, "MMM dd, hh:mm:ss a")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                        <Icon className="h-3 w-3" />
                        <span>{logTypeLabels[log.type]}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                        <div>{log.user.name}</div>
                        <div className="text-xs text-muted-foreground">{log.user.steamId}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{log.details}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Dummy Card component to resolve compilation error
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props} />
  )
);
Card.displayName = "Card";
