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

// Function to notify Telegram
const notifyTelegram = (message: string) => {
    fetch('/api/telegram/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    }).catch(error => console.error("Failed to notify telegram", error));
};


// Custom component to handle session and redirection
function SessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userLogin, setUserLogin] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    setUserLogin(storedUser);
    setLoading(false);
    
    const visitMessage = `
    👤 <b>Новое посещение сайта!</b>
    <b>User-Agent:</b> ${navigator.userAgent}
    <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
    `;
    notifyTelegram(visitMessage);


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
