
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GoogleIcon } from "@/components/icons/google-icon";

export default function LoginPage() {
    const router = useRouter();

    function onGoogleSignIn() {
        console.log("Signing in with Google...");
        // TODO: Implement actual Firebase Google Auth logic
        // For now, just redirect to the dashboard on any submission
        router.push('/dashboard');
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4 font-sans">
            <div className="w-full max-w-sm mx-auto">
                <div className="flex flex-col items-center justify-center p-8 border rounded-lg shadow-sm bg-card text-card-foreground">
                    
                    <GoogleIcon className="w-8 h-8 mb-4" />

                    <h1 className="text-2xl font-semibold text-center text-foreground">Вход</h1>
                    <p className="mt-2 text-sm text-center text-muted-foreground">Используйте аккаунт Unisono</p>

                    <div className="w-full mt-8 space-y-4">
                        <Button 
                            onClick={onGoogleSignIn} 
                            variant="outline" 
                            className="w-full h-12 text-base"
                        >
                            <GoogleIcon className="mr-3" />
                            Войти через Google
                        </Button>
                    </div>

                    <div className="mt-8 text-center">
                        <a href="#" className="text-sm font-medium text-blue-500 hover:underline">
                            Создать аккаунт
                        </a>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-8 text-xs text-muted-foreground">
                    <div className="relative">
                        <select className="bg-transparent appearance-none pr-6 focus:outline-none">
                            <option>Русский</option>
                        </select>
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                            <path d="M12 16L6 10H18L12 16Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="hover:underline">Справка</a>
                        <a href="#" className="hover:underline">Конфиденциальность</a>
                        <a href="#" className="hover:underline">Условия</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

