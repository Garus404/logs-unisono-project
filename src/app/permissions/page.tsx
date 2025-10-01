
"use client";

import * as React from "react";
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ShieldOff, User, Globe, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { User, UserPermission } from "@/lib/types";

type UserForDisplay = Omit<User, 'password'>;

export default function PermissionsPage() {
    const [users, setUsers] = React.useState<UserForDisplay[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();

    const fetchUsers = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/users");
            if (!response.ok) {
                throw new Error("Не удалось загрузить пользователей");
            }
            const data = await response.json();
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
                body: JSON.stringify({ [permission]: value }),
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
    
    const UserRowSkeleton = () => (
        <TableRow>
            <TableCell><Skeleton className="h-5 w-24" /></TableCell>
            <TableCell><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
        </TableRow>
    )

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
                                <CardTitle>Управление разрешениями</CardTitle>
                                <CardDescription>Настройте доступ пользователей к различным частям системы.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead><User className="inline-block w-4 h-4 mr-2"/>Логин</TableHead>
                                            <TableHead><Globe className="inline-block w-4 h-4 mr-2"/>IP адрес</TableHead>
                                            <TableHead><ShieldCheck className="inline-block w-4 h-4 mr-2"/>Доступ к консоли</TableHead>
                                            <TableHead><Pencil className="inline-block w-4 h-4 mr-2"/>Редакт. игроков</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({length: 3}).map((_, i) => <UserRowSkeleton key={i} />)
                                        ) : (
                                            users.map(user => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.login}</TableCell>
                                                    <TableCell>{user.ip}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                id={`console-access-${user.id}`}
                                                                checked={user.permissions?.viewConsole || false}
                                                                onCheckedChange={(value) => handlePermissionChange(user.id, 'viewConsole', value)}
                                                                disabled={user.login === 'Intercom'}
                                                            />
                                                             <label htmlFor={`console-access-${user.id}`} className="text-sm text-muted-foreground">
                                                                {user.permissions?.viewConsole ? "Включен" : "Выключен"}
                                                            </label>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Switch
                                                                id={`edit-players-${user.id}`}
                                                                checked={user.permissions?.editPlayers || false}
                                                                onCheckedChange={(value) => handlePermissionChange(user.id, 'editPlayers', value)}
                                                                disabled={user.login === 'Intercom'}
                                                            />
                                                             <label htmlFor={`edit-players-${user.id}`} className="text-sm text-muted-foreground">
                                                                {user.permissions?.editPlayers ? "Включен" : "Выключен"}
                                                            </label>
                                                        </div>
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
