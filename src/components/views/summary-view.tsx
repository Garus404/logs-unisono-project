
"use client";

import * as React from "react";
import { Clock, Users, Server, AlertTriangle, Terminal, DownloadCloud, AlertCircle, Ban, Lock, ChevronsRight, Network, Shield, RotateCw } from "lucide-react";
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
    const [inputValue, setInputValue] = React.useState('');
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

    const addLog = React.useCallback((newLog: string | string[]) => {
      setLogs(prevLogs => {
        const logsToAdd = Array.isArray(newLog) ? newLog : [newLog];
        const updatedLogs = [...prevLogs, ...logsToAdd];
        return updatedLogs.length > 150 ? updatedLogs.slice(updatedLogs.length - 150) : updatedLogs;
      });
    }, []);

    const commands: { [key: string]: { description: string; execute: (args: string[]) => void } } = {
        help: {
            description: "Показывает список доступных команд.",
            execute: () => {
                addLog([
                    "Доступные команды:",
                    ...Object.entries(commands).map(([name, { description }]) => `  ${name} - ${description}`)
                ]);
            }
        },
        clear: {
            description: "Очищает консоль.",
            execute: () => setLogs([])
        },
        status: {
            description: "Показывает текущий статус сервера.",
            execute: () => {
                addLog([
                    "Server Status:",
                    `  CPU Load: ${(Math.random() * 50 + 20).toFixed(2)}%`,
                    `  Memory Usage: ${(Math.random() * 40 + 50).toFixed(2)}%`,
                    `  Uptime: ${Math.floor(Math.random() * 10) + 1} days, ${Math.floor(Math.random() * 24)} hours`,
                ]);
            }
        },
        'firewall status': {
             description: "Показывает статус файрвола.",
             execute: () => {
                 addLog([
                    "Firewall Status: Active",
                    "  Rules loaded: 254",
                    "  Blocked IPs (last 24h): 89",
                    "  Active connections: 112",
                 ]);
             }
        },
        'network stats': {
            description: "Отображает сетевую статистику.",
            execute: () => {
                addLog([
                    "Network Statistics:",
                    `  Inbound: ${(Math.random() * 5 + 1).toFixed(2)} MB/s`,
                    `  Outbound: ${(Math.random() * 2 + 0.5).toFixed(2)} MB/s`,
                    `  Packet loss: 0.0${Math.floor(Math.random() * 5)}%`,
                ]);
            }
        },
        'cache flush': {
            description: "Очищает кэш сервера.",
            execute: () => {
                addLog("SYSTEM: Server cache flushed successfully. Performance may be slightly degraded temporarily.");
            }
        },
        kick: {
            description: "Кикает игрока с сервера. Использование: kick <имя> <причина>",
            execute: (args) => {
                const [playerName, ...reasonParts] = args;
                const reason = reasonParts.join(' ');
                if (!playerName) {
                    addLog("Ошибка: Не указано имя игрока. Использование: kick <имя> <причина>");
                    return;
                }
                addLog(`SYSTEM: Игрок '${playerName}' был кикнут. Причина: ${reason || 'Без причины'}.`);
            }
        }
    };


    const handleCommand = (commandStr: string) => {
      if (!isAllowed) return;
      const userCommand = `> ${commandStr}`;
      addLog(userCommand);

      const commandKeys = Object.keys(commands).sort((a,b) => b.length - a.length);
      let executed = false;

      for (const key of commandKeys) {
          if (commandStr.startsWith(key)) {
              const args = commandStr.substring(key.length).trim().split(/\s+/).filter(Boolean);
              commands[key].execute(args);
              executed = true;
              break;
          }
      }

      if (!executed) {
          const [commandName] = commandStr.trim().split(/\s+/);
          addLog(`Ошибка: Команда '${commandName}' не найдена. Введите 'help' для списка команд.`);
      }

      setInputValue('');
    }

    React.useEffect(() => {
        if (!isAllowed || isLoading) return;

        setLogs(consoleLogs.slice(0, 20).sort(() => 0.5 - Math.random()));
        
        const interval = setInterval(() => {
            const newLog = consoleLogs[Math.floor(Math.random() * consoleLogs.length)];
            addLog(newLog);
        }, Math.random() * 2000 + 3000); // every 3-5 seconds

        return () => clearInterval(interval);
    }, [isAllowed, isLoading, addLog]);

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
            setIsUserScrolling(!isAtBottom);
        }
    };


    const getLogStyle = (log: string) => {
        const lowerLog = log.toLowerCase();
        if (log.startsWith("> ")) {
          return "text-green-400";
        }
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
      if (log.startsWith("> ")) {
          return <ChevronsRight className="w-3.5 h-3.5 text-green-400/80" />;
      }
        const lowerLog = log.toLowerCase();
        if (lowerLog.startsWith("threat_intelligence") || lowerLog.includes("updating")) {
            return <DownloadCloud className="w-3.5 h-3.5 text-blue-500/80" />;
        }
        if (lowerLog.includes("blocked") || lowerLog.includes("banned")) {
             return <Ban className="w-3.5 h-3.5 text-red-500/80" />;
        }
        if (lowerLog.includes("firewall")) {
             return <Shield className="w-3.5 h-3.5 text-orange-400/80" />;
        }
        if (lowerLog.includes("network")) {
             return <Network className="w-3.5 h-3.5 text-sky-400/80" />;
        }
        if (lowerLog.includes("cache")) {
             return <RotateCw className="w-3.5 h-3.5 text-indigo-400/80" />;
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
                    <span className="flex-1 break-all whitespace-pre-wrap">{log}</span>
                  </div>
                ))}
              </ScrollArea>
              <div className="relative p-2 border-t border-border">
                 <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <input
                  type="text"
                  placeholder={isAllowed ? "Введите команду... (напр. 'help')" : "Нужны права для доступа к консоли."}
                  disabled={!isAllowed}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inputValue) {
                      handleCommand(inputValue);
                    }
                  }}
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
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState<string>("");
  const [chartData, setChartData] = React.useState<PlayerActivity[]>([]);

  // Fetch server stats (less frequently)
  React.useEffect(() => {
    let isMounted = true;
    const fetchServerState = async () => {
      try {
        const serverRes = await fetch('/api/server-stats');
        if (!isMounted) return;

        if (!serverRes.ok) {
          const errorData = await serverRes.json();
          throw new Error(errorData.error || 'Ошибка при получении статуса сервера');
        }
        const serverData: ServerStateResponse = await serverRes.json();
        setServerState(serverData);
        setError(null);
      } catch (e: any) {
        if (isMounted) {
          setError(e.message);
          setServerState(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchServerState();
    const interval = setInterval(fetchServerState, 300000); // Refresh server data every 5 minutes

    return () => {
      isMounted = false;
      clearInterval(interval);
    }
  }, []);
  
  // Fetch activity chart data (more frequently)
  React.useEffect(() => {
    let isMounted = true;
    const fetchActivity = async () => {
        try {
            const activityRes = await fetch('/api/player-activity');
            if (!isMounted) return;

            if (!activityRes.ok) {
                // Don't throw a blocking error, just log it
                console.error('Ошибка при получении активности игроков');
                return;
            }
            const activityData: PlayerActivity[] = await activityRes.json();
            setChartData(activityData);

        } catch (e) {
            if (isMounted) {
                 console.error(e);
            }
        }
    }

    fetchActivity(); // Initial fetch
    const activityInterval = setInterval(fetchActivity, 60000); // Refresh chart every 1 minute

    return () => {
        isMounted = false;
        clearInterval(activityInterval);
    }
  }, []);

 React.useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;
    
    const updateMoscowTime = () => {
      const moscowTime = new Date().toLocaleTimeString('ru-RU', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentTime(moscowTime);
    };
    
    updateMoscowTime();
    intervalId = setInterval(updateMoscowTime, 1000);

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
                 <span className={`relative flex h-3 w-3`}>
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
            {loading && chartData.length === 0 ? (
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

    