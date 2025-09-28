"use server";

import dgram from 'dgram';

export interface ServerInfo {
    name: string;
    map: string;
    game: string;
    players: number;
    maxPlayers: number;
}


export async function getServerInfoAction(): Promise<ServerInfo | { error: string }> {
  return new Promise((resolve) => {
    const client = dgram.createSocket('udp4');
    const host = '46.174.53.106';
    const port = 27015;

    // A2S_INFO Source Engine query packet
    const message = Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0x54, 0x53, 0x6F, 0x75, 0x72, 0x63, 0x65, 0x20, 0x45, 0x6E, 0x67, 0x69, 0x6E, 0x65, 0x20, 0x51, 0x75, 0x65, 0x72, 0x79, 0x00]);

    let hasResponded = false;

    const timeout = setTimeout(() => {
        if (!hasResponded) {
            client.close();
            console.error("❌ Нет ответа: Таймаут");
            resolve({ error: `Не удалось подключиться к серверу: Таймаут запроса` });
        }
    }, 3000);

    client.on('message', (msg) => {
        hasResponded = true;
        clearTimeout(timeout);
        try {
            // Basic parsing of A2S_INFO response
            // This is a simplified parser and might not be fully robust
            let offset = 6; // Skip header and protocol
            
            const nameEnd = msg.indexOf(0x00, offset);
            const name = msg.toString('utf-8', offset, nameEnd);
            offset = nameEnd + 1;
            
            const mapEnd = msg.indexOf(0x00, offset);
            const map = msg.toString('utf-8', offset, mapEnd);
            offset = mapEnd + 1;
            
            const folderEnd = msg.indexOf(0x00, offset);
            offset = folderEnd + 1;
            
            const gameEnd = msg.indexOf(0x00, offset);
            const game = msg.toString('utf-8', offset, gameEnd);
            offset = gameEnd + 1;
            
            offset += 2; // Skip AppID

            const players = msg.readUInt8(offset);
            offset += 1;
            
            const maxPlayers = msg.readUInt8(offset);

            const serverInfo: ServerInfo = {
                name,
                map,
                game,
                players,
                maxPlayers
            };
            
            client.close();
            resolve(serverInfo);

        } catch (e: any) {
            client.close();
            console.error("❌ Ошибка парсинга:", e);
            resolve({ error: `Ошибка обработки ответа от сервера: ${e.message}` });
        }
    });

    client.on('error', (err) => {
        clearTimeout(timeout);
        client.close();
        console.error("❌ Ошибка сокета:", err);
        resolve({ error: `Ошибка подключения к серверу: ${err.message}` });
    });

    client.send(message, port, host, (err) => {
        if (err) {
            clearTimeout(timeout);
            client.close();
            console.error("❌ Ошибка отправки:", err);
            resolve({ error: `Не удалось отправить запрос к серверу: ${err.message}` });
        }
    });
  });
}
