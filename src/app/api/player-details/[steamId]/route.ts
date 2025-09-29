
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

const groups = {
  "Игрок": 52, "VIP": 25, "Unisono Light": 13, "Unisono Plus": 3,
  "Младший Администратор": 2, "Модератор": 1, "Младший Модератор": 1,
  "Старший Игрок": 1, "Вайзер": 2
};

const professions = [
    'Испытуемый', 'Рабочий', 'Медицинский Персонал', 'Барыга', 'Грузчик', 'Психолог',
    'Сотрудник Службы Безопасности', 'МОГ Эпсилон-11 | Солдат', 'Штурмовик ОБР',
    'Медик ОБР', 'Ликвидатор'
];

const donatedProfessionsList = [
    "[VIP] Сотрудник Службы Безопасности", "БЕК-1 Робопатруль", "БЕК-2 Робопатруль",
];

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
             // If not in logs, generate one deterministically from the list
            playerName = playerNames[simpleHash(steamId) % playerNames.length];
        }

        // --- Generate Player Data Deterministically ---
        const timeInMinutes = getDeterministicRandom(steamId + 'time', 30, 15000);
        const level = Math.min(100, Math.floor(timeInMinutes / 120) + getDeterministicRandom(steamId + 'level', 1, 10));
        const primeLevel = level === 100 ? getDeterministicRandom(steamId + 'prime', 1, 5) : 0;
        const money = getDeterministicRandom(steamId + 'money', 100, 500000);
        const group = selectWeighted(groups, steamId + 'group');
        const profession = professions[getDeterministicRandom(steamId + 'prof', 0, professions.length - 1)];

        const donatedProfessions: string[] = [];
        if (getDeterministicRandom(steamId + 'donated', 1, 10) <= 3) { // 30% chance
            const count = getDeterministicRandom(steamId + 'donatedCount', 1, 2);
            for (let i = 0; i < count; i++) {
                const prof = donatedProfessionsList[getDeterministicRandom(steamId + 'donatedProf' + i, 0, donatedProfessionsList.length - 1)];
                if (!donatedProfessions.includes(prof)) {
                    donatedProfessions.push(prof);
                }
            }
        }
        
        // --- Filter activities for this player ---
        const playerActivities = historicalLogs
            .filter(log => log.user?.steamId === steamId || (log.details.includes(playerName) && !log.details.toLowerCase().startsWith('[ooc]')))
            .slice(0, 15) // Get latest 15 activities
            .map(log => {
                const time = new Date(log.timestamp).toLocaleTimeString('ru-RU');
                return `(${time}) ${log.details}`;
            })
            .reverse(); // Show oldest first


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
