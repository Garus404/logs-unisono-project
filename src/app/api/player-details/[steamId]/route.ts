
import { NextResponse, NextRequest } from "next/server";
import { PlayerDetails } from "@/lib/types";
import { historicalLogs } from '@/lib/data';

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

function getDeterministicRandom(seed: string, min: number, max: number): number {
    const hash = simpleHash(seed);
    const range = max - min + 1;
    if (range <= 0) return min;
    return (hash % range) + min;
}

function selectWeighted(options: Record<string, number>, seed: string): string {
    let sum = 0;
    const weighted = Object.entries(options).map(([name, weight]) => {
        sum += weight;
        return { name, weight: sum };
    });
    const rand = getDeterministicRandom(seed, 0, sum -1);
    return weighted.find(item => item.weight > rand)?.name || Object.keys(options)[0];
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

// --- Data for Generation ---

const playerNames = [
    'Яра Шист', 'Эрик Дубрович', 'Кирилл Водкокрим', 'Akakii Akakievich', 'Fanera Alatash', 'Чад Пепел',
    'Marquel Santana', 'Nikitos Roller', 'Egor Familov', 'John Doe', 'Jane Smith', 'Alex Ray', 'Tony Stark',
    'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Peter Parker', 'Rin Hanasaku', 'Muhammad Sanchez',
    'Вова Агутин', 'Kenny Haiden', 'Chang Milos', 'Bober Namazov', 'Egor Caramora', 'Алексей Роялин',
    'Сэм Великий', 'Кейн Питормотов', 'Дмитрий Блэк', 'Каэдэ Чан', 'Каха Лобенко', 'Гагари Роан',
    'Андрей Каменев', 'Domas Harikov', 'Сережа Бульбин', 'Роман Тимов', 'Саша Великий', 'Дима Сосискин',
    'Марк Теркаев', 'Артём Кудинов', 'Carl Kleen', 'Алик Пашмаков', 'Бобр Чекист', 'Артем Солодкин',
    'Тони Майлер', 'Иван Шаров', 'Лоренсо Нэп', 'Алексей Эхов', 'Никита Семенек', 'Gabriel Show',
    'Леха Фастфудов', 'Галим Вискарь', 'Alexander Petrovich', 'Maksim Mercer', 'Rydy Blackberry',
    'Майкл Цуриков', 'Прометей Фелт', 'Алекс Тролген', 'Илья Голубцов', 'Рома Крауц', 'Андрей Цыплин',
    'Pasha Novikov', 'Степан Хорошов', 'Джордж Конор', 'Amino Morsogo', 'Грум Нард', 'Юлий Пирогов',
    'Толя Дальнобой', 'Мухмад Артуров', 'Андрей Файров', 'Филип Бевер', 'Иван Дмитревич', 'Adrian Goida',
    'Василий Ковров', 'Никита Рамашкинов', 'Майкл Суриков'
];

const levelDistribution = { "1-20": 50, "21-40": 25, "41-60": 15, "61-80": 7, "81-99": 3 };
const groupDistribution = { "Игрок": 52, "VIP": 25, "Unisono Light": 13, "Unisono Plus": 3 };

const freeProfessions: { [level: number]: string[] } = {
    1: ['Испытуемый'], 3: ['Медицинский Персонал'], 5: ['Грузчик'],
    7: ['Рабочий', 'Лаборант'], 10: ['Барыга'], 12: ['Ученый класса А'],
    15: ['Психолог'], 18: ['Ученый класса В'], 24: ['Ученый класса С']
};
const vipProfessions: { [level: number]: {name: string}[] } = {
    1: [{name:'[VIP] SCP: Суккуб'}, {name:'[VIP] SCP: Кошмар'}, {name:'[VIP] SCP: Хищник'}],
    10: [{name:'[VIP] Сотрудник Службы Безопасности'}],
    20: [{name:'[VIP] МОГ Эпсилон-11 Солдат'}],
    1: [{name:'БЕК-2 Робопатруль'}]
};
const paidProfessions = [
    'Рейнджер', 'Медик ОБР', 'Штурмовик ОБР', 'МОГ Бета-7 | Химик', 'Ликвидатор',
    'Экзобоец', 'Образец Авель', 'Образец Хранитель', 'Образец Мясник', 'ИИ Кобра',
    'Военный прототип | ПИЛИГРИМ', 'БРС - Миротворец', 'Наемный Агент'
];
const leadershipProfessions: { [level: number]: { name: string, prime?: number }[] } = {
    30: [{ name: 'БЕК-1 Робопатруль' }],
    40: [{ name: 'Директор', prime: 1 }],
    45: [{ name: 'Командир СБ' }, { name: 'Образец Домовой' }],
    50: [{ name: 'МОГ Лейтенант', prime: 1 }, { name: 'Член Совета ОБ', prime: 2 }],
    70: [{ name: 'МОГ Командир', prime: 2 }],
    80: [{ name: 'Глава ученых' }],
    99: [{ name: 'Образец Ионик', prime: 3 }],
};

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
        // --- Find player name ---
        let playerName = "Неизвестный игрок";
        const playerFromLogs = historicalLogs.find(log => log.user?.steamId === steamId);
        if (playerFromLogs && playerFromLogs.user) {
            playerName = playerFromLogs.user.name;
        } else {
            playerName = playerNames[simpleHash(steamId) % playerNames.length];
        }

        // --- Generate Player Data Deterministically based on rules ---

        // 1. Determine Level based on distribution
        const levelRangeStr = selectWeighted(levelDistribution, steamId + 'levelRange');
        const [minLevel, maxLevel] = levelRangeStr.split('-').map(Number);
        const level = getDeterministicRandom(steamId + 'level', minLevel, maxLevel);

        // 2. Determine Group (subscription)
        let group = selectWeighted(groupDistribution, steamId + 'group');
        const hasSubscription = group !== "Игрок";
        
        // Prime level can only be assigned if level is 99+
        const primeLevel = level >= 99 ? getDeterministicRandom(steamId + 'prime', 0, 3) : 0;

        // 3. Determine available professions and select one
        let availableProfessions: string[] = [];
        Object.entries(freeProfessions).forEach(([lvl, profs]) => {
            if (level >= Number(lvl)) availableProfessions.push(...profs);
        });

        if (hasSubscription) {
            Object.entries(vipProfessions).forEach(([lvl, profs]) => {
                 if (level >= Number(lvl)) {
                    profs.forEach(prof => {
                       availableProfessions.push(prof.name);
                    });
                }
            });
        }
        
        // Check for leadership roles
        Object.entries(leadershipProfessions).forEach(([lvl, profs]) => {
            if (level >= Number(lvl)) {
                profs.forEach(prof => {
                    if (!prof.prime || prof.prime <= primeLevel) {
                        availableProfessions.push(prof.name);
                        // If a leadership role is assigned, it often becomes the main group as well
                        if (getDeterministicRandom(steamId + 'leadership_role_group', 1, 10) > 6) {
                            group = prof.name;
                        }
                    }
                });
            }
        });
        
        const profession = availableProfessions.length > 0 
            ? availableProfessions[getDeterministicRandom(steamId + 'prof', 0, availableProfessions.length - 1)] 
            : 'Испытуемый';
        
        // 4. Determine if player has paid professions
        const donatedProfessions: string[] = [];
        if (getDeterministicRandom(steamId + 'has_donated', 1, 100) <= 20) { // 20% chance to have donated
            const count = getDeterministicRandom(steamId + 'donated_count', 1, 3);
            for (let i = 0; i < count; i++) {
                const prof = paidProfessions[getDeterministicRandom(steamId + 'donated_prof_' + i, 0, paidProfessions.length - 1)];
                if (!donatedProfessions.includes(prof)) {
                    donatedProfessions.push(prof);
                }
            }
        }
        
        // --- Generate other stats based on level ---
        const timeInMinutes = (level * 120) + getDeterministicRandom(steamId + 'time_variance', -60, 180);
        const money = Math.max(0, (timeInMinutes * getDeterministicRandom(steamId + 'money_rate', 15, 60)) + getDeterministicRandom(steamId + 'money_base', 1000, 10000));
        const ping = getDeterministicRandom(steamId + 'ping', 15, 85);
        const kills = getDeterministicRandom(steamId + 'kills', 2600, 25000);
        const deaths = getDeterministicRandom(steamId + 'deaths', 2600, 25000);

        // --- Filter activities for this player ---
        const playerActivities = historicalLogs
            .filter(log => log.user?.steamId === steamId || (log.user?.name === playerName && !log.details.toLowerCase().startsWith('[ooc]')))
            .slice(0, 20)
            .map(log => {
                const time = new Date(log.timestamp).toLocaleTimeString('ru-RU');
                return `(${time}) ${log.details}`;
            })
            .reverse();


        const playerDetails: PlayerDetails = {
            name: playerName,
            steamId: steamId,
            timeFormatted: formatPlayTime(timeInMinutes),
            timeHours: Math.round(timeInMinutes / 60 * 10) / 10,
            level: level,
            primeLevel: primeLevel,
            money: money,
            group: group,
            profession: profession,
            donatedProfessions: donatedProfessions,
            activities: playerActivities,
            ping,
            kills,
            deaths,
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
