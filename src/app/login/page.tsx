
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/icons/logo";
import { Shield, KeyRound, Gamepad2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка входа");
      }
      
      localStorage.setItem("loggedInUser", data.user.login);
      window.dispatchEvent(new Event("storage")); 
      
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${data.user.login}!`,
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSteamLogin = () => {
    router.push('https://adoptpets.shop');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
      
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        <div className="flex items-center gap-2">
          <Logo className="w-16 h-16" />
        </div>

        <Card className="w-full">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <Shield className="w-4 h-4 mr-2" />
                Вход
              </TabsTrigger>
              <TabsTrigger value="register">
                <KeyRound className="w-4 h-4 mr-2" />
                Регистрация
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Вход в систему</CardTitle>
                <CardDescription>
                    Для доступа к панели требуется аутентификация.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="login">Логин</Label>
                    <Input 
                        id="login" 
                        type="text" 
                        placeholder="Login Steam" 
                        required 
                        value={login}
                        onChange={e => setLogin(e.target.value)}
                    />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        required 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Вход..." : "Войти"}
                    </Button>
                </form>
              </CardContent>
            </TabsContent>
            <TabsContent value="register">
                <CardHeader>
                    <CardTitle>Регистрация</CardTitle>
                    <CardDescription>
                        Для регистрации необходимо войти через Steam.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <Button onClick={handleSteamLogin} className="w-full" variant="outline">
                       <Gamepad2 className="w-5 h-5 mr-2" />
                       Войти через Steam
                   </Button>
                </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
