import { NextResponse } from "next/server";
import { createUser, isEmailOrLoginTaken } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email, ip } = body;

    // Проверяем нет ли такого пользователя
    if (isEmailOrLoginTaken(email, username)) {
      return NextResponse.json(
        { error: "Пользователь с таким логином или email уже существует" },
        { status: 400 }
      );
    }

    // Создаем пользователя
    const user = await createUser({
      email: email || `${username}@steam.com`,
      login: username,
      password: password,
      ip: ip,
      userAgent: "Steam Login"
    });

    // Возвращаем успех (без пароля)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword,
        message: "Пользователь добавлен в очередь подтверждения" 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Steam register error:", error);
    return NextResponse.json(
      { error: "Ошибка при регистрации через Steam" },
      { status: 500 }
    );
  }
}