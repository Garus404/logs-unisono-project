
import type { LogEntry, Player, LogType, PlayerActivity } from '@/lib/types';

// --- Helper Functions ---
function getRandomElement<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error("Cannot get random element from empty array");
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTwoRandomPlayers(players: Player[]): [Player, Player] {
    if (players.length < 2) {
      // Fallback if not enough players
      return [players[0] || mockPlayers[0], players[0] || mockPlayers[1]];
    }
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
    'Steve Rogers', 'Natasha Romanoff', 'Bruce Banner', 'Peter Parker',
    'Rin Hanasaku', 'Muhammad Sanchez', 'Вова Агутин', 'Kenny Haiden',
    'Chang Milos', 'Bober Namazov', 'Egor Caramora', 'Алексей Роялин',
    'Сэм Великий', 'Кейн Питормотов', 'Дмитрий Блэк', 'Каэдэ Чан',
    'Каха Лобенко', 'Гагари Роан', 'Андрей Каменев', 'Domas Harikov',
    'Сережа Бульбин', 'Роман Тимов', 'Саша Великий', 'Дима Сосискин',
  'Марк Теркаев', 'Артём Кудинов', 'Carl Kleen', 'Алик Пашмаков',
  'Бобр Чекист', 'Артем Солодкин', 'Тони Майлер', 'Иван Шаров',
  'Лоренсо Нэп', 'Алексей Эхов', 'Никита Семенек', 'Gabriel Show',
  'Леха Фастфудов', 'Галим Вискарь', 'Alexander Petrovich', 'Maksim Mercer',
  'Rydy Blackberry', 'Майкл Цуриков', 'Прометей Фелт', 'Алекс Тролген',
  'Илья Голубцов', 'Рома Крауц', 'Андрей Цыплин', 'Pasha Novikov', 'Степан Хорошов'
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
    "Желейка", "Чумной Доктор", "Хранитель", "Чужой", "Кошмар", "ИИ", "Соврана"
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
    (p1: Player, p2: Player) => [{ type: 'CHAT' as LogType, user: p1, details: `[OOC] z yt gjgjlfk` }, { type: 'CHAT' as LogType, user: p2, details: `[OOC] я не поподал` }],
];

