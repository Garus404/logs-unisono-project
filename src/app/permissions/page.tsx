

"use client";

import * as React from "react";
import AppSidebar from '@/components/layout/app-sidebar';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ContentHeader from '@/components/layout/content-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, User, Globe, Pencil, UserCheck, Trash2, Mail, KeySquare, Wifi, History, LogIn, LogOut, Edit, Eye } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type UserForDisplay = Omit<UserType, 'password'>;

const LoginHistoryDialog = ({ user }: { user: UserForDisplay }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <History className="h-4 w-4 text-blue-500" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>История входов пользователя {user.login}</DialogTitle>
                    <DialogDescription>
                        Последние 20 событий входа и выхода.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-96">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Тип</TableHead>
                                <TableHead>Время</TableHead>
                                <TableHead>IP Адрес</TableHead>
                                <TableHead>User Agent</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {user.loginHistory && user.loginHistory.length > 0 ? (
                                user.loginHistory.map((log, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Badge variant={log.type === 'login' ? 'secondary' : 'outline'} className={cn(log.type === 'login' ? 'text-green-500' : 'text-yellow-500')}>
                                                {log.type === 'login' ? <LogIn className="w-3 h-3 mr-1"/> : <LogOut className="w-3 h-3 mr-1"/>}
                                                {log.type === 'login' ? 'Вход' : 'Выход'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(log.timestamp), "dd.MM.yyyy HH:mm:ss", { locale: ru })}</TableCell>
                                        <TableCell>{log.ip}</TableCell>
                                        <TableCell className="text-xs truncate max-w-[200px]">{log.userAgent}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Нет истории логирования.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}

const EditUserDialog = ({ user, onUpdate }: { user: UserForDisplay; onUpdate: () => void }) => {
    const { toast } = useToast();
    const [login, setLogin] = React.useState(user.login);
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isOpen, setIsOpen] = React.useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        const dataToUpdate: { login?: string, password?: string } = {};

        if (login && login !== user.login) {
            dataToUpdate.login = login;
        }
        if (password) {
            dataToUpdate.password = password;
        }

        if (Object.keys(dataToUpdate).length === 0) {
            toast({
                variant: 'destructive',
                title: 'Нет изменений',
                description: 'Вы не изменили ни логин, ни пароль.',
            });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToUpdate),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Не удалось обновить данные');
            }
            toast({
                title: 'Успешно',
                description: 'Данные пользователя обновлены.',
            });
            setPassword(''); // Clear password field
            onUpdate();
            setIsOpen(false);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: error.message,
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={user.login === 'Intercom'}>
                    <Edit className="h-4 w-4 text-primary" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Редактировать пользователя</DialogTitle>
                    <DialogDescription>
                        Измените логин или пароль для <span className="font-bold">{user.login}</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="login" className="text-right">
                            Логин
                        </Label>
                        <Input
                            id="login"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                            Новый пароль
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Оставьте пустым, чтобы не менять"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                         <Button type="button" variant="secondary">
                            Отмена
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default function PermissionsPage() {
    const [users, setUsers] = React.useState<UserForDisplay[]>([]);
    const [loading, setLoading] = React.useState(true);
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = React.useState<string | null>(null);

    React.useEffect(() => {
        const user = localStorage.getItem("loggedInUser");
        setCurrentUser(user);
    }, []);

    const fetchUsers = React.useCallback(async () => {
        try {
            // Don't set loading to true on refetches
            // setLoading(true);
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
        if (currentUser !== 'Intercom') {
            // If not admin, no need to fetch users.
            // In a real app you might redirect or show an error.
            setLoading(false);
            return;
        }
        fetchUsers();
         const interval = setInterval(() => {
            fetchUsers();
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [fetchUsers, currentUser]);


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
            // No toast on success for a smoother real-time experience
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
             // No toast on success
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
            fetchUsers(); // Refresh the list immediately after deletion
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
            <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
            <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell className="hidden xl:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
            <TableCell><Skeleton className="h-5 w-20" /></TableCell>
            <TableCell><Skeleton className="h-6 w-24" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-6 w-12" /></TableCell>
            <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
    )

    const isOnline = (user: UserForDisplay) => {
        if (!user.lastLogin) return false;
        // Check if last login was within the last 5 minutes
        const lastLoginTime = new Date(user.lastLogin).getTime();
        const currentTime = new Date().getTime();
        if ((currentTime - lastLoginTime) > 5 * 60 * 1000) {
            return false;
        }
        // Check if the last log entry is not a 'logout'
        const lastLog = user.loginHistory?.[0];
        return lastLog?.type !== 'logout';
    }

    if (currentUser !== 'Intercom') {
        return (
             <SidebarProvider defaultOpen={true}>
                <Sidebar>
                    <AppSidebar />
                </Sidebar>
                <SidebarInset>
                    <div className="flex flex-1 flex-col">
                        <ContentHeader />
                        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto flex items-center justify-center">
                            <Card className="w-full max-w-md">
                                <CardHeader>
                                    <CardTitle>Доступ запрещен</CardTitle>
                                    <CardDescription>У вас нет прав для просмотра этой страницы.</CardDescription>
                                </CardHeader>
                            </Card>
                        </main>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
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
                                            <TableHead className="hidden md:table-cell"><Mail className="inline-block w-4 h-4 mr-2"/>Email</TableHead>
                                            <TableHead className="hidden lg:table-cell"><KeySquare className="inline-block w-4 h-4 mr-2"/>Пароль</TableHead>
                                            <TableHead className="hidden xl:table-cell"><Globe className="inline-block w-4 h-4 mr-2"/>IP адрес</TableHead>
                                            <TableHead><Wifi className="inline-block w-4 h-4 mr-2"/>Статус сети</TableHead>
                                            <TableHead><UserCheck className="inline-block w-4 h-4 mr-2"/>Статус</TableHead>
                                            <TableHead><ShieldCheck className="inline-block w-4 h-4 mr-2"/>Консоль</TableHead>
                                            <TableHead><Eye className="inline-block w-4 h-4 mr-2"/>Просмотр</TableHead>
                                            <TableHead><Pencil className="inline-block w-4 h-4 mr-2"/>Редакт.</TableHead>
                                            <TableHead>Действия</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            Array.from({length: 3}).map((_, i) => <UserRowSkeleton key={i} />)
                                        ) : (
                                            users.map(user => (
                                                <TableRow key={user.id} className={cn(isOnline(user) && "bg-green-500/10")}>
                                                    <TableCell className="font-medium">{user.login}</TableCell>
                                                    <TableCell className="text-muted-foreground hidden md:table-cell">{user.email}</TableCell>
                                                    <TableCell className="text-muted-foreground font-mono tracking-wider hidden lg:table-cell">••••••••</TableCell>
                                                    <TableCell className="hidden xl:table-cell">{user.ip}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                           {isOnline(user) ? 
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
                                                             <Badge variant={user.isVerified ? 'secondary' : 'destructive'} className={cn("hidden sm:inline-flex", user.isVerified ? "text-green-500" : "")}>
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
                                                                id={`view-players-${user.id}`}
                                                                checked={user.permissions?.viewPlayers || false}
                                                                onCheckedChange={(value) => handlePermissionChange(user.id, 'viewPlayers', value)}
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
                                                      <div className="flex items-center">
                                                        <EditUserDialog user={user} onUpdate={fetchUsers} />
                                                        <LoginHistoryDialog user={user} />
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

    