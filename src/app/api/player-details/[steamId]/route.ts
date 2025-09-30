
import { NextResponse, NextRequest } from "next/server";
import { PlayerDetails, LogEntry } from "@/lib/types";
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
    for (const weight of Object.values(options)) {
        sum += weight;
    }
    const rand = getDeterministicRandom(seed, 0, sum - 1);
    let currentSum = 0;
    for (const [name, weight] of Object.entries(options)) {
        currentSum += weight;
        if (rand < currentSum) {
            return name;
        }
    }
    return Object.keys(options)[0];
}


// This function now formats total playtime (long durations)
function formatTotalPlayTime(minutes: number): string {
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
const groupDistribution = { "Игрок": 75, "VIP": 15, "Unisono Light": 8, "Unisono Plus": 2 };


const freeProfessions: { [level: number]: string[] } = {
    1: ['Испытуемый'],
    3: ['Медицинский Персонал'],
    5: ['Грузчик'],
    7: ['Рабочий', 'Лаборант'],
    10: ['Барыга', 'Сотрудник Службы Безопасности'],
    12: ['Ученый класса А'],
    15: ['Психолог'],
    18: ['Ученый класса В'],
    20: ['МОГ Эпсилон-П | Солдат', 'Образец Каплеглазик А', 'Образец Каплеглазик Б'],
    24: ['Ученый класса С'],
    25: ['Образец Желейка', 'Образец Медвежонок'],
    30: ['БЕК-1 Робопатруль', 'Образец Господин Рыба'],
    35: ['Образец Бессонник'],
    40: ['Образец Чужой'],
    45: ['Командир СБ', 'Образец Маска', 'Образец Гибрид', 'Образец Домовой'],
    50: ['Образец ИИ', 'Образец Мимик'],
    60: ['Образец Чумной Доктор'],
    65: ['Образец Огненный Человек', 'Образец Амфибия'],
    75: ['Образец Скромник'],
    80: ['Глава ученых', 'Образец Голоса'],
    95: ['Образец Старик'],
};

const vipProfessions: { [level: number]: string[] } = {
    25: ['Образец Суккуб', 'Образец Кошмар'],
    30: ['Образец Хищник'],
};

const leadershipProfessions: { [level: number]: { name: string, prime: number }[] } = {
    40: [{ name: 'Директор', prime: 1 }],
    50: [{ name: 'Член Совета ОБ', prime: 2 }, { name: 'Образец Ящерица', prime: 1 }],
    70: [{ name: 'МОГ Эпсилон-П | Командир', prime: 2 }],
    90: [{ name: 'МОГ Эпсилон-П | Лейтенант', prime: 1 }],
    99: [{ name: 'Образец Ионик', prime: 3 }],
};

const donatedProfessionsList = [
    'Рейнджер', 'Медик ОБР', 'Штурмовик ОБР', 'МОГ Бета-7 | Химик', 'Ликвидатор',
    'Экзобоец', 'Образец Авель', 'Образец Хранитель', 'Образец Мясник', 'БЕК-2 Робопатруль', 'ИИ Кобра',
    'Военный прототип | ПИЛИГРИМ', 'БРС - Миротворец', 'Наемный Агент'
];

const specialProfessions: { [level: number]: string[] } = {
    55: ['AFK', 'NONRP'],
};

const allSampleProfessions = [
    ...Object.values(freeProfessions).flat(),
    ...Object.values(vipProfessions).flat(),
    ...Object.values(leadershipProfessions).map(profs => profs.map(p => p.name)).flat(),
].filter(p => p.startsWith('Образец'));


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
            // Deterministic name selection if not found in logs
            playerName = playerNames[simpleHash(steamId) % playerNames.length];
        }

        // --- Generate Player Data Deterministically based on rules ---

        // 1. Determine Level based on distribution
        const levelRangeStr = selectWeighted(levelDistribution, steamId + 'levelRange');
        const [minLevel, maxLevel] = levelRangeStr.split('-').map(Number);
        const level = getDeterministicRandom(steamId + 'level', minLevel, maxLevel);
        
        const timeInMinutes = (level * 120) + getDeterministicRandom(steamId + 'time_variance', 0, level * 30);
        const timeInDays = timeInMinutes / (60 * 24);
        
        // 2. Prime level can only be assigned if level is 99+ and playtime is at least 8 days
        const primeLevel = (level >= 99 && timeInDays >= 8) ? getDeterministicRandom(steamId + 'prime', 1, 3) : 0;

        // 3. Determine Group (subscription)
        let group = "Игрок";
        // Lower level players are less likely to have a subscription
        if (level < 10 && getDeterministicRandom(steamId + 'low_level_sub_chance', 1, 100) > 5) {
            group = "Игрок";
        } else {
             group = selectWeighted(groupDistribution, steamId + 'group');
        }

        // 4. Determine available main professions
        let availableProfessions: string[] = [];
        
        Object.entries(freeProfessions).forEach(([lvl, profs]) => {
            if (level >= Number(lvl)) availableProfessions.push(...profs);
        });
        
        if (group !== "Игрок") {
            Object.entries(vipProfessions).forEach(([lvl, profs]) => {
                 if (level >= Number(lvl)) {
                    availableProfessions.push(...profs);
                }
            });
        }
        
        Object.entries(leadershipProfessions).forEach(([lvl, profs]) => {
            if (level >= Number(lvl)) {
                profs.forEach(prof => {
                    if (!prof.prime || prof.prime <= primeLevel) {
                        availableProfessions.push(prof.name);
                    }
                });
            }
        });
        
        // Filter out sample professions if player already has one from a donated source (rule below)
        // This is a pre-emptive check; we refine the final profession later.
        
        // 5. Determine donated professions
        const donatedProfessions: string[] = [];
        let donationChance = 0;
        if (level >= 1 && level <= 10) donationChance = getDeterministicRandom(steamId + 'donate_chance_1', 0, 10);
        else if (level >= 11 && level <= 54) donationChance = getDeterministicRandom(steamId + 'donate_chance_2', 20, 30);
        else if (level >= 55) donationChance = getDeterministicRandom(steamId + 'donate_chance_3', 50, 70);

        if (getDeterministicRandom(steamId + 'has_donated', 1, 100) <= donationChance) {
             let count = 0;
             const rand = getDeterministicRandom(steamId + 'donated_count_rand', 1, 100);
             if (level >= 55) {
                 if (rand <= 60) count = 1;
                 else if (rand <= 85) count = 2;
                 else count = 3;
             } else if (level >= 11) {
                 if (rand <= 80) count = 1; else count = 0;
             } else {
                 if (rand <= 50) count = 1; else count = 0;
             }
             
             const availableDonated = [...donatedProfessionsList];
             for (let i = 0; i < count; i++) {
                if(availableDonated.length === 0) break;
                const profIndex = getDeterministicRandom(steamId + 'donated_prof_' + i, 0, availableDonated.length - 1);
                const prof = availableDonated.splice(profIndex, 1)[0];
                if (!donatedProfessions.includes(prof)) {
                    donatedProfessions.push(prof);
                }
            }
        }
        
        // If a donated profession is a sample, it takes precedence.
        const hasDonatedSample = donatedProfessions.some(p => allSampleProfessions.includes(p));

        if(hasDonatedSample){
            availableProfessions = availableProfessions.filter(p => !allSampleProfessions.includes(p));
        }

        // 6. Select final profession
        let profession = "Испытуемый"; // Default profession
        if (availableProfessions.length > 0) {
            // Give preference to non-limited professions
            const unlimitedProfessions = availableProfessions.filter(p => !['Барыга', 'Рабочий', 'Медицинский Персонал', 'Психолог', 'Грузчик', 'Сотрудник Службы Безопасности', 'БЕК-1 Робопатруль'].includes(p));
            const limitedProfessions = availableProfessions.filter(p => ['Барыга', 'Рабочий', 'Медицинский Персонал', 'Психолог', 'Грузчик', 'Сотрудник Службы Безопасности', 'БЕК-1 Робопатруль'].includes(p));
            
            let chosenProfessionPool = unlimitedProfessions;
            // Add limited professions with a lower probability
            if (getDeterministicRandom(steamId + 'limited_prof_chance', 1, 10) <= 2) { // 20% chance to even consider a limited prof
                chosenProfessionPool.push(...limitedProfessions);
            }

            if (chosenProfessionPool.length > 0) {
                 profession = chosenProfessionPool[getDeterministicRandom(steamId + 'prof', 0, chosenProfessionPool.length - 1)];
            }
        }
            
        // Special professions (AFK/NONRP) override with a very small chance for high-level players
        if (level >= 55 && getDeterministicRandom(steamId + 'special_prof_chance', 1, 100) <= 2) {
             const specialProfs = specialProfessions[55] || [];
             if (specialProfs.length > 0) {
                profession = specialProfs[getDeterministicRandom(steamId + 'special_prof_select', 0, specialProfs.length - 1)];
             }
        }
        
        const money = Math.max(0, (level * getDeterministicRandom(steamId + 'money_rate', 500, 2500)));
        const ping = getDeterministicRandom(steamId + 'ping', 15, 85);
        
        // Kills and deaths based on level (more realistic)
        const kills = Math.round(level * getDeterministicRandom(steamId + 'kills_rate', 0.5, 5) + getDeterministicRandom(steamId, 0, level * 10));
        const deaths = Math.round(level * getDeterministicRandom(steamId + 'deaths_rate', 0.5, 5) + getDeterministicRandom(steamId, 0, level * 10));


        // --- Filter activities for this player ---
        const playerActivities = historicalLogs
            .filter((log): log is LogEntry => {
                 if (!log.user) return false;
                 // Events initiated by the player
                 if (log.user.steamId === steamId || log.user.name === playerName) {
                     return ['CHAT', 'CONNECTION', 'KILL', 'SPAWN'].includes(log.type);
                 }
                 // Events where the player is the recipient
                 if (log.recipient?.name === playerName && ['KILL', 'DAMAGE'].includes(log.type)) {
                     return true;
                 }
                 return false;
             })
             .slice(0, 30) // Limit to the last 30 activities
             .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


        const playerDetails: PlayerDetails = {
            name: playerName,
            steamId: steamId,
            timeFormatted: formatTotalPlayTime(timeInMinutes),
            timeHours: Math.round(timeInMinutes / 60 * 10) / 10,
            level: level,
            primeLevel: primeLevel,
            money: Math.round(money),
            group: group,
            profession: profession,
            donatedProfessions: donatedProfessions,
            activities: playerActivities,
            ping: ping,
            kills: Math.round(kills),
            deaths: Math.round(deaths),
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

    
