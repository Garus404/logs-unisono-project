import { NextResponse } from 'next/server';
import { GameDig } from 'gamedig';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const state = await GameDig.query({
      type: 'garrysmod',
      host: '46.174.53.106',
      port: 27015,
      maxAttempts: 2,
      socketTimeout: 3000,
    });
    return NextResponse.json(state);
  } catch (error) {
    console.error("Gamedig query failed:", error);
    // Ensure the error is serializable
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Не удалось получить информацию о сервере.", details: errorMessage },
      { status: 500 }
    );
  }
}
