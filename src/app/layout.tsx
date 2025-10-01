
"use client";

import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import React from "react";
import { useRouter } from "next/navigation";

const metadata: Metadata = {
  title: "Unisono Logs",
  description: "Просмотр и анализ логов сервера Garrys Mod ۞ Unisono | Area-51 | SCP-RP |",
};

// Custom component to handle session and redirection
function SessionManager({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    setUser(storedUser);
    setLoading(false);

     const handleStorageChange = () => {
        const updatedUser = localStorage.getItem("loggedInUser");
        setUser(updatedUser);
        if (!updatedUser) {
            router.push('/login');
        }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Auto-logout on tab close
    const handleTabClose = () => {
      const currentUser = localStorage.getItem("loggedInUser");
      if (currentUser) {
        // Use sendBeacon for reliable background request on unload
         const data = JSON.stringify({ login: currentUser });
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
    if (!loading && !user && window.location.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router]);


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
