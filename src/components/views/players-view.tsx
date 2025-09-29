"use client";

import * as React from "react";
import { useRouter } from 'next/navigation';
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
  const router = useRouter();

  React.useEffect(() => {
    const fetchServerState = async () => {
      try {
        // No need to set loading to true here to avoid flashing on interval refresh
        const response = await fetch('/api/server-stats');
        const data = await response.json();

        if (!response.ok || data.error) {
          throw new Error(data.suggestion || data.error || 'Не удалось получить данные с сервера');
        }
        
        setServerState(data);
        setError(null);
      } catch (e: any) {
        setError(e.message);
        setServerState(null);
      } finally {
        setLoading(false);
      }
    };

    fetchServerState();
    const interval = setInterval(fetchServerState, 30000); // обновление каждые 30 секунд

    return () => clearInterval(interval);
  }, []);
  
  const handlePlayerClick = (steamId: string | undefined) => {
    if (!steamId) {
        // Here you could show a toast or some other feedback
        console.warn("Player has no SteamID, cannot navigate to details.");
        return;
    }
    router.push(`/player/${steamId}`);
  };


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
            <CardTitle>Список игроков ({serverState?.players?.length ?? 0})</CardTitle>
            <CardDescription>Игроки на сервере в данный момент. Нажмите на игрока, чтобы увидеть детали.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && !serverState && <PlayerListSkeleton />}
            {error && !loading && (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-center">
                <div>
                  <ServerCrash className="mx-auto h-12 w-12" />
                  <p className="mt-4">Не удалось загрузить список игроков.</p>
                  <div className="text-xs text-muted-foreground mt-1">{error}</div>
                </div>
              </div>
            )}
            {serverState && serverState.players.length > 0 && (
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
                      <TableRow key={player.raw?.steamid || `${player.name}-${index}`} className="group">
                        <TableCell onClick={() => handlePlayerClick(player.raw?.steamid)} className="cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handlePlayerClick(player.raw?.steamid)} className="text-right tabular-nums cursor-pointer">
                          <div className="flex items-center justify-end gap-2">
                            <Skull className="w-4 h-4 text-red-400" />
                            {player.kills || 0}
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handlePlayerClick(player.raw?.steamid)} className="text-right tabular-nums cursor-pointer">
                          <div className="flex items-center justify-end gap-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            {player.score}
                          </div>
                        </TableCell>
                        <TableCell onClick={() => handlePlayerClick(player.raw?.steamid)} className="text-right tabular-nums cursor-pointer">
                            <div className="flex items-center justify-end gap-2">
                                <Signal className="w-4 h-4 text-sky-400"/>
                                {player.ping}
                            </div>
                        </TableCell>
                        <TableCell onClick={() => handlePlayerClick(player.raw?.steamid)} className="text-right tabular-nums cursor-pointer">
                          <div className="flex items-center justify-end gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            {player.timeFormatted}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => handlePlayerClick(player.raw?.steamid)}>
                                        Посмотреть профиль
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
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
        {error && !loading && (
          <Card>
            <CardHeader>
              <CardTitle>Ошибка</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <ServerCrash className="h-4 w-4" />
                <AlertTitle>Сервер не отвечает</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
        {serverState && (
          <>
            <Card>
                <CardHeader>
                    <CardTitle>Информация о сервере</CardTitle>
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
