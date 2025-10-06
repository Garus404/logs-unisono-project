
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
import { Shield, KeyRound } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GoogleIcon } from "@/components/icons/google-icon"; // Assuming you have a Steam icon component or we can use a generic one

const SteamIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.16c5.429 0 9.84 4.411 9.84 9.84s-4.411 9.84-9.84 9.84S2.16 17.429 2.16 12 6.571 2.16 12 2.16zM8.475 7.003l-1.33 1.486 4.382 1.69-1.83 2.946-3.23-.422.565 2.825 3.29.412 1.83-2.943 3.655 4.341 3.525-3.08-4.32-5.111-4.22-1.623-1.017-2.81zM16.94 13.06a1.91 1.91 0 01-1.285.467c-.559 0-1.07-.22-1.455-.586a1.94 1.94 0 01-.61-1.442c0-.55.23-1.054.61-1.443.385-.365.9-.585 1.455-.585s1.07.22 1.455.585a1.94 1.94 0 01.61 1.443c0 .55-.23 1.053-.61 1.442z"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);


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
                       <SteamIcon />
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
