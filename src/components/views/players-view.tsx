"use client";

import * as React from "react";
import Link from 'next/link';
import type { ServerStateResponse, Player } from "@/lib/types";
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
                <CardDescription>
                    <div className="text-sm text-muted-foreground">
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardDescription>
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

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}


export default function PlayersView() {
  const [serverState, setServerState] = React.useState<ServerStateResponse | null>(null);
  const [shuffledPlayers, setShuffledPlayers] = React.useState<Player[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServerState = async () => {
      try {
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
    const interval = setInterval(fetchServerState, 300000); // обновление каждые 5 минут

    return () => clearInterval(interval);
  }, []);
  
  React.useEffect(() => {
    if (serverState?.players) {
        // Initial shuffle
        setShuffledPlayers(shuffleArray(serverState.players));

        // Shuffle every 2 minutes
        const shuffleInterval = setInterval(() => {
            setShuffledPlayers(prevPlayers => shuffleArray(prevPlayers));
        }, 120000); // 120000 ms = 2 minutes

        return () => clearInterval(shuffleInterval);
    }
  }, [serverState?.players]);


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
    <div className="relative">
      {/* Основной контент - список игроков */}
      <div className="lg:mr-[400px]">
        <Card>
          <CardHeader>
            <CardTitle>Список игроков ({shuffledPlayers.length ?? 0})</CardTitle>
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
            {shuffledPlayers.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Игрок</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Убийства</TableHead>
                    <TableHead className="text-right hidden md:table-cell">Счет</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Пинг</TableHead>
                    <TableHead className="text-right">Время в игре</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shuffledPlayers.map((player, index) => (
                      <TableRow key={player.steamId || `${player.name}-${index}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums hidden sm:table-cell">
                          <div className="flex items-center justify-end gap-2">
                            <Skull className="w-4 h-4 text-red-400" />
                            {player.kills || 0}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums hidden md:table-cell">
                          <div className="flex items-center justify-end gap-2">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            {player.score}
                          </div>
                        </TableCell>
                        <TableCell className="text-right tabular-nums hidden sm:table-cell">
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
            )}
            {serverState && serverState.players.length === 0 && !loading && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>На сервере сейчас нет игроков.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Боковая панель с карточками - ТОЛЬКО НА ДЕСКТОПЕ */}
      <div className="hidden lg:block">
        <div className="fixed top-24 right-6 w-[380px] max-h-[calc(100vh-3rem)] overflow-y-auto space-y-6">
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

      {/* Мобильная версия карточек */}
      <div className="lg:hidden mt-6 space-y-6">
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