// src/app/player/[steamId]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from 'next/navigation';
import type { PlayerDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Star, Clock, Briefcase, Gem, ShieldQuestion, DollarSign, Crown, Terminal, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";

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
                    Текущий уровень: <span className="font-bold text-foreground">{level}</span> / 5
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-1">
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-7 w-48 mt-4" />
                    <Skeleton className="h-4 w-56 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/4 mb-2" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                     <div className="flex justify-between gap-4">
                        <div className="space-y-2 w-full"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /></div>
                        <div className="space-y-2 w-full"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /></div>
                     </div>
                     <div className="flex justify-between gap-4">
                        <div className="space-y-2 w-full"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /></div>
                        <div className="space-y-2 w-full"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /></div>
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


export default function PlayerPage({ params }: { params: { steamId: string }}) {
    const router = useRouter();
    const { steamId } = params;

    const [player, setPlayer] = React.useState<PlayerDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (steamId) {
            const fetchPlayerDetails = async () => {
                try {
                    setLoading(true);
                    setError(null);
                    const res = await fetch(`/api/player-details/${steamId}`);
                    if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(errData.error || 'Не удалось загрузить данные игрока');
                    }
                    const data: PlayerDetails = await res.json();
                    setPlayer(data);
                } catch (e: any) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            };
            fetchPlayerDetails();
        } else {
            setLoading(false);
            setError("SteamID не найден.");
        }
    }, [steamId]);
    
    if (loading) {
        return <PlayerDetailsSkeleton />;
    }

    if (error || !player) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle className="text-destructive">Ошибка</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mt-2">{error || "Игрок не найден."}</p>
                        <Button onClick={() => router.push('/')} className="mt-6 w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            На главную
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
        <div className="flex items-start gap-3 text-sm p-3 bg-card/30 rounded-md border">
            <Icon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-base">{value}</span>
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
                                <span className="font-bold">{player.level} / 100</span>
                            </div>
                            <Progress value={player.level} id="level" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <InfoItem icon={Clock} label="В игре" value={player.timeFormatted} />
                            <InfoItem icon={DollarSign} label="Деньги" value={`$${player.money.toLocaleString('ru-RU')}`} />
                            <InfoItem icon={User} label="Группа" value={<Badge variant="secondary">{player.group}</Badge>} />
                            <InfoItem icon={Briefcase} label="Профессия" value={player.profession} />
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
                           {player.donatedProfessions.length > 0 ? (
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
                            <CardTitle className="flex items-center gap-2">
                                <Terminal />
                                Активность на сервере
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="bg-black/90 rounded-lg p-4 font-mono text-sm text-green-400 space-y-2 h-64 overflow-y-auto">
                               {player.activities.map((activity, index) => (
                                   <div key={index} className="flex gap-2 items-start">
                                       <ChevronRight className="w-4 h-4 text-green-700 flex-shrink-0 mt-0.5"/>
                                       <p className="break-all">{activity}</p>
                                   </div>
                               ))}
                           </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
