import { NextResponse } from 'next/server';
import type { Player, ServerState } from '@/lib/types';
import GameDig from 'gamedig';

export const dynamic = 'force-dynamic'; // force dynamic (server) route

export async function GET() {
  try {
    const state = await GameDig.query({
      type: 'garrysmod',
      host: '46.174.53.106',
      port: 27015,
      maxAttempts: 2,
      socketTimeout: 3000,
    });
    
    // The library returns a mix of types, so we cast it to any and then shape it.
    const anyState: any = state;

    const serverState: ServerState = {
        name: anyState.name,
        map: anyState.map,
        players: anyState.players.map((p: any): Player => ({
            name: p.name || 'Неизвестный игрок',
            score: p.score ?? 0,
            time: p.time ?? 0,
        })),
        maxplayers: anyState.maxplayers,
        game: anyState.raw?.game || 'Garrys Mod',
    };

    return NextResponse.json(serverState);
  } catch (error: any) {
    console.error("❌ Gamedig query failed:", error);
    let errorMessage = "Не удалось получить информацию о сервере.";
    if (error.message.includes('UDP timeout')) {
        errorMessage = "Сервер не отвечает (таймаут).";
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
