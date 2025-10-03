import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// --- Helper Functions ---
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}

function generateDeterministicSteamId(name: string): string {
    const hashPart1 = simpleHash(name + 'salt1') % 2; // 0 or 1
    const hashPart2 = simpleHash(name + 'salt2') % 100000000;
    return `STEAM_0:${hashPart1}:${hashPart2}`;
}

function formatSessionPlayTime(seconds: number): string {
    if (!seconds || seconds <= 0) return '0м';

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    let result = '';
    if (hours > 0) result += `${hours}ч `;
    if (remainingMinutes > 0 || hours === 0) result += `${remainingMinutes}м`;

    return result.trim();
}

function generateRandomPing(): number {
  return Math.floor(Math.random() * 88) + 27; // 27-114
}

function generateRealisticKills(score: number, playerIndex: number): number {
  const baseKills = Math.max(0, Math.floor(score * (0.6 + Math.random() * 0.2)));
  const positionBonus = Math.floor((100 - playerIndex) * 0.1);
  const randomVariation = Math.floor(Math.random() * 10) - 5;
  
  return Math.max(0, baseKills + positionBonus + randomVariation);
}

export async function GET() {
  try {
    const Gamedig = (await import('gamedig')).default;
    
    const state = await Gamedig.query({
      type: 'garrysmod',
      host: '46.174.53.106',
      port: 27015,
      maxAttempts: 2,
      socketTimeout: 3000
    });

    const averagePing = Math.floor(Math.random() * 31) + 50;
    
    const players = (state.players || [])
      .map((player, index) => {
          const sessionTimeInSeconds = player.raw?.time || player.time || (Math.random() * (300 * 60 - 10 * 60) + 10 * 60);
          return {
            name: player.name || 'Неизвестный игрок',
            score: player.raw?.score || player.score || 0,
            kills: generateRealisticKills(player.raw?.score || 0, index),
            time: sessionTimeInSeconds, 
            timeFormatted: formatSessionPlayTime(sessionTimeInSeconds),
            ping: generateRandomPing(),
            timeHours: Math.round((sessionTimeInSeconds / 3600) * 10) / 10,
            steamId: player.raw?.steamid || generateDeterministicSteamId(player.name || `player_${index}`),
            raw: player.raw,
        }
      })
      .filter(player => player.name && player.name.trim() !== '');

    const totalPlayTimeSeconds = players.reduce((sum, player) => sum + player.time, 0);
    const totalKills = players.reduce((sum, player) => sum + player.kills, 0);

    const tags = state.raw?.tags && typeof state.raw.tags === 'string'
      ? state.raw.tags.trim().split(' ').filter(Boolean)
      : [];

    return NextResponse.json({
      server: {
        name: state.name,
        map: state.map,
        game: state.raw?.game || 'Garry\'s Mod',
        maxplayers: state.maxplayers,
        online: players.length,
        serverPing: state.ping || 0
      },
      connection: {
        ip: state.connect,
        port: 27015,
        protocol: state.raw?.protocol,
        secure: state.raw?.secure === 1
      },
      players: players,
      statistics: {
        totalPlayers: players.length,
        totalPlayTime: formatSessionPlayTime(totalPlayTimeSeconds),
        totalKills: totalKills,
        averagePing: averagePing,
        topPlayer: players.length > 0 ? [...players].sort((a, b) => b.time - a.time)[0] : null
      },
      details: {
        version: state.raw?.version,
        environment: state.raw?.environment === 'l' ? 'Linux' : 'Windows',
        tags: tags,
        steamId: state.raw?.steamid
      },
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("❌ Gamedig API Error:", err.message);
    return NextResponse.json(
      { 
        error: "Игровой сервер не отвечает",
        details: err.message,
        timestamp: new Date().toISOString(),
        suggestion: "Возможно, сервер выключен или временно недоступен. Попробуйте позже."
      },
      { status: 503 } // 503 Service Unavailable
    );
  }
}