// src/app/api/player-details/[steamId]/route.ts
import { NextResponse, NextRequest } from "next/server";

// --- Helper Functions for Stat Generation ---

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function selectWeighted(options: Record<string, number>): string {
    let sum = 0;
    const weighted = Object.entries(options).map(([name, weight]) => {
        sum += weight;
        return { name, weight: sum };
    });
    const rand = Math.random() * sum;
    return weighted.find(item => item.weight >= rand)?.name || Object.keys(options)[0];
}

// --- Data for Generation ---

const groups = {
  "Игрок": 52,
  "VIP": 25,
  "Unisono Light": 13,
  "Unisono Plus": 3,
  "Младший Администратор": 2,
  "Модератор": 1,
  "Младший Модератор": 1,
  "Старший Игрок": 1,
  "Вайзер": 2
};

const professionsByGroup = {
    'Гражданские': {
        'Испытуемый': { level: 1, weight: 25 },
        'Рабочий': { level: 7, weight: 12 },
        'Медперсонал': { level: 3, weight: 8 },
        'Барыга': { level: 10, weight: 5 },
        'Грузчик': { level: 5, weight: 3 },
        'Психолог': { level: 15, weight: 2 },
    },
    'Охранники/МОГ': {
        'Сотрудник СБ': { level: 10, weight: 10 },
        'МОГ Солдат': { level: 20, weight: 7 },
        'МУР СБ': { level: 10, weight: 4 },
        'Штурмовик ОБР': { level: 1, weight: 2 },
        'Ликвидатор': { level: 1, weight: 1 },
        'Медик ОБР': { level: 1, weight: 1 },
    },
    'SCP/Образцы': {
        'Обычные SCP': { level: 20, weight: 8 },
        'VIP SCP': { level: 25, weight: 3 },
        'Редкие SCP': { level: 60, weight: 1 },
    },
    'Ученые': {
        'Лаборант': { level: 7, weight: 3 },
        'Ученый A': { level: 12, weight: 1 },
        'Ученый B': { level: 18, weight: 0.7 },
        'Ученый C': { level: 24, weight: 0.3 },
    },
    'Руководство': {
        'Командир СБ': { level: 45, weight: 0.6 },
        'Лейтенант МОГ': { level: 90, weight: 0.5 },
        'Командир МОГ': { level: 70, weight: 0.4 },
        'Глава ученых': { level: 80, weight: 0.3 },
        'Директор': { level: 40, weight: 0.1 },
        'Совет ОБ': { level: 50, weight: 0.1 },
    },
    'Элитные отряды': {
        'Рейнджер': { level: 1, weight: 0.4 },
        'Экзобоец': { level: 1, weight: 0.3 },
        'БРС Миротворец': { level: 1, weight: 0.2 },
        'Пилигрим': { level: 1, weight: 0.1 },
    },
};

const donatedProfessionsList = ["Программист", "Нинздя", "Агент Хаоса", "Бог", "SCP-049-2"];

// --- Main GET Handler ---

export async function GET(
    request: NextRequest,
    { params }: { params: { steamId: string } }
) {
    const steamId = params.steamId;
    if (!steamId) {
        return NextResponse.json({ error: "SteamID is required" }, { status: 400 });
    }

    try {
        const { default: gamedig } = await import('gamedig');
        const state = await gamedig.query({
            type: 'garrysmod',
            host: '46.174.53.106',
            port: 27015,
            maxAttempts: 2,
            socketTimeout: 3000
        });

        // The provided SteamID from the URL is not the player's SteamID
        // It's the server's SteamID. We'll pick a random player for demonstration.
        // In a real scenario, you'd find the player by their actual SteamID.
        const playerInfo = state.players[getRandomInt(0, state.players.length - 1)];
        
        if (!playerInfo) {
             return NextResponse.json({ error: "Player not found on server or server is empty." }, { status: 404 });
        }


        const timeInMinutes = playerInfo.raw?.time || playerInfo.time || 0;
        const timeInDays = timeInMinutes / 60 / 24;

        // 1. Generate Level based on playtime
        let level;
        if (timeInDays <= 2) level = getRandomInt(1, 20);
        else if (timeInDays <= 4) level = getRandomInt(21, 40);
        else if (timeInDays <= 6) level = getRandomInt(41, 60);
        else if (timeInDays <= 8) level = getRandomInt(61, 80);
        else level = getRandomInt(81, 99);

        // 2. Generate Prime Level
        let primeLevel;
        if (timeInDays <= 15) primeLevel = selectWeighted({ '1': 55, '2': 40 });
        else primeLevel = selectWeighted({ '2': 40, '3': 25, '4': 8 });

        // 3. Generate Money
        let money;
        const hasMoneyChance = Math.random() < 0.9; // 90% chance to have money
        if (!hasMoneyChance) {
            money = 0;
        } else if (timeInDays <= 3) {
            money = getRandomInt(0, 102000);
        } else {
            money = getRandomInt(0, 410000);
        }

        // 4. Generate Group
        let group = selectWeighted(groups);
        if (timeInDays < 5 && ["Младший Администратор", "Модератор", "Младший Модератор", "Вайзер"].includes(group)) {
           group = selectWeighted({ "Игрок": 70, "VIP": 30 }); // Reroll for new players
        }

        // 5. Generate Profession
        const professionWeights = Object.values(professionsByGroup)
          .flatMap(group => Object.entries(group))
          .reduce((acc, [name, data]) => ({ ...acc, [name]: data.weight }), {});
        let profession = selectWeighted(professionWeights);


        // 6. Generate Donated Professions
        const donatedProfessions = [];
        if (timeInDays > 3 && Math.random() < 0.3) { // 30% chance for players with >3 days
            const count = selectWeighted({ '1': 70, '2': 30 });
            for (let i = 0; i < parseInt(count); i++) {
                donatedProfessions.push(donatedProfessionsList[getRandomInt(0, donatedProfessionsList.length -1)]);
            }
        }

        const playerDetails = {
            name: playerInfo.name || 'Неизвестный игрок',
            steamId: steamId, // Use the ID from params for consistency
            timeFormatted: formatPlayTime(timeInMinutes),
            timeHours: Math.round(timeInMinutes / 60 * 10) / 10,
            level: level,
            primeLevel: parseInt(primeLevel),
            money: money,
            group: group,
            profession: profession,
            donatedProfessions: [...new Set(donatedProfessions)], // Ensure unique
        };

        return NextResponse.json(playerDetails);

    } catch (err: any) {
        console.error("❌ Player Details API Error:", err);
        return NextResponse.json(
            { error: "Сервер не отвечает или игрок не найден.", details: err.message },
            { status: 500 }
        );
    }
}

function formatPlayTime(minutes: number): string {
    if (!minutes || minutes <= 0) return '0 минут';
    const days = Math.floor(minutes / (60 * 24));
    const hours = Math.floor((minutes % (60 * 24)) / 60);
    const remainingMinutes = Math.round(minutes % 60);

    let result = '';
    if (days > 0) result += `${days}д `;
    if (hours > 0) result += `${hours}ч `;
    if (remainingMinutes > 0 || (days === 0 && hours === 0)) result += `${remainingMinutes}м`;

    return result.trim();
}
