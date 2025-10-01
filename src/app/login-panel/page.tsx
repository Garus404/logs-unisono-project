
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/icons/logo";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  steamId: z.string().min(1, "Требуется SteamID"),
  password: z.string().min(1, "Требуется пароль"),
});

const registerSchema = z.object({
  steamId: z.string().min(1, "Требуется SteamID"),
  password: z.string().min(6, "Пароль должен содержать не менее 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});


export default function LoginPage() {
    const router = useRouter();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            steamId: "",
            password: "",
        },
    });

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            steamId: "",
            password: "",
            confirmPassword: "",
        },
    });

    function onLogin(values: z.infer<typeof loginSchema>) {
        console.log("Login submitted:", values);
        // TODO: Implement actual login logic
        // For now, just redirect to the dashboard on any submission
        router.push('/dashboard');
    }

    function onRegister(values: z.infer<typeof registerSchema>) {
        console.log("Register submitted:", values);
        // TODO: Implement actual registration logic
        // For now, just redirect to the dashboard on any submission
        router.push('/dashboard');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-6">
                    <Logo className="h-16 w-16" />
                </div>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Вход</TabsTrigger>
                        <TabsTrigger value="register">Регистрация</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Вход в панель</CardTitle>
                                <CardDescription>Введите свой SteamID и пароль для доступа.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...loginForm}>
                                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                        <FormField
                                            control={loginForm.control}
                                            name="steamId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SteamID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="STEAM_0:..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={loginForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Пароль</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full">Войти</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="register">
                        <Card>
                             <CardHeader>
                                <CardTitle>Регистрация</CardTitle>
                                <CardDescription>Создайте аккаунт для доступа к панели.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...registerForm}>
                                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                                        <FormField
                                            control={registerForm.control}
                                            name="steamId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SteamID</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="STEAM_0:..." {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={registerForm.control}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Пароль</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={registerForm.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Повторите пароль</FormLabel>
                                                    <FormControl>
                                                        <Input type="password" placeholder="••••••••" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="w-full">Зарегистрироваться</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
