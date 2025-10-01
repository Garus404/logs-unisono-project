

"use client";

import * as React from "react";
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, User, Globe, Pencil, UserCheck, Trash2, Mail, KeySquare, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User as UserType, UserPermission } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useSessionManager } from "@/hooks/use-session-manager";

type UserForDisplay = Omit<UserType, 'password'>;

export default function PermissionsPage() {
    const [users, setUsers] = React.useState<UserForDisplay[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    const { currentUser } = useSessionManager();

    const fetchUsers = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/users");
            if (!response.ok) {
                throw new Error("Не удалось загрузить пользователей");
            }
            const data: UserForDisplay[] = await response.json();
            setUsers(data);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);
    
    // Periodically re-fetch to update online status
    React.useEffect(() => {
        const interval = setInterval(() => {
            fetchUsers();
        }, 60000); // every minute
        return () => clearInterval(interval);
    }, [fetchUsers]);


    const handlePermissionChange = async (userId: string, permission: keyof UserPermission, value: boolean) => {
        // Optimistic update
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === userId
                    ? { ...user, permissions: { ...user.permissions, [permission]: value } }
                    : user
            )
        );

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permissions: { [permission]: value } }),
            });

            if (!response.ok) {
                throw new Error("Не удалось обновить разрешения");
            }
            toast({
                title: "Успешно",
                description: "Разрешения пользователя обновлены.",
            });
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Ошибка",
                description: error.message,
            });
            // Revert on error
            fetchUsers();
        }
    };

    const handleVerificationChange = async (userId: string, value: boolean) => {
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === userId ? { ...user, isVerified: value } : user
            )
        );

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isVerified: value }),
            });

             if (!response.ok) {
                throw new Error("Не удалось изменить статус верификации");
            }
            toast({
                title: "Успешно",
                description: `Статус аккаунта изменен на ${value ? '"Одобрен"' : '"Ожидает"'}.`,
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Ошибка",
                description: error.message,
            });
            fetchUsers();
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Не удалось удалить пользователя");
            }
            
            toast({
                title: "Успешно",
                description: "Пользователь был удален.",
            });
            fetchUsers(); // Refresh the list
        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Ошибка",
                description: error.message,
            });
        }
    };
    
    const UserRowSkeleton = () => (
        <TableRow>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-5 w-40" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
    )

    const isOnline = (lastLogin: string) => {
        if (!lastLogin) return false;
        const lastLoginTime = new Date(lastLogin).getTime();
        const currentTime = new Date().getTime();
        // 5 minutes threshold
        return (currentTime - lastLoginTime) < 5 * 60 * 1000;
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <Sidebar>
                <AppSidebar />
            </Sidebar>
            <SidebarInset>
                <div className="flex flex-1 flex-col">
                    <ContentHeader />
                    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Управление пользователями</CardTitle>
                                <CardDescription>Настройте доступ, подтверждайте и удаляйте учетные записи.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead><User className="inline-block w-4 h-4 mr-2"/>Логин</TableHead>
                                            <TableHead><Mail className="inline-block w-4 h-4 mr-2"/>Email</TableHead>
                                            <TableHead><KeySquare className="inline-block w-4 h-4 mr-2"/>Пароль</TableHead>
                                            <TableHead><Globe className="inline-block w-4 h-4 mr-2"/>IP адрес</TableHead>
                                            <TableHead><Wifi className="inline-block w-4 h-4 mr-2"/>Статус сети</TableHead>
                                            <TableHead><UserCheck className="inline-block w-4 h-4 mr-2"/>Статус</TableHead>
                                            <TableHead><ShieldCheck className="inline-block w-4 h-4 mr-2"/>Консоль</TableHead>
                                            <TableHead><Pencil className="inline-block w-4 h-4 mr-2"/>Редакт. игроков</TableHead>
                                            <TableHead>Действия</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({length: 3}).map((_, i) => <UserRowSkeleton key={i} />)
                                        ) : (
                                            users.map(user => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.login}</TableCell>
                                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                    <TableCell className="text-muted-foreground font-mono tracking-wider">••••••••</TableCell>
                                                    <TableCell>{user.ip}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                           {isOnline(user.lastLogin) && user.login === currentUser ? 
                                                             <><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><span>В сети</span></> : 
                                                             <><div className="w-2 h-2 rounded-full bg-gray-500"></div><span className="text-muted-foreground">Не в сети</span></>
                                                           }
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                id={`verify-access-${user.id}`}
                                                                checked={user.isVerified || false}
                                                                onCheckedChange={(value) => handleVerificationChange(user.id, value)}
                                                                disabled={user.login === 'Intercom'}
                                                            />
                                                             <Badge variant={user.isVerified ? 'secondary' : 'destructive'} className={user.isVerified ? "text-green-500" : ""}>
                                                                {user.isVerified ? "Одобрен" : "Ожидает"}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Switch
                                                                id={`console-access-${user.id}`}
                                                                checked={user.permissions?.viewConsole || false}
                                                                onCheckedChange={(value) => handlePermissionChange(user.id, 'viewConsole', value)}
                                                                disabled={user.login === 'Intercom'}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center">
                                                            <Switch
                                                                id={`edit-players-${user.id}`}
                                                                checked={user.permissions?.editPlayers || false}
                                                                onCheckedChange={(value) => handlePermissionChange(user.id, 'editPlayers', value)}
                                                                disabled={user.login === 'Intercom'}
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" disabled={user.login === 'Intercom'}>
                                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Вы собираетесь навсегда удалить пользователя <span className="font-bold">{user.login}</span>. Это действие нельзя отменить.
                                                                </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                                                                    Удалить
                                                                </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
