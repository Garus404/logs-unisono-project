"use server";

import gamedig from 'gamedig';
import type { ServerState } from '@/lib/types';

export async function getPlayersAction(): Promise<ServerState | { error: string }> {
  try {
    const state = await gamedig.query({
      type: 'garrysmod',
      host: '46.174.53.106',
      port: 27015,
      maxAttempts: 2,
      socketTimeout: 3000,
    });

    // The library returns a large object, so we extract only what we need.
    const serverState: ServerState = {
      name: state.name,
      map: state.map,
      players: state.players.map(p => ({
        name: p.name || 'Неизвестный игрок',
        score: p.score || 0,
        // convert seconds to formatted string (e.g., 1h 23m)
        time: p.time || 0
      })),
      maxplayers: state.maxplayers,
      game: state.raw.game
    };
    
    return serverState;
  } catch (error: any) {
    console.error("❌ Нет ответа:", error);
    return { error: `Не удалось подключиться к серверу: ${error.message}` };
  }
}
