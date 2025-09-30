"use client";

import * as React from "react";
import { useRouter, useParams } from 'next/navigation';
import type { LogEntry, PlayerDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Clock, Briefcase, Gem, ShieldQuestion, DollarSign, Crown, Terminal, Signal, Skull, HeartCrack, MessageSquare, LogIn, LogOut, Sparkles, Megaphone, Bell, Fingerprint, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const PrimeLevelDisplay = ({ level }: { level: number }) => {
    const levels = [1, 2, 3, 4, 5];
    return (
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Crown className="text-primary"/>Прайм уровень</CardTitle>
                <CardDescription>Прайм уровень можно активировать по достижению 100 уровня.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-4">
                    <div className="h-0.5 bg-border w-full absolute top-1/2 -translate-y-1/2" />
                    <div className="flex justify-between relative">
                        {levels.map(l => (
                            <div key={l} className="flex flex-col items-center bg-card p-1 rounded-full">
                                <div className={`w-3 h-3 rounded-full border-2 ${l <= level ? 'bg-primary border-primary' : 'bg-card border-border'}`} />
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="text-sm text-center text-muted-foreground mt-4">
                    {level > 0 ? `Текущий уровень: ${level} / 5` : "Не активирован"}
                </div>
            </CardContent>
        </Card>
    );
};

const PlayerDetailsSkeleton = () => (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
         <Button variant="ghost" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <Skeleton className="h-4 w-40" />
        </Button>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
             <Card className="lg:col-span-1 sticky top-6">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-7 w-48 mt-4" />
                    <Skeleton className="h-4 w-56 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline text-sm">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                    </div>
                     <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                        <div className="flex flex-col gap-2 p-3 bg-card/30 rounded-md border"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-5 w-2/3" /></div>
                     </div>
                </CardContent>
            </Card>
            <div className="lg:col-span-2 space-y-6">
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent><Skeleton className="h-40 w-full" /></CardContent></Card>
            </div>
        </div>
    </div>
);

const ActivityLog = ({ logs, isLoading }: { logs: LogEntry[], isLoading: boolean }) => {
    
    const logTypeConfig = {
      CONNECTION: { label: "Подключение", icon: LogIn, color: "text-sky-400" },
      CHAT: { label: "Чат", icon: MessageSquare, color: "text-gray-400" },
      DAMAGE: { label: "Урон", icon: HeartCrack, color: "text-orange-400" },
      KILL: { label: "Убийство", icon: Skull, color: "text-red-500" },
      SPAWN: { label: "Событие", icon: Sparkles, color: "text-yellow-400" },
      ANNOUNCEMENT: { label: "Объявление", icon: Megaphone, color: "text-purple-400" },
      NOTIFICATION: { label: "Оповещение", icon: Bell, color: "text-indigo-400" },
      RP: { label: "Действие", icon: Fingerprint, color: "text-lime-400" },
    };

    if (isLoading && logs.length === 0) {
        return (
             <div className="space-y-4 pr-4 h-96">
                {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                        <Skeleton className="w-5 h-5 rounded-full" />
                        <div className="flex-1 space-y-1">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-3 w-1/3" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (logs.length === 0) {
        return (
             <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm h-40">
                <Terminal />
                <span>Нет записей об активности игрока.</span>
            </div>
        )
    }

    return (
        <ScrollArea className="h-96">
            <div className="space-y-4 pr-4">
                {logs.map((log) => {
                    const config = logTypeConfig[log.type] || { icon: Bell, color: "text-gray-500" };
                    const Icon = config.icon;

                    return (
                        <div key={log.id} className="flex items-start gap-4">
                            <div className={cn("mt-1 flex-shrink-0", config.color)}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <p className="text-sm text-foreground/90 break-words">{log.details}</p>
                                <p className="text-xs text-muted-foreground">
                                    {format(new Date(log.timestamp), "dd MMM yyyy, HH:mm:ss", { locale: ru })}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
    );
}

export default function PlayerPage() {
    const router = useRouter();
    const params = useParams();
    const steamId = params.steamId as string;

    const [player, setPlayer] = React.useState<PlayerDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const fetchPlayerDetails = React.useCallback(async (isInitialLoad = false) => {
        if (!steamId) {
            setError("SteamID не найден в URL.");
            if(isInitialLoad) setLoading(false);
            return;
        }
        
        if (isInitialLoad) {
            setLoading(true);
        } else {
            setIsUpdating(true);
        }
        setError(null);

        try {
            const res = await fetch(`/api/player-details/${steamId}`);
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Не удалось загрузить данные игрока');
            }
            const data: PlayerDetails = await res.json();
            
             // Merge activities instead of replacing them
            setPlayer(prevPlayer => {
                if (!prevPlayer) return data;

                const newActivities = data.activities.filter(
                    newActivity => !prevPlayer.activities.some(existing => existing.id === newActivity.id)
                );

                const combinedActivities = [...newActivities, ...prevPlayer.activities]
                    .slice(0, 30)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                
                return {
                    ...data,
                    activities: combinedActivities
                };
            });

        } catch (e: any) {
            setError(e.message);
        } finally {
            if (isInitialLoad) {
                setLoading(false);
            } else {
                setIsUpdating(false);
            }
        }
    }, [steamId]);


    React.useEffect(() => {
        fetchPlayerDetails(true); // Initial fetch
        
        const interval = setInterval(() => {
            fetchPlayerDetails(false); // Subsequent updates
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [fetchPlayerDetails]);
    
    if (loading) {
        return <PlayerDetailsSkeleton />;
    }

    if (error && !player) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-destructive">Ошибка</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mt-2">{error || "Игрок не найден."}</p>
                        <Button onClick={() => router.back()} className="mt-6 w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!player) {
         return <PlayerDetailsSkeleton />; // Should not happen if not loading and no error, but as a fallback
    }
    
    const InfoItem = ({ icon: Icon, label, value, isLoading = false, skeletonWidth = 'w-2/3' }: { icon: React.ElementType; label: string; value: React.ReactNode, isLoading?: boolean, skeletonWidth?: string }) => (
        <div className="flex items-start gap-3 text-sm p-3 bg-card/30 rounded-md border">
            <Icon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
                <span className="text-muted-foreground">{label}</span>
                {isLoading ? <Skeleton className={`h-5 mt-0.5 ${skeletonWidth}`} /> : <span className="font-semibold text-base">{value}</span>}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
             <Button onClick={() => router.back()} variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к списку игроков
            </Button>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
                <Card className="lg:col-span-1 sticky top-6">
                    <CardHeader className="items-center text-center">
                        <Avatar className="h-24 w-24 border-2 border-primary">
                            <AvatarFallback className="text-3xl">{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4 text-2xl">{player.name}</CardTitle>
                        <CardDescription>{player.steamId}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline text-sm">
                                <Label htmlFor="level" className="font-medium text-muted-foreground">Уровень</Label>
                                {isUpdating ? <Skeleton className="h-4 w-16" /> : <span className="font-bold">{player.level} / 100</span>}
                            </div>
                            {isUpdating ? <Skeleton className="h-4 w-full" /> : <Progress value={player.level} id="level" />}
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <InfoItem icon={Clock} label="В игре" value={player.timeFormatted} isLoading={isUpdating} skeletonWidth="w-full"/>
                            <InfoItem icon={DollarSign} label="Деньги" value={`$${player.money.toLocaleString('ru-RU')}`} isLoading={isUpdating} />
                            <InfoItem icon={User} label="Группа" value={<Badge variant={player.group === 'Игрок' ? 'outline' : 'secondary'}>{player.group}</Badge>} isLoading={isUpdating} />
                            <InfoItem icon={Briefcase} label="Профессия" value={player.profession} isLoading={isUpdating} />
                            <InfoItem icon={Signal} label="Пинг" value={`${player.ping} мс`} isLoading={isUpdating} skeletonWidth="w-1/2"/>
                            <InfoItem icon={Skull} label="Убийства" value={player.kills.toLocaleString('ru-RU')} isLoading={isUpdating} />
                            <InfoItem icon={HeartCrack} label="Смерти" value={player.deaths.toLocaleString('ru-RU')} isLoading={isUpdating} />
                        </div>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <PrimeLevelDisplay level={player.primeLevel} />
                    <Card className="bg-card/50">
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                <Gem className="text-primary"/>
                                Донатные профессии
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {isUpdating && player.donatedProfessions.length === 0 ? <Skeleton className="h-8 w-2/3" /> : player.donatedProfessions.length > 0 ? (
                               <div className="flex flex-wrap gap-2">
                                   {player.donatedProfessions.map(prof => (
                                       <Badge key={prof} variant="outline" className="text-base py-1 px-3 bg-card border-primary/50 text-primary">
                                           {prof}
                                       </Badge>
                                   ))}
                               </div>
                           ) : (
                               <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                   <ShieldQuestion />
                                   <span>Нет информации о донатных профессиях.</span>
                               </div>
                           )}
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <Terminal />
                                    Активность на сервере
                                </div>
                                <div className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
                                    <RefreshCw className={cn("w-3 h-3", isUpdating && "animate-spin")}/>
                                    <span>{isUpdating ? "Обновление..." : "Обновляется"}</span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <ActivityLog logs={player.activities} isLoading={isUpdating && player.activities.length === 0} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
