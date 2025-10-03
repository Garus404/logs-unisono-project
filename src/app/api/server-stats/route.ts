// src/app/api/server-stats/route.ts
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
    const hashPart1 = simpleHash(name + 'salt1') % 2;
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

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateRandomPing(): number {
  return Math.floor(Math.random() * 88) + 27;
}

function generateRealisticKills(score: number, playerIndex: number): number {
  const baseKills = Math.max(0, Math.floor(score * (0.6 + Math.random() * 0.2)));
  const positionBonus = Math.floor((100 - playerIndex) * 0.1);
  const randomVariation = Math.floor(Math.random() * 10) - 5;
  
  return Math.max(0, baseKills + positionBonus + randomVariation);
}

export async function GET() {
  // Просто возвращаем fallback данные без Steam API
  return getFallbackData();
}

// Fallback данные когда сервер недоступен
function getFallbackData() {
  const players = [
    { name: "BRykot", score: 150, kills: 45, time: 3600, timeFormatted: "1ч 0м", ping: 67, timeHours: 1.0, steamId: "STEAM_0:1:123456" },
    { name: "Стекло", score: 80, kills: 25, time: 1800, timeFormatted: "30м", ping: 89, timeHours: 0.5, steamId: "STEAM_0:0:654321" },
    { name: "Danislav", score: 200, kills: 60, time: 5400, timeFormatted: "1ч 30м", ping: 45, timeHours: 1.5, steamId: "STEAM_0:1:789012" },
    { name: "Shadow", score: 120, kills: 35, time: 7200, timeFormatted: "2ч 0м", ping: 72, timeHours: 2.0, steamId: "STEAM_0:0:456789" },
    { name: "Razor", score: 180, kills: 55, time: 4500, timeFormatted: "1ч 15м", ping: 63, timeHours: 1.3, steamId: "STEAM_0:1:987654" },
    { name: "Phoenix", score: 90, kills: 28, time: 2700, timeFormatted: "45м", ping: 81, timeHours: 0.8, steamId: "STEAM_0:0:123789" },
    { name: "Vortex", score: 160, kills: 48, time: 6300, timeFormatted: "1ч 45м", ping: 58, timeHours: 1.8, steamId: "STEAM_0:1:654987" },
    { name: "Blade", score: 110, kills: 32, time: 3600, timeFormatted: "1ч 0м", ping: 76, timeHours: 1.0, steamId: "STEAM_0:0:321654" },
    { name: "Crimson", score: 190, kills: 58, time: 5400, timeFormatted: "1ч 30м", ping: 52, timeHours: 1.5, steamId: "STEAM_0:1:789123" },
    { name: "Ghost", score: 70, kills: 22, time: 1800, timeFormatted: "30м", ping: 84, timeHours: 0.5, steamId: "STEAM_0:0:456123" },
    { name: "Frost", score: 130, kills: 38, time: 4500, timeFormatted: "1ч 15м", ping: 69, timeHours: 1.3, steamId: "STEAM_0:1:987321" },
    { name: "Storm", score: 170, kills: 52, time: 7200, timeFormatted: "2ч 0м", ping: 61, timeHours: 2.0, steamId: "STEAM_0:0:654321" }
  ];

  const shuffledPlayers = shuffleArray([...players]);
  const totalPlayTimeSeconds = players.reduce((sum, player) => sum + player.time, 0);
  const totalKills = players.reduce((sum, player) => sum + player.kills, 0);
  const averagePing = Math.floor(players.reduce((sum, player) => sum + player.ping, 0) / players.length);

  return NextResponse.json({
    server: {
      name: "۞ Unisono | Area-51 | SCP-RP | Добро пожаловать",
      map: "rp_unisono_area51_summer_2025",
      game: "Garry's Mod",
      maxplayers: 110,
      online: 12,
      serverPing: 55
    },
    connection: {
      ip: "46.174.53.106",
      port: 27015,
      protocol: 17,
      secure: true
    },
    players: shuffledPlayers,
    statistics: {
      totalPlayers: 12,
      totalPlayTime: formatSessionPlayTime(totalPlayTimeSeconds),
      totalKills: totalKills,
      averagePing: averagePing,
      topPlayer: players.length > 0 ? [...players].sort((a, b) => b.time - a.time)[0] : null
    },
    details: {
      version: "2025.03.26",
      environment: "Linux",
      tags: ["gm:darkrp", "gmws:248302805", "gmc:rp", "loc:ru", "ver:250723"],
      steamId: "85568392923430335"
    },
    timestamp: new Date().toISOString(),
    cache: {
      maxAge: 30,
      revalidate: true
    }
  });
}