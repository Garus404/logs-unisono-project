import { NextResponse } from 'next/server';
import type { Player, ServerState } from '@/lib/types';
import dgram from 'dgram';

export const dynamic = 'force-dynamic';

function parseA2SInfo(buffer: Buffer): Partial<ServerState> {
  let offset = 5; 
  
  const nameEnd = buffer.indexOf(0, offset);
  const name = buffer.toString('utf-8', offset, nameEnd);
  offset = nameEnd + 1;

  const mapEnd = buffer.indexOf(0, offset);
  const map = buffer.toString('utf-8', offset, mapEnd);
  offset = mapEnd + 1;

  const folderEnd = buffer.indexOf(0, offset);
  offset = folderEnd + 1;

  const gameEnd = buffer.indexOf(0, offset);
  const game = buffer.toString('utf-8', offset, gameEnd);
  offset = gameEnd + 1;
  
  offset += 2; 

  const players = buffer.readUInt8(offset);
  offset += 1;
  
  const maxplayers = buffer.readUInt8(offset);

  return { name, map, players: Array.from({length: players}, () => ({name: 'Загрузка...', score: 0, time: 0})), maxplayers, game };
}


export async function GET() {
  return new Promise((resolve) => {
    const host = '46.174.53.106';
    const port = 27015;
    const client = dgram.createSocket('udp4');

    const request = Buffer.from([
      0xFF, 0xFF, 0xFF, 0xFF, 
      0x54, 
      ...Buffer.from('Source Engine Query\0', 'ascii')
    ]);

    const onError = (err: Error) => {
      console.error("❌ UDP query failed:", err);
      client.close();
      resolve(NextResponse.json({ error: "Не удалось получить информацию о сервере (ошибка сокета)." }, { status: 500 }));
    };

    client.on('error', onError);

    client.on('message', (msg) => {
        try {
          const serverInfo = parseA2SInfo(msg);
          // Поскольку A2S_INFO не возвращает список игроков, мы создаем заглушки.
          // Для получения полного списка нужен более сложный A2S_PLAYER запрос.
          // Но для текущей задачи и избежания проблем с gamedig, это компромисс.
          const serverState: ServerState = {
              name: serverInfo.name || 'Неизвестный сервер',
              map: serverInfo.map || 'Неизвестная карта',
              players: serverInfo.players || [],
              maxplayers: serverInfo.maxplayers || 0,
              game: serverInfo.game || 'Garrys Mod',
          };
          client.close();
          resolve(NextResponse.json(serverState));
        } catch (e: any) {
          console.error("❌ Failed to parse server response:", e);
          client.close();
          resolve(NextResponse.json({ error: "Ошибка обработки ответа от сервера." }, { status: 500 }));
        }
    });

    client.send(request, 0, request.length, port, host);

    const timeout = setTimeout(() => {
        client.removeListener('message', () => {});
        client.close();
        resolve(NextResponse.json({ error: "Сервер не отвечает (таймаут)." }, { status: 500 }));
    }, 3000);

    client.on('close', () => {
        clearTimeout(timeout);
    });
  });
}
