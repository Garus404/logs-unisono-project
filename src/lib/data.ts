import type { LogEntry, Player, LogType } from '@/lib/types';

// --- Helper Functions ---
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTwoRandomPlayers(players: Player[]): [Player, Player] | null {
    if (players.length < 2) return null;
    const p1 = getRandomElement(players);
    const p2 = getRandomElement(players.filter(p => p.name !== p1.name));
    return [p1, p2];
}


// --- Log Generation Templates ---
const oocChatTemplates = [
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] бедный я, меня все пиздят и я бегаю на лоу хп` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] щас рейд?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Кто ролл 100к` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Как вас КОБРА УБИЛА` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Дура на кобре блять` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] лол` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] чек условия ионик` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Люди` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Меня БРС связал` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] я боюсь совры и мясо они меня выебут пока я на нулевом тире` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] а чем причина?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] помоги` }),
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

];

const notificationTemplates = [
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[Оповещение] Образец Бессонник покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[Оповещение] Образец Маска покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[Оповещение] Образец До-До покинул камеру содержания. (${p.name})` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[СКО] (${p.name}) Образец Желейка покинул комплекс` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[СКО] (${p.name}) Образец ИИ покинул комплекс` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `[СКО] (${p.name}) Образец ИИ прибыл в комплекс` }),
];

const killTemplates = [
    (p1: Player, p2: Player) => ({ type: 'KILL' as LogType, user: p1, details: `убил игрока ${p2.name}.`, recipient: p2 }),
    (p1: Player) => ({ type: 'KILL' as LogType, user: p1, details: `был убит падением.` }),
];

const connectionTemplates = [
    (p: Player) => ({ type: 'CONNECTION' as LogType, user: p, details: `подключился.` }),
    (p: Player) => ({ type: 'CONNECTION' as LogType, user: p, details: `отключился.` }),
];

const damageTemplates = [
     (p1: Player, p2: Player) => ({ type: 'DAMAGE' as LogType, user: p2, details: `получил 35 урона от ${p1.name}.`, recipient: p1 }),
]


// --- Main Generator Function ---

export function generateLiveLog(players: Player[]): LogEntry[] | null {
    if (players.length === 0) return null;

    // Use a weighted random selection to make some events rarer
    const eventType = Math.random();
    let generatedLogs: (Omit<LogEntry, 'id' | 'timestamp'> | null)[] = [];

    if (eventType < 0.45) { // OOC Chat (45% chance)
        if (players.length > 1 && Math.random() < 0.3) { // 30% of chats are dialogues
             const twoPlayers = getTwoRandomPlayers(players);
             if (twoPlayers) {
                const [p1, p2] = twoPlayers;
                const dialogue = getRandomElement(oocDialogues);
                generatedLogs = dialogue(p1, p2);
             }
        } else {
            const p1 = getRandomElement(players);
            const template = getRandomElement(oocChatTemplates);
            generatedLogs.push(template(p1));
        }

    } else if (eventType < 0.65) { // Kills/Damage (20% chance)
        const twoPlayers = getTwoRandomPlayers(players);
        if (twoPlayers && Math.random() < 0.8) { // 80% involve another player
            const [p1, p2] = twoPlayers;
            if(Math.random() < 0.7) {
                const template = getRandomElement(killTemplates.filter(t => t.length === 2));
                generatedLogs.push(template(p1, p2));
            } else {
                const template = getRandomElement(damageTemplates);
                generatedLogs.push(template(p1, p2));
            }
       } else {
            const p1 = getRandomElement(players);
            const template = getRandomElement(killTemplates.filter(t => t.length === 1));
            generatedLogs.push(template(p1, null as any)); // Fall damage etc.
       }
    } else if (eventType < 0.85) { // RP Actions / Announcements (20% chance)
        const template = getRandomElement(rpActionTemplates);
         if (template.length === 2) {
            const twoPlayers = getTwoRandomPlayers(players);
            if (twoPlayers) {
                generatedLogs.push(template(twoPlayers[0], twoPlayers[1]));
            }
        } else {
            generatedLogs.push(template(getRandomElement(players), null as any));
        }
    } else if (eventType < 0.95) { // System Notifications (10% chance)
        const p1 = getRandomElement(players);
        const template = getRandomElement(notificationTemplates);
        generatedLogs.push(template(p1));
    } else { // Connections (5% chance)
         const p1 = getRandomElement(players);
         const template = getRandomElement(connectionTemplates);
         generatedLogs.push(template(p1));
    }

    // Filter out any nulls and map to full LogEntry
    return generatedLogs.filter(Boolean).map(log => ({
        ...log,
        id: crypto.randomUUID(),
        timestamp: new Date(),
    } as LogEntry));
}


// Mock data for player activity chart
export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setHours(new Date().getHours() - (i * 2));
    return {
        time: `${String(d.getHours()).padStart(2, '0')}:00`,
        players: Math.floor(Math.random() * (55 - 10 + 1)) + 10,
    };
}).reverse();
