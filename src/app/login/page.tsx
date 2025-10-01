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
import { Eye, EyeOff, Mail, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

async function registerUser(userData: { email: string; login: string; password: string; }) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || 'Ошибка регистрации');
  }
  return result;
}

async function loginUser(loginData: { login: string; password: string; }) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
  });
  const result = await response.json();
    if (!response.ok) {
    throw new Error(result.error || 'Ошибка входа');
  }
  return result;
}

async function verifyUserEmail(verificationData: { email: string; code: string; }) {
    const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData)
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || 'Ошибка верификации');
    }
    return result;
}


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [activeTab, setActiveTab] = React.useState("login");
  
  const [showVerification, setShowVerification] = React.useState(false);
  const [pendingEmail, setPendingEmail] = React.useState("");
  const [verificationCode, setVerificationCode] = React.useState("");
  const [verificationError, setVerificationError] = React.useState("");
  const [verificationSuccess, setVerificationSuccess] = React.useState(false);


  React.useEffect(() => {
    setError('');
    setVerificationError('');
  }, [activeTab]);

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm-password') as string;

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const result = await registerUser({ email, login, password });
      
      if (result.verificationSent) {
        setShowVerification(true);
        setPendingEmail(email);
        toast({
          title: "Письмо отправлено!",
          description: "Код подтверждения отправлен на вашу почту.",
          variant: "default"
        });
      } else {
         toast({
          title: "Аккаунт создан",
          description: result.message,
          variant: "default"
        });
        setShowVerification(true);
        setPendingEmail(email);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    try {
      const result = await loginUser({ login, password });
      
      localStorage.setItem('loggedInUser', result.user.login);

      router.push('/dashboard');
    } catch (err: any) {
      if (err.message.includes("подтвержден")) {
         setError(err.message);
         setPendingEmail(login); // Assuming login can be email
         setShowVerification(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }
  
  async function handleVerification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setVerificationError('');

    try {
        const result = await verifyUserEmail({ email: pendingEmail, code: verificationCode });
        setVerificationSuccess(true);
        toast({
            title: "Успех!",
            description: result.message,
        });
    } catch (err: any) {
        setVerificationError(err.message);
    } finally {
        setLoading(false);
    }
  }


  const handleResendVerification = async () => {
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail })
      });
       const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Код отправлен повторно!",
          description: result.message,
        });
      } else {
         throw new Error(result.error || "Не удалось отправить код");
      }
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
    if (verificationSuccess) {
         return (
              <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
                <Card className="w-full max-w-md">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl">Email подтвержден!</CardTitle>
                    <CardDescription>
                      Теперь ваша учетная запись ожидает одобрения администратором.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 text-center">
                      <Button 
                        onClick={() => {
                            setVerificationSuccess(false);
                            setShowVerification(false);
                            setActiveTab("login");
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        Вернуться на страницу входа
                      </Button>
                  </CardContent>
                </Card>
              </div>
         )
    }

  if (showVerification) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Подтвердите почту</CardTitle>
            <CardDescription>
              Мы отправили код подтверждения на <strong>{pendingEmail}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {verificationError && (
                  <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4 text-sm">
                    {verificationError}
                  </div>
                )}
            <form onSubmit={handleVerification} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="verification-code">Код подтверждения</Label>
                    <Input
                        id="verification-code"
                        name="code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="_ _ _ _ _ _"
                        required
                        disabled={loading}
                        className="text-center tracking-[0.5em] text-lg"
                    />
                </div>
                 <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "⏳ Проверка..." : "Подтвердить"}
                  </Button>
            </form>
            <div className="mt-4 space-y-2">
              <Button 
                onClick={handleResendVerification}
                variant="outline"
                className="w-full"
              >
                Отправить код повторно
              </Button>
              <Button 
                onClick={() => {
                  setShowVerification(false);
                  setActiveTab("login");
                }}
                variant="ghost"
                className="w-full"
              >
                Назад
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
      
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          
          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Вход в систему
                </CardTitle>
                <CardDescription>
                  Введите email или логин и пароль
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email или Логин
                    </Label>
                    <Input 
                      id="login-email" 
                      name="login"
                      placeholder="Ваш email или логин..." 
                      required 
                      disabled={loading}
                      autoComplete="username email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <div className="relative">
                      <Input 
                        id="login-password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        required 
                        disabled={loading}
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "⏳ Вход..." : "🔐 Войти"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registration Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Регистрация
                </CardTitle>
                <CardDescription>
                  Создайте новый аккаунт
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4 text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input 
                      id="register-email" 
                      name="email"
                      type="email"
                      placeholder="Ваш email..." 
                      required 
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-login" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Логин
                    </Label>
                    <Input 
                      id="register-login" 
                      name="login"
                      placeholder="Придумайте логин..." 
                      required 
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Пароль</Label>
                    <div className="relative">
                      <Input 
                        id="register-password" 
                        name="password"
                        type={showPassword ? "text" : "password"} 
                        required 
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Подтвердите пароль</Label>
                    <Input 
                      id="confirm-password" 
                      name="confirm-password"
                      type="password" 
                      required 
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "⏳ Регистрация..." : "Зарегистрироваться"}
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
