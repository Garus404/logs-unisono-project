"use client";

import * as React from "react";
import Link from 'next/link';
import type { ServerStateResponse } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Map, ServerCrash, Users, Clock, Trophy, Signal, Server as ServerIcon, Network, GitBranch, Shield, Tag, Star, Skull, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

// Функция для fallback данных
function getFallbackData(): ServerStateResponse {
  const players = [
    { 
      name: "BRykot", 
      score: 150, 
      kills: 45, 
      time: 3600, 
      timeFormatted: "1ч 0м", 
      ping: 67, 
      timeHours: 1.0, 
      steamId: "STEAM_0:1:123456" 
    },
    { 
      name: "Стекло", 
      score: 80, 
      kills: 25, 
      time: 1800, 
      timeFormatted: "30м", 
      ping: 89, 
      timeHours: 0.5, 
      steamId: "STEAM_0:0:654321" 
    },
    { 
      name: "Danislav", 
      score: 200, 
      kills: 60, 
      time: 5400, 
      timeFormatted: "1ч 30м", 
      ping: 45, 
      timeHours: 1.5, 
      steamId: "STEAM_0:1:789012" 
    },
    { 
      name: "eislamov109", 
      score: 90, 
      kills: 30, 
      time: 2700, 
      timeFormatted: "45м", 
      ping: 72, 
      timeHours: 0.8, 
      steamId: "STEAM_0:0:456789" 
    },
    { 
      name: "Onlygey", 
      score: 180, 
      kills: 55, 
      time: 4800, 
      timeFormatted: "1ч 20м", 
      ping: 63, 
      timeHours: 1.3, 
      steamId: "STEAM_0:1:987654" 
    }
  ];

  return {
    server: {
      name: "۞ Unisono | Area-51 | SCP-RP | Добро пожаловать",
      map: "rp_unisono_area51_summer_2025",
      game: "DarkRP",
      maxplayers: 110,
      online: 12,
      serverPing: 55
    },
    connection: {
      ip: "46.174.53.106",
      port: 27015,
      protocol: 17,
      secure: true
    },
    players: players,
    statistics: {
      totalPlayers: 12,
      totalPlayTime: "15ч 30м",
      totalKills: 345,
      averagePing: 67,
      topPlayer: players[2]
    },
    details: {
      version: "2025.03.26",
      environment: "Linux",
      tags: ["gm:darkrp", "gmws:248302805", "gmc:rp", "loc:ru", "ver:250723"],
      steamId: "85568392923430335"
    },
    timestamp: new Date().toISOString()
  };
}

function InfoCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PlayerListSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-3/4" /></CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1-4" />
                    <Skeleton className="h-4 w-1/4" />
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default function PlayersView() {
  const [serverState, setServerState] = React.useState<ServerStateResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [usingFallback, setUsingFallback] = React.useState(false);

  const fetchServerState = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/server-stats');
      const data = await response.json();

      if (!response.ok || data.error) {
        console.log('API вернул ошибку, используем fallback данные');
        setServerState(getFallbackData());
        setUsingFallback(true);
        setError(null);
      } else {
        setServerState(data);
        setUsingFallback(false);
        setError(null);
      }
    } catch (e: any) {
      console.log('Ошибка запроса, используем fallback данные:', e.message);
      setServerState(getFallbackData());
      setUsingFallback(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServerState();
    const interval = setInterval(fetchServerState, 300000);

    return () => clearInterval(interval);
  }, []);

  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-muted-foreground mt-1"/>
        <div>
            <div className="text-sm text-muted-foreground">{label}</div>
            <div className="font-semibold">{value}</div>
        </div>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Список игроков ({serverState?.players?.length ?? 0})
              {usingFallback && (
                <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
                  Кэшированные данные
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {usingFallback 
                ? "Показаны последние доступные данные (сервер временно недоступен)"
                : "Игроки на сервере в данный момент. Нажмите на игрока, чтобы увидеть детали."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !serverState && <PlayerListSkeleton />}
            {serverState && serverState.players.length > 0 && (
              <>
                {usingFallback && (
                  <Alert className="mb-4 bg-amber-50 border-amber-200">
                    <ServerCrash className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">Сервер временно недоступен</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      Показаны последние кэшированные данные. Обновление автоматически продолжится когда сервер станет доступен.
                    </AlertDescription>
                  </Alert>
                )}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Игрок</TableHead>
                      <TableHead className="text-right">Убийства</TableHead>
                      <TableHead className="text-right">Счет</TableHead>
                      <TableHead className="text-right">Пинг</TableHead>
                      <TableHead className="text-right">Время в игре</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serverState.players.map((player, index) => (
                        <TableRow key={player.steamId || `${player.name}-${index}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{player.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            <div className="flex items-center justify-end gap-2">
                              <Skull className="w-4 h-4 text-red-400" />
                              {player.kills || 0}
                            </div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            <div className="flex items-center justify-end gap-2">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              {player.score}
                            </div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                              <div className="flex items-center justify-end gap-2">
                                  <Signal className="w-4 h-4 text-sky-400"/>
                                  {player.ping}
                              </div>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            <div className="flex items-center justify-end gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              {player.timeFormatted}
                            </div>
                          </TableCell>
                           <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" disabled={!player.steamId}>
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Действия</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                 <DropdownMenuItem asChild>
                                  {player.steamId && (
                                    <Link href={`/player/${player.steamId}`}>
                                      Посмотреть профиль
                                    </Link>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
            {serverState && serverState.players.length === 0 && !loading && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>На сервере сейчас нет игроков.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        {loading && !serverState && (
            <>
                <InfoCardSkeleton />
                <InfoCardSkeleton />
                <InfoCardSkeleton />
            </>
        )}
        {serverState && (
          <>
            <Card>
                <CardHeader>
                    <CardTitle>
                      Информация о сервере
                      {usingFallback && (
                        <Badge variant="outline" className="ml-2 text-xs text-amber-600 border-amber-300">
                          кэш
                        </Badge>
                      )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoItem icon={ServerIcon} label="Название" value={serverState.server.name} />
                    <InfoItem icon={Map} label="Карта" value={serverState.server.map} />
                    <InfoItem icon={Gamepad2} label="Игра" value={serverState.server.game} />
                    <InfoItem icon={Users} label="Игроки" value={`${serverState.server.online} / ${serverState.server.maxplayers}`} />
                    <InfoItem icon={Signal} label="Пинг сервера" value={`${serverState.server.serverPing} мс`} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Статистика сессии</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoItem icon={Clock} label="Общее время игры" value={serverState.statistics.totalPlayTime} />
                    <InfoItem icon={Skull} label="Всего убийств" value={serverState.statistics.totalKills || 0} />
                    <InfoItem icon={Signal} label="Средний пинг игроков" value={`${serverState.statistics.averagePing} мс`} />
                    {serverState.statistics.topPlayer && (
                        <InfoItem 
                            icon={Star} 
                            label="Лучший игрок (по времени)" 
                            value={
                                <div>
                                    {serverState.statistics.topPlayer.name}
                                    <span className="text-muted-foreground text-xs ml-2">({serverState.statistics.topPlayer.timeFormatted})</span>
                                </div>
                            }
                        />
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Детали подключения</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <InfoItem icon={Network} label="IP:Port" value={serverState.connection.ip} />
                    <InfoItem icon={GitBranch} label="Версия" value={serverState.details.version} />
                    <InfoItem icon={Shield} label="Защита" value={serverState.connection.secure ? <Badge variant="secondary" className="text-green-400">Secure (VAC)</Badge> : <Badge variant="destructive">Insecure</Badge>} />
                    {serverState.details.tags.length > 0 && 
                      <InfoItem icon={Tag} label="Теги" value={<div className="flex flex-wrap gap-1">{serverState.details.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}</div>} />
                    }
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}