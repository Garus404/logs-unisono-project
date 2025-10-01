
import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, login, password } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!email || !login || !password) {
        return NextResponse.json({ error: "Email, логин и пароль обязательны" }, { status: 400 });
    }

    // Проверка на существование
    if (isEmailOrLoginTaken(email, login)) {
      return NextResponse.json(
        { error: "Email или логин уже заняты" },
        { status: 400 }
      );
    }

    // Хэшируем пароль
    const hashedPassword = await hashPassword(password);

    // Создаем пользователя
    const user = await createUser({
      email,
      login,
      password: hashedPassword,
      ip: clientIP,
      userAgent: userAgent
    });

    return NextResponse.json({ 
      success: true, 
      message: "Регистрация прошла успешно. Ожидайте подтверждения администратором.",
    });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
