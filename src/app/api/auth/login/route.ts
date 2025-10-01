import { NextResponse } from "next/server";
import { findUser, verifyPassword, updateLastLogin } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();

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

    // Обновляем lastLogin
    updateLastLogin(
      user.id,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    );

    // В реальном приложении здесь бы создавалась сессия/JWT токен
    return NextResponse.json({ success: true, message: "Вход выполнен успешно" });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
