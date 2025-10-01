
import { NextResponse } from "next/server";
import { findUser, verifyPassword, updateLastLogin } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

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

    // Проверяем, одобрен ли аккаунт администратором
    if (!user.isVerified) {
        return NextResponse.json(
            { error: "Учетная запись ожидает подтверждения администратором." },
            { status: 403 } // Forbidden
        );
    }

    // Обновляем lastLogin
    updateLastLogin(
      user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    );

    return NextResponse.json({ success: true, user: { login: user.login } });

  } catch (error) {
     console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
