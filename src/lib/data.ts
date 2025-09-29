import type { LogEntry, Player, LogType, PlayerActivity } from '@/lib/types';

// --- Helper Functions ---
function getRandomElement<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTwoRandomPlayers(players: Player[]): [Player, Player] {
    const p1Index = Math.floor(Math.random() * players.length);
    let p2Index = Math.floor(Math.random() * players.length);
    while (p1Index === p2Index || !players[p1Index] || !players[p2Index]) { // Ensure players exist
        p2Index = Math.floor(Math.random() * players.length);
    }
    return [players[p1Index], players[p2Index]];
}

// --- Log Generation Data ---
const playerNames = [
    'Яра Шист', 'Эрик Дубрович', 'Кирилл Водкокрим', 'Akakii Akakievich', 
    'Fanera Alatash', 'Чад Пепел', 'Marquel Santana', 'Nikitos Roller', 
    'Egor Familov', 'John Doe', 'Jane Smith', 'Alex Ray', 'Tony Stark',
    'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Peter Parker',
    'Rin Hanasaku', 'Muhammad Sanchez', 'Вова Агутин', 'Kenny Haiden',
    'Chang Milos', 'Bober Namazov', 'Egor Caramora', 'Алексей Роялин',
    'Сэм Великий', 'Кейн Питормотов', 'Дмитрий Блэк', 'Каэдэ Чан',
    'Каха Лобенко', 'Гагари Роан', 'Андрей Каменев', 'Domas Harikov',
    'Сережа Бульбин', 'Роман Тимов', 'Саша Великий', 'Дима Сосискин',
    'Марк Теркаев', 'Артём Кудинов', 'Carl Kleen', 'Алик Пашмаков',
    'Бобр Чекист', 'Артем Солодкин', 'Тони Майлер', 'Иван Шаров',
    'Лоренсо Нэп', 'Алексей Эхов', 'Никита Семенек', 'Gabriel Show',
    'Леха Фастфудов', 'Галим Вискарь', 'Alexander Petrovich'
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

const scpObjects = [
    "Каплеглазик А", "Мясник", "Скромник", "Старик", "Авель", "Маска", "Кондор",
    "Амфибия", "Гибрид", "Хищник", "Ящерица", "Бессонник", "Домовой", "Чужой - Лицехват",
    "Огненный Человек", "Медвежонок", "Мимик", "Ионик", "Суккуб", "До-До", "Господин Рыба",
    "Желейка", "Чумной Доктор", "Хранитель", "Чужой"
];

const organizations = ["Комплекс", "Сопротивление", "Длань-Змея"];

// --- TEMPLATES ---
const oocChatTemplates = [
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] бедный я, меня все пиздят и я бегаю на лоу хп` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] щас рейд?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Кто ролл 100к` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Кто ролл 300k` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Как вас КОБРА УБИЛА` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Дура на кобре блять` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] лол` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] чек условия ионик` }),
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
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] на эваку не хватает` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] чужой руниа` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] ЭХ почти ящера убили` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] егор сколько осттавили хотя бы?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] кто там броники киллы покупал` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] юыло 700 хп` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] z yt gjgjlfk` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] админы помогите я застрял!!!` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Продам методичку по ученым / 8 сфер ионика / 12 броников киллы / массу старика.` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] услышал` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] на все хватает` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] lelele` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] вы ему в рп скажите` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] каким боком` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] ну ящера нету` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] гибрид в кс` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] оффайте не хватает` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] не офаем:)` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] все офаем` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] офаем` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Нельзя` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] верт прилетел?` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] +` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] О5 радуйся что кобра разъебал хвшку` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] я бы щас рельсой ебанул по верту)` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] так давай` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] так у нас там бессмертие` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] я бы щяс тебе в ебло с лки дал)` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] похуй, взорвались бы` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] не здержевай имоцый` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] так хвшки нет` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] какбы` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] как ты` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] че врет` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] thanks sovra` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] создаю любые предметы на заказ писать в пм` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] союзы уберити` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] если сбежал гибрид это уже жёлтый` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] Гибрид вернулся` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] куплю клык хищя и чип кобры` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] откат` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] верим` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] так это бинды` }),
    (p: Player) => ({ type: 'CHAT' as LogType, user: p, details: `[OOC] эрик дубрович убери пропы в интеркоме` }),
];

const oocDialogues = [
    (p1: Player, p2: Player) => [{ type: 'CHAT' as LogType, user: p1, details: `[OOC] чужой руниа` }, { type: 'CHAT' as LogType, user: p2, details: `[OOC] руниа?` }, { type: 'CHAT' as LogType, user: p1, details: `[OOC] руина*` }],
    (p1: Player, p2: Player) => [{ type: 'CHAT' as LogType, user: p1, details: `[OOC] давно обновление было?` }, { type: 'CHAT' as LogType, user: p2, details: `[OOC] 2 недели назад вроде` }],
    (p1: Player, p2: Player) => [{ type: 'CHAT' as LogType, user: p1, details: `[OOC] бедный я, меня все пиздят` }, { type: 'CHAT' as LogType, user: p2, details: `[OOC] бедолага` }],
];

const rpActionTemplates = [
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} ломает ворота к.с ${scp} ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} плавит куб ${scp} ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Внимание Образец ${scp} расплавил куб ${scp}` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} покинул комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} прибыл в комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] [VIP] Образец ${scp} покинул комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] [VIP] Образец ${scp} прибыл в комплекс` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `Учёные Образец ${getRandomElement(scpObjects)} требует Испытуемых - ${Math.floor(Math.random() * 2) + 1} шт.` }),
];

const announcementTemplates = [
    (p: Player, scp1: string, scp2: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] О.${scp1} подавила О.${scp2}` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] ${scp} убит` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Заказ выполнен` }),
    (p: Player, org: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Нападение на ${org}, союз с враждебной фракцией` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [CO] О.${scp} жилает контаркт с км` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] штурмовик мог дезертировал причины: разочарования комплекса` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[CO] Образец ${scp} желает контракт с КМ.` }),
];

