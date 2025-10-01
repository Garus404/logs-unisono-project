
import { NextResponse } from "next/server";
import { findUser, recordLoginHistory } from "@/lib/db";

async function getBody(request: Request) {
    try {
        // For sendBeacon, the content type is often text/plain or not set,
        // and the body is sent as a string.
        if (request.headers.get('content-type')?.includes('text/plain') || !request.headers.get('content-type')) {
             const text = await request.text();
             if (text) {
                return JSON.parse(text);
             }
             return null;
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
        // Don't return an error for beacon calls, just exit gracefully.
        return NextResponse.json({ success: true });
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
