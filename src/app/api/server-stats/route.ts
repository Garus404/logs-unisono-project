// src/app/api/server-stats/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { default: gamedig } = await import('gamedig');
    
    const state = await gamedig.query({
      type: 'garrysmod',
      host: '46.174.53.106',
      port: 27015,
      maxAttempts: 2,
      socketTimeout: 3000
    });

    console.log("✅ Сервер ответил через API:");
    console.log("Игроков онлайн:", state.players.length);

    // Сортируем игроков по времени в игре (по убыванию)
    const sortedPlayers = state.players
      .map(player => ({
        name: player.name || 'Неизвестный игрок',
        score: player.raw?.score || player.score || 0,
        time: player.raw?.time || player.time || 0,
        timeFormatted: formatPlayTime(player.raw?.time || player.time || 0),
        ping: player.ping || 0,
        timeHours: Math.round((player.raw?.time || 0) / 60 * 10) / 10 // время в часах с округлением
      }))
      .filter(player => player.name && player.name.trim() !== '')
      .sort((a, b) => b.time - a.time); // сортировка по убыванию времени

    // Статистика сервера
    const totalPlayTime = sortedPlayers.reduce((sum, player) => sum + player.time, 0);
    const averagePing = sortedPlayers.length > 0 
      ? Math.round(sortedPlayers.reduce((sum, player) => sum + player.ping, 0) / sortedPlayers.length)
      : 0;

    // Преобразуем строку тегов в массив
    const tags = state.raw?.tags && typeof state.raw.tags === 'string'
      ? state.raw.tags.trim().split(' ').filter(Boolean)
      : [];

    return NextResponse.json({
      // Основная информация о сервере
      server: {
        name: state.name,
        map: state.map,
        game: state.raw?.game || 'Garry\'s Mod',
        maxplayers: state.maxplayers,
        online: sortedPlayers.length,
        serverPing: state.ping || 0
      },
      
      // Информация о подключении
      connection: {
        ip: state.connect,
        port: 27015,
        protocol: state.raw?.protocol,
        secure: state.raw?.secure === 1
      },
      
      // Игроки
      players: sortedPlayers,
      
      // Статистика
      statistics: {
        totalPlayers: sortedPlayers.length,
        totalPlayTime: formatPlayTime(totalPlayTime),
        averagePing: averagePing,
        topPlayer: sortedPlayers.length > 0 ? sortedPlayers[0] : null
      },
      
      // Детальная информация
      details: {
        version: state.raw?.version,
        environment: state.raw?.environment === 'l' ? 'Linux' : 'Windows',
        tags: tags,
        steamId: state.raw?.steamid
      },
      
      timestamp: new Date().toISOString(),
      cache: {
        maxAge: 30, // секунды
        revalidate: true
      }
    });

  } catch (err: any) {
    console.error("❌ Ошибка API:", err);
    return NextResponse.json(
      { 
        error: "Сервер не отвечает",
        details: err.message,
        timestamp: new Date().toISOString(),
        suggestion: "Попробуйте обновить страницу через 30 секунд"
      },
      { status: 500 }
    );
  }
}

// Функция для форматирования времени игры
function formatPlayTime(minutes: number): string {
  if (!minutes || minutes <= 0) return '0 минут';
  
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  const remainingMinutes = Math.round(minutes % 60);

  if (days > 0) {
    return `${days}д ${remainingHours}ч ${remainingMinutes}м`;
  } else if (hours > 0) {
    return `${hours}ч ${remainingMinutes}м`;
  } else {
    return `${remainingMinutes}м`;
  }
}