const notificationTemplates = [
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения Образец ${scp} покинул камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения [VIP] Образец ${scp} покинул камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения Образец ${scp} вернулся в камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Образец ${scp} погиб. Контракт с Организацией ${getRandomElement(organizations)} аннулирован.` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация ${getRandomElement(organizations)} объявила войну Организации ${getRandomElement(organizations.filter(o => o !== organizations[0]))}` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Главы Организации ${getRandomElement(organizations)} погибли. Все контракты, войны, союзы аннулированы.` }),
    (p: Player, code: string) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `Интерком обьявил ${code}` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `Tasks | ${p.name} получил $${(Math.floor(Math.random() * 10) + 1) * 5000} за выполнение Никнейм задания` }),
];

const connectionTemplates = [
    (p: Player) => ({ type: 'CONNECTION' as LogType, user: p, details: `подключился к серверу.` }),
    (p: Player) => ({ type: 'CONNECTION' as LogType, user: p, details: `отключился от сервера.` }),
];

const killTemplates = [
    (p1: Player, p2: Player) => ({ type: 'KILL' as LogType, user: p1, details: `убил игрока ${p2.name}.`, recipient: p2 }),
    (p1: Player) => ({ type: 'KILL' as LogType, user: p1, details: `был убит падением.` }),
];

const damageTemplates = [
     (p1: Player, p2: Player) => ({ type: 'DAMAGE' as LogType, user: p2, details: `получил ${Math.floor(Math.random() * 99) + 1} урона от ${p1.name}.`, recipient: p1 }),
];


// --- Main Generator Function for Historical Data ---
function generateHistoricalLogs(days: number, logsPerDay: number): LogEntry[] {
    const allLogs: LogEntry[] = [];
    const now = new Date();
    const usageCounts: { [key: string]: number } = {};
    const MAX_USAGE = 5;

    for (let i = 0; i < days * logsPerDay; i++) {
        // Create timestamp within the last `days` days
        const timestamp = new Date(now.getTime() - Math.random() * days * 24 * 60 * 60 * 1000);
        
        // Ensure logs are between 6 AM and current time (or end of day for past days)
        const dayStart = new Date(timestamp);
        dayStart.setHours(6, 0, 0, 0); // 6 AM MSK (UTC+3)
        const dayEnd = new Date(timestamp);
        if (dayEnd.toDateString() === now.toDateString()) {
             dayEnd.setTime(now.getTime());
        } else {
             dayEnd.setHours(23, 59, 59, 999);
        }

        if (timestamp < dayStart || timestamp > dayEnd) {
           const validTimeRange = dayEnd.getTime() - dayStart.getTime();
           if (validTimeRange <= 0) continue;
           timestamp.setTime(dayStart.getTime() + Math.random() * validTimeRange);
        }

        let generatedLog: Omit<LogEntry, 'id' | 'timestamp'> | null | (Omit<LogEntry, 'id' | 'timestamp'>)[] = null;
        
        const eventType = Math.random();

        try {
            if (eventType < 0.40) { // OOC Chat (40%)
                const template = getRandomElement(oocChatTemplates);
                const logKey = template.toString();
                if ((usageCounts[logKey] || 0) < MAX_USAGE) {
                    generatedLog = template(getRandomElement(mockPlayers));
                    usageCounts[logKey] = (usageCounts[logKey] || 0) + 1;
                }
            } else if (eventType < 0.45) { // OOC Dialogues (5%)
                if (mockPlayers.length > 1) {
                    const [p1, p2] = getTwoRandomPlayers(mockPlayers);
                    generatedLog = getRandomElement(oocDialogues)(p1, p2);
                }
            } else if (eventType < 0.70) { // RP Actions / СКО (25%)
                const template = getRandomElement(rpActionTemplates);
                generatedLog = template(getRandomElement(mockPlayers), getRandomElement(scpObjects));
            } else if (eventType < 0.85) { // Notifications & Diplomacy (15%)
                const template = getRandomElement(notificationTemplates);
                if (template.length === 0) { // no-arg templates
                     generatedLog = template(null as any, null as any);
                } else {
                     generatedLog = template(getRandomElement(mockPlayers), Math.random() > 0.5 ? "Синий код" : "Жёлтый код");
                }
            } else if (eventType < 0.95) { // Announcements (10%)
                const template = getRandomElement(announcementTemplates);
                 generatedLog = template(getRandomElement(mockPlayers), getRandomElement(scpObjects), getRandomElement(scpObjects));
            } else { // Connections, Kills, Damage (5%)
                 if (mockPlayers.length > 1) {
                    const [p1, p2] = getTwoRandomPlayers(mockPlayers);
                    const subType = Math.random();
                    if (subType < 0.4) generatedLog = getRandomElement(connectionTemplates)(p1);
                    else if (subType < 0.8) generatedLog = getRandomElement(killTemplates)(p1, p2);
                    else generatedLog = getRandomElement(damageTemplates)(p1, p2);
                }
            }
        } catch (e) {
            // Failsafe if template generation fails
            continue;
        }

        if (generatedLog) {
             if (Array.isArray(generatedLog)) {
                generatedLog.forEach(logPart => {
                     allLogs.push({ ...logPart, id: crypto.randomUUID(), timestamp });
                });
            } else {
                allLogs.push({
                    ...(generatedLog as Omit<LogEntry, 'id' | 'timestamp'>),
                    id: crypto.randomUUID(),
                    timestamp: timestamp,
                });
            }
        }
    }

    return allLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Generate a week of logs, with around 500 entries per day
export const historicalLogs: LogEntry[] = generateHistoricalLogs(7, 500);


// Mock data for player activity chart
export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setHours(new Date().getHours() - (i * 2));
    return {
        time: `${String(d.getHours()).padStart(2, '0')}:00`,
        players: Math.floor(Math.random() * (55 - 10 + 1)) + 10,
    };
}).reverse();
