
import { NextResponse } from "next/server";
import { findUser, recordLoginHistory } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { login } = await request.json();
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    if (!login) {
        return NextResponse.json({ error: "Логин обязателен" }, { status: 400 });
    }

    const user = findUser(login);
    if (user) {
      recordLoginHistory(user.id, 'logout', clientIP, userAgent);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
     console.error("Logout API Error:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
