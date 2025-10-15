
"use server";

import { NextResponse } from "next/server";
import { findUser, verifyPassword, recordLoginHistory } from "@/lib/db";
import type { User } from "@/lib/types";

// Function to notify Telegram
const notifyTelegram = (message: string) => {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/telegram/notify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
    }).catch(error => console.error("Failed to notify telegram from login", error));
};


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { login, password } = body;

    const user = findUser(login);

    if (!user) {
      return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }
    
    // In our simplified setup, password is not hashed. Direct comparison.
    if (user.password !== password) {
       return NextResponse.json(
        { error: "Неверный логин или пароль" },
        { status: 401 }
      );
    }
    
    if (!user.isVerified) {
       const verificationMessage = `
        🕒 <b>Ожидание верификации</b>
        <b>Пользователь:</b> <code>${user.login}</code>
        <b>Email:</b> <code>${user.email}</code>
        <b>IP:</b> <code>${request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'}</code>
        <b>User-Agent:</b> ${request.headers.get('user-agent') || 'unknown'}
        <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
        `;
        notifyTelegram(verificationMessage);

      return NextResponse.json(
        { error: "Ваш аккаунт ожидает подтверждения администратором." },
        { status: 403 }
      );
    }
    
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    recordLoginHistory(user.id, 'login', clientIP, userAgent);

     const loginMessage = `
        ✅ <b>Успешный вход</b>
        <b>Пользователь:</b> <code>${user.login}</code>
        <b>IP:</b> <code>${clientIP}</code>
        <b>Время:</b> ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}
        `;
    notifyTelegram(loginMessage);

    const { password: _, ...userToReturn } = user;

    return NextResponse.json({ user: userToReturn });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
