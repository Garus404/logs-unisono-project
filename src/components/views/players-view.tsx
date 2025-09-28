"use client";

import * as React from "react";
import { getPlayersAction } from "@/app/actions";
import type { Player, ServerState } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Gamepad2, Info, Loader2, Map, ServerCrash } from "lucide-react";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}с`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  let timeString = "";
  if (hours > 0) timeString += `${hours}ч `;
  if (minutes > 0) timeString += `${minutes}м`;
  return timeString.trim() || '0м';
}

function PlayerRow({ player, index }: { player: Player; index: number }) {
  const avatarUrl = `https://i.pravatar.cc/40?u=${player.name}`;
  return (
    <TableRow>
      <TableCell className="font-medium">{index + 1}</TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={player.name} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{player.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-right font-mono">{player.score}</TableCell>
      <TableCell className="text-right font-mono">{formatTime(player.time)}</TableCell>
    </TableRow>
  );
}

function PlayersSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function PlayersView() {
  const [serverState, setServerState] = React.useState<ServerState | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      const result = await getPlayersAction();
      if ('error' in result) {
        setError(result.error);
        setServerState(null);
      } else {
        setServerState(result);
        setError(null);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_300px]">
      <Card>
        <CardHeader>
          <CardTitle>Игроки на сервере</CardTitle>
          <CardDescription>
            Список игроков, которые в данный момент находятся на сервере.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <PlayersSkeleton />}
          {error && (
            <Alert variant="destructive">
              <ServerCrash className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {serverState && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Игрок</TableHead>
                  <TableHead className="text-right">Очки</TableHead>
                  <TableHead className="text-right w-[120px]">Время в игре</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serverState.players.length > 0 ? (
                  serverState.players
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => <PlayerRow key={player.name} player={player} index={index} />)
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      На сервере нет игроков.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Информация о сервере</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {loading && (
                 <div className="space-y-3">
                     <Skeleton className="h-5 w-4/5" />
                     <Skeleton className="h-4 w-3/5" />
                     <Skeleton className="h-4 w-2/5" />
                 </div>
             )}
             {serverState && (
                <>
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Название</p>
                            <p className="font-semibold">{serverState.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Map className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Карта</p>
                            <p className="font-semibold">{serverState.map}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Игра</p>
                            <p className="font-semibold">{serverState.game}</p>
                        </div>
                    </div>
                </>
             )}
              {error && <p className="text-sm text-muted-foreground">Не удалось загрузить информацию.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