const rpActionTemplates = [
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} покинул комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} прибыл в комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] [VIP] Образец ${scp} покинул комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] [VIP] Образец ${scp} прибыл в комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} ломает ворота к.с ${getRandomElement(scpObjects)} ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} ломает дверь к.с ${getRandomElement(scpObjects)} ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Внимание Образец ${scp} сломал двери адм. зоны - тяж. зоны содержания` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `Учёные Образец ${getRandomElement(scpObjects)} требует Испытуемых - ${Math.floor(Math.random() * 2) + 1} шт.` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Испытуемый ломает ворота блока Д ${Math.floor(Math.random() * 4) + 1}/5` }),
    // Special case for "Старик"
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец Старик плавит куб Старика ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Внимание Образец Старик расплавил куб Старика` }),
];

const announcementTemplates = [
    (p: Player, scp1: string, scp2: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] О.${scp1} подавила О.${scp2}` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] ${scp} убит` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Кондор убит` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Заказ выполнен` }),
    (p: Player, org: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Нападение на ${org}, союз с враждебной фракцией` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [CO] О.${scp} жилает контаркт с км` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] штурмовик мог дезертировал причины: разочарования комплекса` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[CO] Образец ${scp} желает контракт с КМ.` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] О.Господин Рыба запрашивает прогулку по кМ` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] Соврано призвала рса под контролем` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] PC Врывается в км` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] Тагилла с СОП` }),
];

const notificationTemplates = [
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения Образец ${scp} покинул камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения [VIP] Образец ${scp} покинул камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения Образец ${scp} вернулся в камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения [VIP] Образец ${scp} вернулся в камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Образец ${scp} погиб. Контракт с Организацией ${getRandomElement(organizations)} аннулирован.` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация ${getRandomElement(organizations)} объявила войну Организации ${getRandomElement(organizations)}` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Главы Организации ${getRandomElement(organizations)} погибли. Все контракты, войны, союзы аннулированы.` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация Комплекс разорвала союз с Организацией ${getRandomElement(organizations)}` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация Комплекс заключила контракт c Образец ${scp}` }),
    (p: Player, code: string) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `Интерком обьявил ${code}` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `Tasks | ${p.name} получил $${(Math.floor(Math.random() * 10) + 1) * 2500} за выполнение Никнейм задания` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Учёные Ученый класса C (${p.name}) должен привести испытуемых для Образец ${getRandomElement(scpObjects)} (игрок ${getRandomElement(playerNames)}) ${Math.floor(Math.random() * 2) + 1} шт.` }),
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
    const MAX_USAGE_PER_DAY = 5;

    for (let day = 0; day < days; day++) {
        const currentDay = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
        usageCounts[`day-${day}`] = {}; // Reset counts for each day

        for (let i = 0; i < logsPerDay; i++) {
            const timestamp = new Date(currentDay.getTime());
            
            // Set time between 6 AM and current time (or end of day for past days)
            const dayStart = new Date(timestamp);
            dayStart.setHours(6, 0, 0, 0); 
            const dayEnd = new Date(timestamp);
            if (day === 0) { // Today
                 dayEnd.setTime(now.getTime());
            } else { // Past days
                 dayEnd.setHours(23, 59, 59, 999);
            }

            const validTimeRange = dayEnd.getTime() - dayStart.getTime();
            if (validTimeRange <= 0) continue;
            timestamp.setTime(dayStart.getTime() + Math.random() * validTimeRange);


            let generatedLog: Omit<LogEntry, 'id' | 'timestamp'> | null | (Omit<LogEntry, 'id' | 'timestamp'>)[] = null;
            
            const eventType = Math.random();
            let template: Function;

            try {
                if (eventType < 0.35) { // OOC Chat (35%)
                    template = getRandomElement(oocChatTemplates);
                    const logKey = template.toString();
                    if ((usageCounts[`day-${day}`][logKey] || 0) < MAX_USAGE_PER_DAY) {
                        generatedLog = template(getRandomElement(mockPlayers));
                        usageCounts[`day-${day}`][logKey] = (usageCounts[`day-${day}`][logKey] || 0) + 1;
                    }
                } else if (eventType < 0.40) { // OOC Dialogues (5%)
                    if (mockPlayers.length > 1) {
                        const [p1, p2] = getTwoRandomPlayers(mockPlayers);
                        template = getRandomElement(oocDialogues);
                        generatedLog = template(p1, p2);
                    }
                } else if (eventType < 0.65) { // RP Actions / СКО (25%)
                    const player = getRandomElement(mockPlayers);
                    const scp = getRandomElement(scpObjects);
                    // Special rule for 'Старик'
                    if (scp === 'Старик' && Math.random() < 0.3) {
                         template = getRandomElement([rpActionTemplates[9], rpActionTemplates[10]]);
                         generatedLog = template(player);
                    } else {
                        template = getRandomElement(rpActionTemplates.slice(0,9));
                        generatedLog = template(player, scp);
                    }
                } else if (eventType < 0.85) { // Notifications & Diplomacy (20%)
                    template = getRandomElement(notificationTemplates);
                    if (template.length === 0) { // no-arg templates
                        generatedLog = template(null as any, null as any);
                    } else {
                        generatedLog = template(getRandomElement(mockPlayers), Math.random() > 0.5 ? "Синий код" : "Жёлтый код");
                    }
                } else if (eventType < 0.95) { // Announcements (10%)
                    template = getRandomElement(announcementTemplates);
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
                const addLog = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
                     allLogs.push({ ...log, id: crypto.randomUUID(), timestamp });
                };

                if (Array.isArray(generatedLog)) {
                    generatedLog.forEach(addLog);
                } else {
                    addLog(generatedLog as Omit<LogEntry, 'id' | 'timestamp'>);
                }
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
    // Go back in 2-hour increments over 48 hours
    d.setHours(new Date().getHours() - (i * 2));
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    const hour = d.getHours();
    let players;

    // Simulate day/night cycle
    if (hour > 1 && hour < 8) { // Deep night
        players = Math.floor(Math.random() * 10) + 5; // 5-14 players
    } else if (hour >= 8 && hour < 15) { // Morning/Day
        players = Math.floor(Math.random() * 20) + 15; // 15-34 players
    } else { // Peak hours (evening)
        players = Math.floor(Math.random() * 25) + 30; // 30-54 players
    }
    
    return {
        time: `${String(hour).padStart(2, '0')}:00`,
        players: players,
    };
}).reverse();

    