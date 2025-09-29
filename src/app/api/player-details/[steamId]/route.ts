// src/app/api/player-details/[steamId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { Player, ServerStateResponse } from "@/lib/types";

// --- Helper Functions ---

// Simple hash function to get a number from a string for deterministic "randomness"
function simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function getDeterministicRandom(seed: string, min: number, max: number): number {
    const hash = simpleHash(seed);
    return (hash % (max - min + 1)) + min;
}

function selectWeighted(options: Record<string, number>, seed: string): string {
    let sum = 0;
    const weighted = Object.entries(options).map(([name, weight]) => {
        sum += weight;
        return { name, weight: sum };
    });
    const hash = simpleHash(seed);
    const rand = (hash % 1000) / 1000 * sum;
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

const donatedProfessionsList = [
    "[VIP] Сотрудник Службы Безопасности",
    "БЕК-1 Робопатруль",
    "БЕК-2 Робопатруль",
];

const professionsByGroup = {
    'Гражданские': {
        'Испытуемый': { level: 1, weight: 25 },
        'Рабочий': { level: 7, weight: 12 },
        'Медицинский Персонал': { level: 3, weight: 8 },
        'Барыга': { level: 10, weight: 5 },
        'Грузчик': { level: 5, weight: 3 },
        'Психолог': { level: 15, weight: 2 },
    },
    'Охрана': {
        'Сотрудник Службы Безопасности': { level: 10, weight: 10 },
        'МОГ Эпсилон-11 | Солдат': { level: 20, weight: 7 },
        'Штурмовик ОБР': { level: 1, weight: 2 },
        'Медик ОБР': { level: 1, weight: 1 },
        'Ликвидатор': { level: 1, weight: 1 },
    },
};

const actionTemplates = [
    (p1: string, p2: string) => `игрок ${p1} убил игрока ${p2}.`,
    (p1: string, prof: string) => `игрок ${p1} сменил профессию на ${prof}.`,
    (p1: string) => `[OOC] ${p1}: Как вас КОБРА УБИЛА`,
    (p1: string) => `[OOC] ${p1}: Дура на кобре блять`,
    (p1: string) => `[OOC] ${p1}: лол`,
    (p1: string, p2: string) => `игрок ${p1} вылечил игрока ${p2}.`,
    (p1: string, item: string) => `игрок ${p1} выбросил ${item}.`,
];

const randomItems = ["ключ-карту", "аптечку", "оружие"];


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
        const state: ServerStateResponse = await gamedig.query({
            type: 'garrysmod',
            host: '46.174.53.106',
            port: 27015,
            maxAttempts: 2,
            socketTimeout: 3000
        });

        // Find the specific player or a random one for demonstration
        const playerInfo = state.players.find(p => p.steamId === steamId) || state.players[getDeterministicRandom(steamId, 0, state.players.length - 1)];

        if (!playerInfo) {
             return NextResponse.json({ error: "Player not found on server or server is empty." }, { status: 404 });
        }
        
        const timeInMinutes = playerInfo.raw?.time || playerInfo.time || getDeterministicRandom(steamId + 'time', 5, 200 * 60);
        const timeInDays = timeInMinutes / 60 / 24;

        // 1. Generate Level based on playtime (deterministically)
        let level;
        if (timeInDays <= 2) level = getDeterministicRandom(steamId + 'level', 1, 20);
        else if (timeInDays <= 4) level = getDeterministicRandom(steamId + 'level', 21, 40);
        else if (timeInDays <= 6) level = getDeterministicRandom(steamId + 'level', 41, 60);
        else if (timeInDays <= 8) level = getDeterministicRandom(steamId + 'level', 61, 80);
        else level = getDeterministicRandom(steamId + 'level', 81, 99);

        // 2. Generate Prime Level (deterministically)
        let primeLevel;
        const primeSeed = steamId + 'prime';
        if (timeInDays <= 15) {
            primeLevel = selectWeighted({ '1': 55, '2': 40 }, primeSeed);
        } else {
            primeLevel = selectWeighted({ '2': 40, '3': 25, '4': 8 }, primeSeed);
        }


        // 3. Generate Money (deterministically)
        let money;
        const hasMoneyChance = getDeterministicRandom(steamId + 'hasMoney', 1, 100) > 10; // 90% chance
        if (!hasMoneyChance) {
            money = 0;
        } else if (timeInDays <= 3) {
            money = getDeterministicRandom(steamId + 'money', 0, 102000);
        } else {
            money = getDeterministicRandom(steamId + 'money', 0, 410000);
        }

        // 4. Generate Group (deterministically)
        let group = selectWeighted(groups, steamId + 'group');
        if (timeInDays < 5 && ["Младший Администратор", "Модератор", "Младший Модератор", "Вайзер"].includes(group)) {
           group = selectWeighted({ "Игрок": 70, "VIP": 30 }, steamId + 'group_reroll');
        }

        // 5. Generate Profession (deterministically)
        const allProfessions = Object.values(professionsByGroup).flatMap(g => Object.entries(g));
        const professionWeights = allProfessions.reduce((acc, [name, data]) => ({ ...acc, [name]: data.weight }), {});
        let profession = selectWeighted(professionWeights, steamId + 'profession');


        // 6. Generate Donated Professions (deterministically)
        const donatedProfessions = [];
        const donatedChance = getDeterministicRandom(steamId + 'donatedChance', 1, 100);
        if (timeInDays > 3 && donatedChance <= 30) { // 30% chance
            const count = parseInt(selectWeighted({ '1': 70, '2': 30 }, steamId + 'donatedCount'));
            for (let i = 0; i < count; i++) {
                const profIndex = getDeterministicRandom(steamId + 'donatedProf' + i, 0, donatedProfessionsList.length - 1);
                donatedProfessions.push(donatedProfessionsList[profIndex]);
            }
        }
        
        // 7. Generate recent activities
        const activities = [];
        const otherPlayers = state.players.filter(p => p.name !== playerInfo.name);
        const allProfessionsList = Object.keys(professionWeights);
        for(let i=0; i< getDeterministicRandom(steamId + 'activityCount', 3, 7); i++) {
            const now = new Date();
            now.setSeconds(now.getSeconds() - getDeterministicRandom(steamId + 'actTime' + i, 10, 300));
            const time = now.toLocaleTimeString('ru-RU');
            const template = actionTemplates[getDeterministicRandom(steamId + 'act' + i, 0, actionTemplates.length - 1)];
            const otherPlayer = otherPlayers.length > 0 ? otherPlayers[getDeterministicRandom(steamId + 'otherPlayer' + i, 0, otherPlayers.length - 1)].name : "другой игрок";
            const randomProfession = allProfessionsList[getDeterministicRandom(steamId + 'randomProf' + i, 0, allProfessionsList.length - 1)];
            const randomItem = randomItems[getDeterministicRandom(steamId + 'randomItem' + i, 0, randomItems.length-1)];

            let activityText = "Что-то делает...";
            // This is a bit ugly, but it's a simple way to call the templates with the right number of args
            if (template.length === 2) {
                 activityText = template(playerInfo.name, otherPlayer);
                 if (activityText.includes("сменил профессию")) {
                     activityText = template(playerInfo.name, randomProfession);
                 }
                 if (activityText.includes("выбросил")) {
                     activityText = template(playerInfo.name, randomItem);
                 }
            } else {
                 activityText = template(playerInfo.name, "");
            }

            activities.push(`(${time}) ${activityText}`);
        }


        const playerDetails = {
            name: playerInfo.name || 'Неизвестный игрок',
            steamId: playerInfo.steamId || steamId,
            timeFormatted: formatPlayTime(timeInMinutes),
            timeHours: Math.round(timeInMinutes / 60 * 10) / 10,
            level: level,
            primeLevel: parseInt(primeLevel),
            money: money,
            group: group,
            profession: profession,
            donatedProfessions: [...new Set(donatedProfessions)], // Ensure unique
            activities: activities.reverse(),
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