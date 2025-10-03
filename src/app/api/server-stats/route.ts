// src/app/api/server-stats/route.ts
import { NextResponse } from "next/server";
import { GameDig } from "gamedig";

export const dynamic = "force-dynamic";

// ... (все твои helper функции остаются без изменений) ...

export async function GET() {
  try {
    // Получаем реальные данные с сервера
    const state = await GameDig.query({
      type: 'garrysmod',
      host: '46.174.53.106',
      port: 27015,
      timeout: 10000 // увеличил таймаут
    });

    // Создаем данные игроков на основе реальных
    const players = state.players.map((player, index) => {
      const sessionTimeInSeconds = Math.random() * (300 * 60 - 10 * 60) + 10 * 60;
      const score = Math.floor(Math.random() * 200);
      
      return {
        name: player.name || `Player${index + 1}`,
        score: score,
        kills: generateRealisticKills(score, index),
        time: sessionTimeInSeconds,
        timeFormatted: formatSessionPlayTime(sessionTimeInSeconds),
        ping: player.ping || generateRandomPing(),
        timeHours: Math.round((sessionTimeInSeconds / 3600) * 10) / 10,
        steamId: generateDeterministicSteamId(player.name || `Player${index + 1}`),
      };
    });

    const shuffledPlayers = shuffleArray([...players]);
    const totalPlayTimeSeconds = players.reduce((sum, player) => sum + player.time, 0);
    const totalKills = players.reduce((sum, player) => sum + player.kills, 0);
    const averagePing = Math.floor(players.reduce((sum, player) => sum + player.ping, 0) / players.length);

    return NextResponse.json({
      server: {
        name: state.name,
        map: state.map,
        game: 'Garry\'s Mod',
        maxplayers: state.maxplayers,
        online: state.players.length,
        serverPing: 55
      },
      connection: {
        ip: '46.174.53.106',
        port: 27015,
        protocol: 17,
        secure: true
      },
      players: shuffledPlayers,
      statistics: {
        totalPlayers: state.players.length,
        totalPlayTime: formatSessionPlayTime(totalPlayTimeSeconds),
        totalKills: totalKills,
        averagePing: averagePing,
        topPlayer: players.length > 0 ? [...players].sort((a, b) => b.time - a.time)[0] : null
      },
      details: {
        version: '2025.03.26',
        environment: 'Linux',
        tags: ['gm:darkrp', 'gmws:248302805', 'gmc:rp', 'loc:ru', 'ver:250723'],
        steamId: '85568392923430335'
      },
      timestamp: new Date().toISOString(),
      cache: {
        maxAge: 30,
        revalidate: true
      }
    });

  } catch (error) {
    console.error("❌ Ошибка gamedig:", error);
    // Только в случае ошибки используем fallback
    return getFallbackData();
  }
}

// ... (getFallbackData функция остается на случай ошибок) ...