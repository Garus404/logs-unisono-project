
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/icons/logo";

export default function LoginPage() {
  const router = useRouter();

  // This function will be called on form submission.
  // For now, it just redirects to the dashboard.
  function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log("Form submitted, redirecting...");
    router.push('/dashboard');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
        
        <Logo className="w-16 h-16" />

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Вход в панель</CardTitle>
                <CardDescription>
                  Введите свой SteamID и пароль для доступа.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="steamid-login">SteamID</Label>
                    <Input id="steamid-login" placeholder="STEAM_0:..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Пароль</Label>
                    <Input id="password-login" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Войти
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Создать аккаунт</CardTitle>
                <CardDescription>
                  Заполните данные для создания нового аккаунта.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="steamid-register">SteamID</Label>
                    <Input id="steamid-register" placeholder="STEAM_0:..." required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Пароль</Label>
                    <Input id="password-register" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-confirm">Подтвердите пароль</Label>
                    <Input id="password-confirm" type="password" required />
                  </div>
                  <Button type="submit" className="w-full">
                    Зарегистрироваться
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
