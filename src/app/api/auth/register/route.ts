import { NextResponse } from "next/server";
import { isEmailOrLoginTaken, createUser, hashPassword } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, login, password } = await request.json();

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
    await createUser({
      email,
      login,
      password: hashedPassword,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    return NextResponse.json({ success: true, message: "Регистрация прошла успешно" });

  } catch (error) {
    console.error("Register API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
