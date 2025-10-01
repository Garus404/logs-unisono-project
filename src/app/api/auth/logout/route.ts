
import { NextResponse } from "next/server";
import { findUser, recordLoginHistory } from "@/lib/db";

async function getBody(request: Request) {
    try {
        // For sendBeacon, the content type is often text/plain
        if (request.headers.get('content-type')?.includes('text/plain')) {
             const text = await request.text();
             return JSON.parse(text);
        }
        return await request.json();
    } catch (error) {
        // If JSON parsing fails (e.g., empty body), return null
        return null;
    }
}


export async function POST(request: Request) {
  try {
    const body = await getBody(request);
    const login = body?.login;
    
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
