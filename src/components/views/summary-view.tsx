
"use client";

import * as React from "react";
import { Clock, Users, Server, AlertTriangle, Terminal, DownloadCloud, AlertCircle, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { PlayerActivity, ServerStateResponse } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { consoleLogs } from "@/lib/data";

const chartConfig = {
  players: {
    label: "Игроки",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const LiveConsole = () => {
    const [logs, setLogs] = React.useState<string[]>([]);
    const scrollAreaRef = React.useRef<HTMLDivElement>(null);
    const [isUserScrolling, setIsUserScrolling] = React.useState(false);

    React.useEffect(() => {
        setLogs(consoleLogs.slice(0, 20).sort(() => 0.5 - Math.random()));
        
        const interval = setInterval(() => {
            const newLog = consoleLogs[Math.floor(Math.random() * consoleLogs.length)];
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, newLog];
                return newLogs.length > 150 ? newLogs.slice(newLogs.length - 150) : newLogs;
            });
        }, Math.random() * 1000 + 1000); // every 1-2 seconds

        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        if (!isUserScrolling && scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [logs, isUserScrolling]);
    
    // Detect if user is scrolling up
    const handleScroll = () => {
        const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            const isAtBottom = viewport.scrollHeight - viewport.scrollTop <= viewport.clientHeight + 1; // +1 for pixel perfection
            if (isAtBottom) {
                setIsUserScrolling(false);
            } else {
                setIsUserScrolling(true);
            }
        }
    };


    const getLogStyle = (log: string) => {
        const lowerLog = log.toLowerCase();
        if (lowerLog.startsWith("have -") || lowerLog.startsWith("already downloaded")) {
            return "text-green-400";
        }
        if (lowerLog.includes("ignoring server") || lowerLog.includes("is blacklisted")) {
             return "text-yellow-500";
        }
        if (lowerLog.includes("unknown command") || lowerLog.includes("bad sequence") || lowerLog.includes("error")) {
            return "text-red-500";
        }
        if (lowerLog.startsWith("[darkrp]")) {
            return "text-cyan-400";
        }
         if (lowerLog.startsWith("[_loader_]")) {
            return "text-purple-400";
        }
        return "text-muted-foreground";
    }
    
    const getIcon = (log: string) => {
        const lowerLog = log.toLowerCase();
        if (lowerLog.startsWith("have -") || lowerLog.startsWith("already downloaded")) {
            return <DownloadCloud className="w-3.5 h-3.5 text-green-500/80" />;
        }
        if (lowerLog.includes("ignoring server") || lowerLog.includes("is blacklisted")) {
             return <Ban className="w-3.5 h-3.5 text-yellow-500/80" />;
        }
        if (lowerLog.includes("unknown command") || lowerLog.includes("bad sequence") || lowerLog.includes("error")) {
            return <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />;
        }
        return <Terminal className="w-3.5 h-3.5 text-slate-500" />;
    }

    return (
        <Card>
             <CardHeader>
                <CardTitle>Консоль сервера</CardTitle>
            </CardHeader>
             <CardContent>
                <ScrollArea className="h-[300px] w-full bg-black/50 rounded-md p-4 font-mono text-xs" ref={scrollAreaRef} onScroll={handleScroll}>
                     {logs.map((log, index) => (
                        <div key={index} className={cn("flex items-start gap-2 mb-1", getLogStyle(log))}>
                           <span className="mt-0.5 flex-shrink-0">{getIcon(log)}</span>
                           <span className="flex-1 break-all">{log}</span>
                        </div>
                    ))}
                </ScrollArea>
             </CardContent>
        </Card>
    );
}


export default function SummaryView() {
  const [serverState, setServerState] = React.useState<ServerStateResponse | null>(null);
  const [activity, setActivity] = React.useState<PlayerActivity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState<string>("");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch both data points in parallel
        const [serverRes, activityRes] = await Promise.all([
          fetch('/api/server-stats'),
          fetch('/api/player-activity')
        ]);

        if (!serverRes.ok) {
          const errorData = await serverRes.json();
          throw new Error(errorData.error || 'Ошибка при получении статуса сервера');
        }
        const serverData: ServerStateResponse = await serverRes.json();
        setServerState(serverData);
        
        if (!activityRes.ok) {
           throw new Error('Ошибка при получении активности игроков');
        }
        const activityData: PlayerActivity[] = await activityRes.json();
        setActivity(activityData);

        setError(null);
      } catch (e: any) {
        setError(e.message);
        setServerState(null);
        setActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh data every 5 minutes

    return () => {
      clearInterval(interval);
    }
  }, []);

 React.useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const updateMoscowTime = () => {
      // Using client-side Date object which is fine for display purposes
      const moscowTime = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Asia/Singapore' });
      setCurrentTime(moscowTime);
    };

    // Set initial time right away on the client
    if (typeof window !== 'undefined') {
        updateMoscowTime();
        intervalId = setInterval(updateMoscowTime, 1000);
    }

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-6">
       {error && !loading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ошибка получения данных</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Статус сервера</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-24" /> :
              <div className={`text-2xl font-bold ${!serverState ? 'text-destructive' : 'text-green-400'}`}>
                {!serverState ? 'Оффлайн' : 'Онлайн'}
              </div>
            }
            <div className="text-xs text-muted-foreground">
              {loading ? <Skeleton className="h-4 w-32 mt-1" /> : (serverState?.server.name || "۞ Unisono | Area-51")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Игроки</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {loading ? <Skeleton className="h-8 w-20" /> :
                <div className="text-2xl font-bold">
                    {serverState ? `${serverState.server.online} / ${serverState.server.maxplayers}` : '0 / 0'}
                </div>
             }
            <div className="text-xs text-muted-foreground">
              Обновляется каждые 5 мин.
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время сервера</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {currentTime || <Skeleton className="h-8 w-28" />}
            </div>
            <p className="text-xs text-muted-foreground">UTC+8</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Активность игроков (Последние 48 часов)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            {loading && (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            )}
            {!loading && activity.length > 0 && (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart
                  accessibilityLayer
                  data={activity}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 5)}
                  />
                  <ChartTooltip
                    cursor={true}
                    content={
                      <ChartTooltipContent
                        indicator="line"
                        labelFormatter={(label, payload) => {
                          return `${payload[0]?.payload.time}`;
                        }}
                      />
                    }
                  />
                  <defs>
                    <linearGradient id="fillPlayers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-players)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-players)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="players"
                    type="natural"
                    fill="url(#fillPlayers)"
                    fillOpacity={0.4}
                    stroke="var(--color-players)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            )}
            {!loading && activity.length === 0 && !error && (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                <p>Не удалось загрузить данные об активности.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <LiveConsole />
      </div>
    </div>
  );
}
