"use client";

import * as React from "react";
import { Clock, Users, Server, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import type { PlayerActivity, ServerState } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";


const chartConfig = {
  players: {
    label: "Игроки",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function SummaryView() {
  const [serverState, setServerState] = React.useState<ServerState | null>(null);
  const [activity, setActivity] = React.useState<PlayerActivity[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState("");

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ru-RU'));
    }, 1000);

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
        const serverData: ServerState = await serverRes.json();
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

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
       {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
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
              <div className={`text-2xl font-bold ${error ? 'text-destructive' : 'text-green-400'}`}>
                {error ? 'Оффлайн' : 'Онлайн'}
              </div>
            }
            <p className="text-xs text-muted-foreground">
              ۞ Unisono | Area-51
            </p>
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
                    {serverState ? `${serverState.players.length} / ${serverState.maxplayers}` : '0 / 0'}
                </div>
             }
            <p className="text-xs text-muted-foreground">
              Обновляется каждые 30 сек.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время сервера</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {currentTime || "Загрузка..."}
            </div>
            <p className="text-xs text-muted-foreground">UTC+3 (Москва)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Активность игроков (Последние 48 часов)</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
            {loading && <div className="h-[300px] w-full flex items-center justify-center"><Skeleton className="h-full w-full" /></div>}
            {!loading && activity.length > 0 && (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                    accessibilityLayer
                    data={activity}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
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
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        />
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="players" fill="var(--color-players)" radius={4} />
                    </BarChart>
                </ChartContainer>
            )}
             {!loading && activity.length === 0 && !error && (
                <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">
                    <p>Не удалось загрузить данные об активности.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
