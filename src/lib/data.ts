import type { LogEntry, Player, LogType, PlayerActivity } from '@/lib/types';

// --- Helper Functions ---
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTwoRandomPlayers(players: Player[]): [Player, Player] {
    const p1Index = Math.floor(Math.random() * players.length);
    let p2Index = Math.floor(Math.random() * players.length);
    while (p1Index === p2Index) {
        p2Index = Math.floor(Math.random() * players.length);
    }
    return [players[p1Index], players[p2Index]];
}

// --- Log Generation Data ---
const playerNames = [
    'Яра Шист', 'Эрик Дубрович', 'Кирилл Водкокрим', 'Akakii Akakievich', 
    'Fanera Alatash', 'Чад Пепел', 'Marquel Santana', 'Nikitos Roller', 
    'Egor Familov', 'John Doe', 'Jane Smith', 'Alex Ray', 'Tony Stark',
    'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Peter Parker'
];

const mockPlayers: Player[] = playerNames.map(name => ({
    name,
    score: Math.floor(Math.random() * 200),
    time: Math.floor(Math.random() * 3000),
    timeFormatted: 'mock',
    ping: Math.floor(Math.random() * 100),
    kills: Math.floor(Math.random() * 50),
    timeHours: 0,
    steamId: `STEAM_0:${Math.random() > 0.5 ? 1 : 0}:${Math.floor(Math.random() * 100000000)}`,
}));

