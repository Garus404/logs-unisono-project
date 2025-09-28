"use client";

import * as React from "react";
import type { ServerState, Player } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Info, Map, ServerCrash, Users, Clock, Trophy } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function InfoCardSkeleton() {
  return (
    <Card>
        <CardHeader>
            <CardTitle><Skeleton className="h-6 w-1/2" /></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
             <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>
        </CardContent>
    </Card>
  );
}

function PlayerListSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-4 w-1/4" />
                     <Skeleton className="h-4 w-1/4" />
                </div>
            ))}
        </div>
    )
}

function formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

export default function PlayersView() {
  const [serverState, setServerState] = React.useState<ServerState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServerState = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/server-stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Ошибка при получении данных с сервера');
        }
        const data: ServerState = await response.json();
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
    const interval = setInterval(fetchServerState, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle>Список игроков</CardTitle>
                <CardDescription>
                    Игроки, находящиеся на сервере в данный момент.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {loading && <PlayerListSkeleton />}
                {error && !loading && (
                    <div className="flex items-center justify-center h-64 text-muted-foreground text-center">
                        <div>
                            <ServerCrash className="mx-auto h-12 w-12" />
                            <p className="mt-4">Не удалось загрузить список игроков.</p>
                            <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        </div>
                    </div>
                )}
                {serverState && serverState.players.length > 0 && (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Игрок</TableHead>
                                <TableHead className="text-right">Счет</TableHead>
                                <TableHead className="text-right">Время в игре</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {serverState.players.sort((a: Player, b: Player) => (b.score ?? 0) - (a.score ?? 0)).map((player: Player, index: number) => (
                                <TableRow key={`${player.name}-${index}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback>{player.name ? player.name.charAt(0).toUpperCase() : '?'}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{player.name || 'Неизвестный игрок'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        <div className="flex items-center justify-end gap-2">
                                           <Trophy className="w-4 h-4 text-amber-400" />
                                           {player.score ?? 0}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums">
                                        <div className="flex items-center justify-end gap-2">
                                           <Clock className="w-4 h-4 text-muted-foreground" />
                                           {formatTime(player.time ?? 0)}
                                        </div>
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
          {loading && <InfoCardSkeleton />}
          {error && !loading && (
             <Card>
                <CardHeader>
                    <CardTitle>Информация</CardTitle>
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
          {serverState && !loading && (
            <Card>
                <CardHeader>
                    <CardTitle>Информация о сервере</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Название</p>
                            <p className="font-semibold">{serverState.name}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Map className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Карта</p>
                            <p className="font-semibold">{serverState.map}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Gamepad2 className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Игра</p>
                            <p className="font-semibold">{serverState.game}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Users className="w-5 h-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Игроки</p>
                            <p className="font-semibold">{serverState.players.length} / {serverState.maxplayers}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
