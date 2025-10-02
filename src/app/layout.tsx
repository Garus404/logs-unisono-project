"use client";

import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

const metadata: Metadata = {
  title: "Unisono Logs",
  description: "Просмотр и анализ логов сервера Garrys Mod ۞ Unisono | Area-51 | SCP-RP |",
};

// 📤 Функция отправки уведомления о посещении
async function sendVisitNotification(ip: string, userAgent: string, referer?: string) {
  try {
    const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || process.env.TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('⚠️ Переменные окружения для Telegram не установлены.');
      return;
    }

    const message = `
🌐 НОВЫЙ ПОСЕТИТЕЛЬ НА САЙТЕ

📊 **Информация о посещении:**
📍 IP: ${ip}
🕒 Время: ${new Date().toLocaleString('ru-RU')}
📱 User Agent: ${userAgent}
🖥️ Платформа: ${userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'Mac' : userAgent.includes('Linux') ? 'Linux' : 'Unknown'}
🔍 Браузер: ${userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : userAgent.includes('Edge') ? 'Edge' : userAgent.includes('Opera') ? 'Opera' : 'Unknown'}
${referer ? `🔗 Referer: ${referer}` : ''}

🚩 **Статус:** АНОНИМНЫЙ ПОСЕТИТЕЛЬ
    `;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });

    console.log('✅ Уведомление о посещении отправлено в Telegram');

  } catch (error) {
    console.log('⚠️ Ошибка отправки уведомления в Telegram:', error);
  }
}

// Custom component to handle session and redirection
function SessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userLogin, setUserLogin] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // 🔥 ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ О ПОСЕЩЕНИИ ПРИ ЗАГРУЗКЕ САЙТА
    const sendVisitNotificationToServer = async () => {
      try {
        await fetch('/api/telegram/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log('Не удалось отправить уведомление о посещении');
      }
    };

    sendVisitNotificationToServer();

    const storedUser = localStorage.getItem("loggedInUser");
    setUserLogin(storedUser);
    setLoading(false);

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("loggedInUser");
      setUserLogin(updatedUser);
      if (!updatedUser && window.location.pathname !== '/login') {
        router.push('/login');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Auto-logout on tab close
    const handleTabClose = () => {
      const currentUser = localStorage.getItem("loggedInUser");
      if (currentUser) {
         const data = JSON.stringify({ login: currentUser });
         // Use sendBeacon for reliable background sending
         navigator.sendBeacon('/api/auth/logout', data);
      }
    };
    window.addEventListener('unload', handleTabClose);
    
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('unload', handleTabClose);
    };

  }, [router]);
  
  React.useEffect(() => {
    if (!loading && !userLogin && window.location.pathname !== '/login') {
      router.push('/login');
    }
  }, [userLogin, loading, router]);
  
  // Real-time verification check
  React.useEffect(() => {
    if (!userLogin) return;

    const interval = setInterval(async () => {
        try {
            const response = await fetch('/api/users');
            if (!response.ok) return; // Don't logout on network error
            
            const users: User[] = await response.json();
            const currentUser = users.find(u => u.login === userLogin);

            if (currentUser && !currentUser.isVerified) {
                // Admin has revoked access
                localStorage.removeItem("loggedInUser");
                window.dispatchEvent(new Event("storage")); // Trigger logout on all tabs
            }
        } catch (error) {
            console.error("Failed to check user status:", error);
        }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [userLogin]);


  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }
  
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark">
      <head>
        <title>{String(metadata.title)}</title>
        <meta name="description" content={String(metadata.description)} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-background text-foreground antialiased">
        <SessionManager>
            {children}
        </SessionManager>
        <Toaster />
      </body>
    </html>
  );
}