const oocChatTemplates = [
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] бедный я, меня все пиздят и я бегаю на лоу хп` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] щас рейд?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Кто ролл 100к` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Кто ролл 300k` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Как вас КОБРА УБИЛА` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Дура на кобре блять` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] лол` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] чек условия ионик` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Люди` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Меня БРС связал` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] я боюсь совры и мясо они меня выебут пока я на нулевом тире` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] а чем причина?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] помоги` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Да вы заебали км я щяс выйду и буду кримировать все что вижу` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] пиздец` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] герой на совре` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] продам все непонятные чертежи,стероиды,пропитал,одноразовую броню,шасалеоший,ампулаХС-598,частица енергии,сыр,волчий клык,пластик,пустые банки,батарейки,обломок маски,лицо скромника,кцунцит,ампулы регенетатина и броневерина,серу,сердца` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] продам 3 шторма за штуку 300к` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] мясо го ты скушаешь кондора` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Ионик имба убил деректора и психолога` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] хахах я случайно убил сори` }),
];

const oocDialogues = [
    (p1: Player, p2: Player) => [
        { type: 'CHAT' as LogType, user: p1, details: `[OOC] давно обновление было?` },
        { type: 'CHAT' as LogType, user: p2, details: `[OOC] 2 недели назад вроде` },
    ],
    (p1: Player, p2: Player) => [
        { type: 'CHAT' as LogType, user: p1, details: `[OOC] бедный я, меня все пиздят и я бегаю на лоу хп` },
        { type: 'CHAT' as LogType, user: p2, details: `[OOC] бедолага` },
    ],
    (p1: Player, p2: Player) => [
        { type: 'CHAT' as LogType, user: p1, details: `[OOC] щас рейд?` },
        { type: 'CHAT' as LogType, user: p2, details: `[OOC] да, закупайся` },
    ]
];

const rpActionTemplates = [
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `Образец Ящерица ломает ворота к.с Ящерицы` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] О.Госпадин рыба переживший многие покушения продажи и помогая в бунте был подавлен теслой` }),
    (p1: Player, p2: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p1, details: `[Объявление] [СО] О.О.Ч. желает заключить контракт с ${p2.name}` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[дипломатия] Организация Сопротивление заключила контракт с Образец Ионик` }),
    (p1: Player, p2: Player) => ({ type: 'RP' as LogType, user: p1, details: `Ученый класса С должен привести испытуемых для Образец Гибрид (${p2.name}) 2 шт.` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Пред СОП] - [ДЗ] Отвечаете?` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Пред ДЗ]->[КМ] Подумаю` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP} О.Авель ВУС` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[соо] господин рыба желает контракт с КМ` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `Образец Гибрид ломает ворота к.с Гибрида ${Math.floor(Math.random() * 5) + 1}/5` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `Образец Голоса ломает ворота к.с Голоса ${Math.floor(Math.random() * 5) + 1}/5` }),
];

const notificationTemplates = [
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Образец Бессонник покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Образец Маска покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Образец До-До покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[VIP] Образец Хищник покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[СКО] Образец Желейка покинул комплекс (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[СКО] Образец ИИ покинул комплекс (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[СКО] Образец ИИ прибыл в комплекс (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `[VIP] Образец Кошмар покинул комплекс` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `[VIP] Образец Кошмар прибыл в комплекс` }),
];

const killTemplates = [
    (p1: Player, p2: Player) => ({ type: 'KILL' as LogType, user: p1, details: `убил игрока ${p2.name}.`, recipient: p2 }),
    (p1: Player) => ({ type: 'KILL' as LogType, user: p1, details: `был убит падением.` }),
];

const damageTemplates = [
     (p1: Player, p2: Player) => ({ type: 'DAMAGE' as LogType, user: p2, details: `получил ${Math.floor(Math.random() * 99) + 1} урона от ${p1.name}.`, recipient: p1 }),
];

const connectionTemplates = [
    (p: Player) => ({ type: 'CONNECTION' as LogType, user: p, details: `подключился к серверу.` }),
    (p: Player) => ({ type: 'CONNECTION' as LogType, user: p, details: `отключился от сервера.` }),
];

// --- Main Generator Function for Historical Data ---
function generateHistoricalLogs(days: number, logsPerDay: number): LogEntry[] {
    const allLogs: LogEntry[] = [];
    const now = new Date();

    for (let i = 0; i < days * logsPerDay; i++) {
        const timestamp = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
        
        // Ensure logs are between 6 AM and current time for each day
        const dayStart = new Date(timestamp);
        dayStart.setHours(6, 0, 0, 0);
        const dayEnd = new Date(timestamp);
        // If it's today, end at the current time. Otherwise, end at midnight.
        if (dayEnd.toDateString() === now.toDateString()) {
             dayEnd.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
        } else {
             dayEnd.setHours(23, 59, 59, 999);
        }

        if (timestamp < dayStart || timestamp > dayEnd) {
           // If the random timestamp is outside the 6 AM - now window, regenerate it within the window
           const validTimeRange = dayEnd.getTime() - dayStart.getTime();
           timestamp.setTime(dayStart.getTime() + Math.random() * validTimeRange);
        }

        let generatedLog: Omit<LogEntry, 'id' | 'timestamp'> | null = null;
        
        const eventType = Math.random();

        if (eventType < 0.45) { // OOC Chat
            if (mockPlayers.length > 1 && Math.random() < 0.2) {
                const [p1, p2] = getTwoRandomPlayers(mockPlayers);
                const dialogue = getRandomElement(oocDialogues);
                dialogue(p1, p2).forEach(logPart => {
                    allLogs.push({ ...logPart, id: crypto.randomUUID(), timestamp });
                });
                continue;
            } else {
                generatedLog = getRandomElement(oocChatTemplates)(getRandomElement(mockPlayers));
            }
        } else if (eventType < 0.65) { // Kills/Damage
            const [p1, p2] = getTwoRandomPlayers(mockPlayers);
            if (Math.random() < 0.7) {
                generatedLog = getRandomElement(killTemplates)(p1, p2);
            } else {
                generatedLog = getRandomElement(damageTemplates)(p1, p2);
            }
        } else if (eventType < 0.85) { // RP Actions
            const template = getRandomElement(rpActionTemplates);
            if (template.length === 2) {
                const [p1, p2] = getTwoRandomPlayers(mockPlayers);
                generatedLog = template(p1, p2);
            } else {
                generatedLog = template(getRandomElement(mockPlayers), null as any);
            }
        } else if (eventType < 0.95) { // System Notifications
            generatedLog = getRandomElement(notificationTemplates)(getRandomElement(mockPlayers));
        } else { // Connections
            generatedLog = getRandomElement(connectionTemplates)(getRandomElement(mockPlayers));
        }

        if (generatedLog) {
            allLogs.push({
                ...generatedLog,
                id: crypto.randomUUID(),
                timestamp: timestamp,
            });
        }
    }

    return allLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Generate a week of logs, with around 200 entries per day
export const historicalLogs: LogEntry[] = generateHistoricalLogs(7, 200);


// Mock data for player activity chart
export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setHours(new Date().getHours() - (i * 2));
    return {
        time: `${String(d.getHours()).padStart(2, '0')}:00`,
        players: Math.floor(Math.random() * (55 - 10 + 1)) + 10,
    };
}).reverse();
