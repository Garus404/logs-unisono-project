
"use client";

import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import React from "react";
import { useSessionManager } from "@/hooks/use-session-manager";

const metadata: Metadata = {
  title: "Unisono Logs",
  description: "Просмотр и анализ логов сервера Garrys Mod ۞ Unisono | Area-51 | SCP-RP |",
};

// Custom component to use the hook
function SessionManagerInitializer({ children }: { children: React.ReactNode }) {
  useSessionManager();
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
        <SessionManagerInitializer>
            {children}
        </SessionManagerInitializer>
        <Toaster />
      </body>
    </html>
  );
}
