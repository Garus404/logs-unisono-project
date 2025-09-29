// src/app/player/[steamId]/page.tsx
"use client";

import * as React from "react";
import { useParams, useRouter } from 'next/navigation';
import { PlayerDetails } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Star, Clock, Briefcase, Gem, ShieldQuestion, DollarSign, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PrimeLevelDisplay = ({ level }: { level: number }) => {
    const levels = [1, 2, 3, 4, 5];
    return (
        <Card>
            <CardHeader>
                <CardTitle>Прайм уровень</CardTitle>
                <CardDescription>Прайм уровень можно активировать по достижению 100 уровня.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative mb-8">
                    <div className="h-px bg-border w-full absolute top-1/2 -translate-y-1/2" />
                    <div className="flex justify-between relative">
                        {levels.map(l => (
                            <div key={l} className="flex flex-col items-center">
                                <div className={`w-4 h-4 rounded-full border-2 ${l <= level ? 'bg-primary border-primary' : 'bg-card border-border'}`} />
                                <span className="text-xs mt-2 text-muted-foreground">{l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    {levels.map(l => (
                        <div key={l} className={`p-3 rounded-lg flex items-center gap-3 border ${l === level ? 'bg-accent border-primary' : 'bg-card'}`}>
                             <div className={`w-1 h-full rounded-full ${l <= level ? 'bg-primary' : 'bg-transparent'}`} />
                            <Crown className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{l} ур.</span>
                            {l === level && <Badge className="ml-auto">Текущий</hBadge>}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const PlayerDetailsSkeleton = () => (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-40" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             <Card className="lg:col-span-1">
                <CardHeader className="items-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-7 w-48 mt-4" />
                    <Skeleton className="h-4 w-56 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-1/2" />
                    </div>
                </CardContent>
            </Card>
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                    <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
                    <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
            </div>
        </div>
    </div>
);

export default function PlayerPage() {
    const params = useParams();
    const router = useRouter();
    const steamId = params.steamId as string;

    const [player, setPlayer] = React.useState<PlayerDetails | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (steamId) {
            const fetchPlayerDetails = async () => {
                try {
                    setLoading(true);
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
        }
    }, [steamId]);
    
    if (loading) {
        return <PlayerDetailsSkeleton />;
    }

    if (error || !player) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-destructive">Ошибка</h2>
                <p className="text-muted-foreground">{error || "Игрок не найден."}</p>
                <Button onClick={() => router.back()} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад
                </Button>
            </div>
        );
    }
    
    const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) => (
        <div className="flex items-start gap-3 text-sm">
            <Icon className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
            <div className="flex flex-col">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
             <Button onClick={() => router.back()} variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к списку игроков
            </Button>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader className="items-center">
                        <Avatar className="h-24 w-24">
                            {/* In a real app, you might fetch a real avatar */}
                            <AvatarFallback>{player.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4 text-2xl">{player.name}</CardTitle>
                        <CardDescription>{player.steamId}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between items-baseline">
                                <Label htmlFor="level" className="text-sm font-medium">Уровень</Label>
                                <span className="text-sm font-bold">{player.level} / 100</span>
                            </div>
                            <Progress value={player.level} id="level" />
                        </div>
                        <InfoItem icon={Clock} label="Время в игре" value={player.timeFormatted} />
                        <InfoItem icon={DollarSign} label="Деньги" value={`$${player.money.toLocaleString('ru-RU')}`} />
                        <InfoItem icon={User} label="Группа" value={<Badge>{player.group}</Badge>} />
                        <InfoItem icon={Briefcase} label="Профессия" value={player.profession} />
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-6">
                    <PrimeLevelDisplay level={player.primeLevel} />
                    <Card>
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2">
                                <Gem />
                                Донатные профессии
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           {player.donatedProfessions.length > 0 ? (
                               <div className="flex flex-wrap gap-2">
                                   {player.donatedProfessions.map(prof => (
                                       <Badge key={prof} variant="outline" className="text-base py-1 px-3 border-accent bg-accent/20 text-accent-foreground">
                                           {prof}
                                       </Badge>
                                   ))}
                               </div>
                           ) : (
                               <div className="text-muted-foreground flex items-center gap-2">
                                   <ShieldQuestion />
                                   <span>Нет информации о донатных профессиях.</span>
                               </div>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Dummy Label component
const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={className} {...props} />
  )
);
Label.displayName = "Label";
