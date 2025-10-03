
"use client";

import * as React from "react";
import { Clock, Users, Server, AlertTriangle, Terminal, DownloadCloud, AlertCircle, Ban, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { PlayerActivity, ServerStateResponse, User } from "@/lib/types";
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
    const [isAllowed, setIsAllowed] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentUserLogin, setCurrentUserLogin] = React.useState<string | null>(null);

    React.useEffect(() => {
        const user = localStorage.getItem("loggedInUser");
        setCurrentUserLogin(user);

        const handleStorageChange = () => {
            setCurrentUserLogin(localStorage.getItem("loggedInUser"));
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const checkPermissions = React.useCallback(async () => {
        if (!currentUserLogin) {
            setIsAllowed(false);
            setIsLoading(false);
            return;
        }

        if (currentUserLogin === 'Intercom') {
            setIsAllowed(true);
            setIsLoading(false);
            return;
        }
        
        try {
            const res = await fetch('/api/users');
            if (!res.ok) {
                 setIsAllowed(false);
                 return;
            }
            const users: User[] = await res.json();
            const user = users.find(u => u.login === currentUserLogin);

            if (user?.permissions?.viewConsole) {
                setIsAllowed(true);
            } else {
                setIsAllowed(false);
            }
        } catch (error) {
            console.error("Failed to check permissions", error);
            setIsAllowed(false);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserLogin]);


    React.useEffect(() => {
        checkPermissions(); // Initial check
        const interval = setInterval(checkPermissions, 5000); // Re-check every 5 seconds
        return () => clearInterval(interval);
    }, [checkPermissions]);

    React.useEffect(() => {
        if (!isAllowed || isLoading) return;

        setLogs(consoleLogs.slice(0, 20).sort(() => 0.5 - Math.random()));
        
        const interval = setInterval(() => {
            const newLog = consoleLogs[Math.floor(Math.random() * consoleLogs.length)];
            setLogs(prevLogs => {
                const newLogs = [...prevLogs, newLog];
                return newLogs.length > 150 ? newLogs.slice(newLogs.length - 150) : newLogs;
            });
        }, Math.random() * 1000 + 1000); // every 1-2 seconds

        return () => clearInterval(interval);
    }, [isAllowed, isLoading]);

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
        if (lowerLog.startsWith("success") || lowerLog.includes(" successfully") || lowerLog.includes(" passed")) {
            return "text-green-400";
        }
        if (lowerLog.includes("warn") || lowerLog.includes("throttling") || lowerLog.includes("detected")) {
             return "text-yellow-500";
        }
        if (lowerLog.includes("error") || lowerLog.includes("failed") || lowerLog.includes("blocked") || lowerLog.includes("alert")) {
            return "text-red-500";
        }
        if (lowerLog.startsWith("[auth]")) {
            return "text-cyan-400";
        }
         if (lowerLog.startsWith("[system]")) {
            return "text-purple-400";
        }
        return "text-muted-foreground";
    }
    
    const getIcon = (log: string) => {
        const lowerLog = log.toLowerCase();
        if (lowerLog.startsWith("threat_intelligence") || lowerLog.includes("updating")) {
            return <DownloadCloud className="w-3.5 h-3.5 text-blue-500/80" />;
        }
        if (lowerLog.includes("blocked") || lowerLog.includes("banned")) {
             return <Ban className="w-3.5 h-3.5 text-red-500/80" />;
        }
        if (lowerLog.includes("error") || lowerLog.includes("failed") || lowerLog.includes("alert")) {
            return <AlertCircle className="w-3.5 h-3.5 text-red-500/80" />;
        }
        return <Terminal className="w-3.5 h-3.5 text-slate-500" />;
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Консоль сервера</CardTitle>
          <CardDescription>Прямая трансляция системных событий и безопасности.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
             <div className={cn("bg-black/50 rounded-md font-code text-xs border", !isAllowed && !isLoading && "blur-sm")}>
              <ScrollArea
                className="h-[300px] w-full p-4"
                ref={scrollAreaRef}
                onScroll={handleScroll}
              >
                {isAllowed && logs.map((log, index) => (
                  <div
                    key={index}
                    className={cn("flex items-start gap-2 mb-1", getLogStyle(log))}
                  >
                    <span className="mt-0.5 flex-shrink-0">{getIcon(log)}</span>
                    <span className="flex-1 break-all">{log}</span>
                  </div>
                ))}
              </ScrollArea>
              <div className="relative p-2 border-t border-border">
                 <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  placeholder={isAllowed ? "Введите команду..." : "Нужны права для доступа к консоли."}
                  disabled={!isAllowed}
                  className="w-full bg-transparent pl-8 pr-2 py-1 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 border-none"
                />
              </div>
            </div>
            {(!isAllowed || isLoading) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-md z-10">
                 {isLoading ? (
                     <div className="flex items-center gap-2 text-white">
                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                         <span>Проверка разрешений...</span>
                     </div>
                 ) : (
                    <>
                      <Lock className="w-12 h-12 text-yellow-500/80" />
                      <p className="mt-4 text-center font-semibold text-white">
                        Доступ запрещен
                      </p>
                      <p className="text-xs text-muted-foreground">Обратитесь к администратору для получения доступа.</p>
                    </>
                 )}
              </div>
            )}
          </div>
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
  const [chartData, setChartData] = React.useState<PlayerActivity[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (loading === false) setLoading(true);
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
        setChartData(activityData);

        setError(null);
      } catch (e: any) {
        setError(e.message);
        setServerState(null);
        setChartData([]);
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
    let intervalId: NodeJS.Timeout | undefined = undefined;
    
    const updateMoscowTime = () => {
      // Using client-side Date object which is fine for display purposes
      const moscowTime = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(moscowTime);
    };

    // Set initial time right away on the client
    if (typeof window !== 'undefined') {
        updateMoscowTime();
        intervalId = setInterval(updateMoscowTime, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
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
              <div className={`text-2xl font-bold flex items-center gap-2 ${!serverState || !serverState.server ? 'text-destructive' : 'text-green-400'}`}>
                 <span className={`relative flex h-3 w-3">
                    <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", !serverState || !serverState.server ? 'bg-destructive' : 'bg-green-400')}></span>
                    <span className={cn("relative inline-flex rounded-full h-3 w-3", !serverState || !serverState.server ? 'bg-destructive' : 'bg-green-500')}></span>
                </span>
                {!serverState || !serverState.server ? 'Оффлайн' : 'Онлайн'}
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
                    {serverState?.server ? `${serverState.server.online} / ${serverState.server.maxplayers}` : '0 / 0'}
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
            <div className="text-2xl font-bold font-code tabular-nums">
              {currentTime || <Skeleton className="h-8 w-28" />}
            </div>
            <p className="text-xs text-muted-foreground">UTC+8 (Asia/Singapore)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Активность игроков</CardTitle>
            <CardDescription>Динамика онлайна за последние 48 часов</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
              <div className="h-[300px] w-full flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillPlayers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            stroke="hsl(var(--border))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value, index) => {
                                // Show label every 4 ticks to prevent overlap
                                return index % 4 === 0 ? value : "";
                            }}
                        />
                        <Tooltip
                            content={({ active, payload, label }) =>
                            active && payload && payload.length ? (
                                <div className="rounded-lg border bg-background/80 backdrop-blur-sm p-2 shadow-sm">
                                <div className="grid grid-cols-1 gap-1">
                                    <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Время</span>
                                        <span className="font-bold text-foreground">{label}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[0.70rem] uppercase text-muted-foreground">Игроки</span>
                                        <span className="font-bold text-primary">{payload[0].value}</span>
                                    </div>
                                </div>
                                </div>
                            ) : null
                            }
                        />
                         <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                        <Area type="monotone" dataKey="players" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#fillPlayers)" />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
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
