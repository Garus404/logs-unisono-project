"use client";

import * as React from "react";
import { getServerInfoAction } from "@/app/actions";
import type { ServerInfo } from "@/app/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Gamepad2, Info, Map, ServerCrash, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function InfoCardSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-5 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-4 w-4/5" />
        </div>
    );
}

export default function PlayersView() {
  const [serverInfo, setServerInfo] = React.useState<ServerInfo | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServerInfo = async () => {
      setLoading(true);
      const result = await getServerInfoAction();
      if ('error' in result) {
        setError(result.error);
        setServerInfo(null);
      } else {
        setServerInfo(result);
        setError(null);
      }
      setLoading(false);
    };

    fetchServerInfo();
  }, []);

  const playerPercentage = serverInfo ? (serverInfo.players / serverInfo.maxPlayers) * 100 : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Информация о сервере</CardTitle>
          <CardDescription>
            Текущая информация о игровом сервере.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
             {loading && <InfoCardSkeleton />}
             {error && (
                <Alert variant="destructive">
                  <ServerCrash className="h-4 w-4" />
                  <AlertTitle>Ошибка</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
             )}
             {serverInfo && (
                <>
                    <div className="flex items-center gap-3">
                        <Info className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Название</p>
                            <p className="font-semibold">{serverInfo.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Map className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Карта</p>
                            <p className="font-semibold">{serverInfo.map}</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-muted-foreground"/>
                        <div>
                            <p className="text-sm text-muted-foreground">Игра</p>
                            <p className="font-semibold">{serverInfo.game}</p>
                        </div>
                    </div>
                </>
             )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Игроки</CardTitle>
           <CardDescription>
            Количество игроков на сервере в данный момент.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-full space-y-4 pt-8">
            {loading && (
                <>
                    <Skeleton className="h-16 w-32" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-full" />
                </>
            )}
            {serverInfo && (
                <>
                    <div className="text-6xl font-bold">
                        {serverInfo.players} 
                        <span className="text-3xl text-muted-foreground">/ {serverInfo.maxPlayers}</span>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{`Занято ${playerPercentage.toFixed(0)}% слотов`}</span>
                    </p>
                    <Progress value={playerPercentage} className="w-full" />
                </>
            )}
            {error && <p className="text-sm text-muted-foreground">Не удалось загрузить информацию о игроках.</p>}
        </CardContent>
      </Card>

    </div>
  );
}
