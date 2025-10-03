import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  // Gamedig был удален, возвращаем ошибку.
  console.error("❌ Ошибка API: Gamedig был удален из-за проблем со сборкой.");
  return NextResponse.json(
    { 
      error: "Источник данных сервера (Gamedig) отключен.",
      details: "Этот компонент был удален, чтобы устранить критическую ошибку сборки.",
      timestamp: new Date().toISOString(),
      suggestion: "Функциональность будет восстановлена в будущем."
    },
    { status: 500 }
  );
}
