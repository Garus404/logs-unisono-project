
import { NextResponse } from "next/server";
import { findUser, verifyPassword, recordLoginHistory } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!login || !password) {
        return NextResponse.json({ error: "Логин и пароль обязательны" }, { status: 400 });
    }

    // Ищем пользователя
    const user = findUser(login);
    if (!user) {
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 400 }
      );
    }

    // Проверяем пароль
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Неверный логин/email или пароль" },
        { status: 400 }
      );
    }

    // Проверяем подтверждение учетной записи
    if (!user.isVerified) {
      return NextResponse.json(
          { error: "Ваша учетная запись ожидает подтверждения администратором." },
          { status: 403 }
      );
    }

    // Обновляем lastLogin и логируем событие
    recordLoginHistory(user.id, 'login', clientIP, userAgent);

    return NextResponse.json({ 
      success: true, 
      user: { 
        login: user.login,
        email: user.email
      } 
    });

  } catch (error) {
     console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
