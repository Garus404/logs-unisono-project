

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
    "Каплеглазик А", "Мясник", "Скромник", "Старик", "Авель", "Маска", "Кондор", "Амфибия", "Гибрид",
    "Хищник", "Ящерица", "Бессонник", "Домовой", "Чужой - Лицехват", "Огненный Человек", "Медвежонок",
    "Мимик", "Ионик", "Суккуб", "До-До", "Господин Рыба", "Желейка", "Чумной Доктор", "Хранитель",
    "Чужой", "Кошмар", "ИИ", "Соврана", "Голоса", "Пилигрим"
];

const organizations = ["Комплекс", "Сопротивление", "Длань-Змея", "ЭВС", "СОП"];

// --- TEMPLATES ---
const oocChatTemplates = [
    () => ({ type: 'CHAT' as LogType, details: `[OOC] бедный я, меня все пиздят и я бегаю на лоу хп` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] щас рейд?` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Кто ролл 100к` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Кто ролл 300k` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] кто ролл 500к??` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Как вас КОБРА УБИЛА` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Дура на кобре блять` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] лол` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] чек условия ионик` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Меня БРС связал` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] я боюсь совры и мясо они меня выебут пока я на нулевом тире` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] а чем причина?` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] помоги` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Да вы заебали км я щяс выйду и буду кримировать все что вижу` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] пиздец` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] герой на совре` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] продам все непонятные чертежи,стероиды,пропитал,одноразовую броню,шасалеоший,ампулаХС-598,частица енергии,сыр,волчий клык,пластик,пустые банки,батарейки,обломок маски,лицо скромника,кцунцит,ампулы регенетатина и броневерина,серу,сердца` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] продам 3 шторма за штуку 300к` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] мясо го ты скушаешь кондора` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Ионик имба убил деректора и психолога` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] хахах я случайно убил сори` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] на эваку не хватает` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] ЭХ почти ящера убили` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] кто там броники киллы покупал` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] z yt gjgjlfk` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] админы помогите я застрял!!!` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Продам методичку по ученым / 8 сфер ионика / 12 броников киллы / массу старика.` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] услышал` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] на все хватает` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] lelele` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] вы ему в рп скажите` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] каким боком` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] ну ящера нету` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] гибрид в кс` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] оффайте не хватает` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] все офаем` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] офаем` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Нельзя` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] верт прилетел?` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] О5 радуйся что кобра разъебал хвшку` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] я бы щас рельсой ебанул по верту)` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] я бы щяс тебе в ебло с лки дал)` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] похуй, взорвались бы` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] не здержевай имоцый` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] так хвшки нет` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] какбы` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] как ты` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] че врет` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] thanks sovra` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] создаю любые предметы на заказ писать в пм` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] союзы уберити` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] если сбежал гибрид это уже жёлтый` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Гибрид вернулся` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] куплю клык хищя и чип кобры` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] откат` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] верим` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] так это бинды` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] эрик дубрович убери пропы в интеркоме` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] да бля хран` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] кто в ролл пойдёт` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Маска Тагиллы +30 Сыра` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Ххаахахахахх` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] продам позвонки ящера за 15к` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] он макс 25к стоит` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Кто продаст маску тагилы` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] ВПН))` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] еды надо` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] я ебал` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] эвс мне верните` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] как снести яйцо` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] тужиться` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] мои сообщения видно?` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] рембрандт фри` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Чё так лагает` }),
    () => ({ type: 'CHAT' as LogType, details: `[OOC] Ало` }),
];

const oocDialogues = [
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[4], details: `[OOC] чужой руниа` }, { type: 'CHAT' as LogType, user: mockPlayers[5], details: `[OOC] руниа?` }, { type: 'CHAT' as LogType, user: mockPlayers[4], details: `[OOC] руина*` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[6], details: `[OOC] давно обновление было?` }, { type: 'CHAT' as LogType, user: mockPlayers[7], details: `[OOC] 2 недели назад вроде` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[8], details: `[OOC] бедный я, меня все пиздят` }, { type: 'CHAT' as LogType, user: mockPlayers[9], details: `[OOC] бедолага` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[10], details: `[OOC] z yt gjgjlfk` }, { type: 'CHAT' as LogType, user: mockPlayers[11], details: `[OOC] я не поподал` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[12], details: `[OOC] не офаем:)` }, { type: 'CHAT' as LogType, user: mockPlayers[13], details: `[OOC] все офаем` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[14], details: `[OOC] верт прилетел?` }, { type: 'CHAT' as LogType, user: mockPlayers[15], details: `[OOC] +` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[16], details: `[OOC] так давай` }, { type: 'CHAT' as LogType, user: mockPlayers[17], details: `[OOC] так у нас там бессмертие` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[18], details: `[OOC] кто в ролл пойдёт?` }, { type: 'CHAT' as LogType, user: mockPlayers[19], details: `[OOC] 100к?` }],
    () => [{ type: 'CHAT' as LogType, user: mockPlayers[20], details: `[OOC] грум лох` }, { type: 'CHAT' as LogType, user: mockPlayers[21], details: `[OOC] сам лох` }],
];

const rpActionTemplates = [
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} покинул комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} прибыл в комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] [VIP] Образец ${scp} покинул комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] [VIP] Образец ${scp} прибыл в комплекс` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} ломает ворота к.с ${getRandomElement(scpObjects)} ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} ломает дверь к.с ${getRandomElement(scpObjects)} ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Внимание Образец ${scp} сломал двери адм. зоны - тяж. зоны содержания` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Испытуемый ломает ворота блока Д ${Math.floor(Math.random() * 4) + 1}/5` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец Старик плавит куб Старика ${Math.floor(Math.random() * 5) + 1}/5` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Внимание Образец Старик расплавил куб Старика` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Образец ${scp} ломает большие ворота к.с ${scp} ${Math.floor(Math.random() * 5) + 1}/5` }),
    (p: Player, scp: string) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Внимание Образец ${scp} сломал большие ворота к.с ${scp}` }),
    (p: Player) => ({ type: 'RP' as LogType, user: p, details: `[СКО] Грузчик ломает ворота к.с ${getRandomElement(scpObjects)} 1/5` }),
];

const announcementTemplates = [
    (p: Player, scp1: string, scp2: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] О.${scp1} подавила О.${scp2}` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] ${scp} убит` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Голоса убиты` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Кондор убит` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Заказ выполнен` }),
    (p: Player, org: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] Нападение на ${org}, союз с враждебной фракцией` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [CO] О.${scp} жилает контаркт с км` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Объявление] [RP] штурмовик мог дезертировал причины: разочарования комплекса` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[CO] Образец ${scp} желает контракт с КМ.` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] О.${scp} запрашивает прогулку по кМ` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] Соврано призвала рса под контролем` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] PC Врывается в км` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] Тагилла с СОП` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] Образец ${scp} пошел на тушку.` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] О.${scp} эвакуриволся` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[CO] О.${scp} желает получить тело для дальнейшей помощи комплексу` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Пред ДЗ]->[КМ] Здрасствуйте, давайте союз?` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[КМ-ДЗ] Не могу сейчас выйти, попозже` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Пред ДЗ]->[КМ] Ок, подожду вас` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[км]-[дз] конечно` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[Пред ДЗ]->[КМ] Жду вас у базы ЭВС.` }),
    () => ({ type: 'ANNOUNCEMENT' as LogType, user: undefined, details: `[Объявление] Неизвестная организация вторгается в КМ.` }),
    () => ({ type: 'ANNOUNCEMENT' as LogType, user: undefined, details: `[Объявление] Неизвестная организация прекращает рейд в КМ. (Смерть предводителя)` }),
    (p: Player) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[RP] Пилигрим был подавлен своей же миной.` }),
    (p: Player, scp: string) => ({ type: 'ANNOUNCEMENT' as LogType, user: p, details: `[NRP] О.${scp} застрял в карманном измерении` }),
];

const notificationTemplates = [
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения Образец ${scp} покинул камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения [VIP] Образец ${scp} покинул камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения Образец ${scp} вернулся в камеру содержания. (${p.name})` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Оповещения [VIP] Образец ${scp} вернулся в камеру содержания. (${p.name})` }),
    (scp: string, org: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Образец ${scp} погиб. Контракт с Организацией ${org} аннулирован.` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация ${getRandomElement(organizations)} объявила войну Организации ${getRandomElement(organizations)}` }),
    () => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Главы Организации ${getRandomElement(organizations)} погибли. Все контракты, войны, союзы аннулированы.` }),
    (org: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация Комплекс разорвала союз с Организацией ${org}` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Дипломатия Организация Комплекс заключила контракт c Образец ${scp}` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `Интерком обьявил ${getRandomElement(["Синий код", "Жёлтый код", "Ядерная Боеголовка", "Красный код", "Сбор боевых единиц", "сбор бе на гейту б", "Отмена"])}` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: p, details: `Интерком: Сандальев Анатолий объявлен дефектным, обнулить` }),
    (p: Player) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Tasks | ${p.name} получил $${(Math.floor(Math.random() * 10) + 1) * 2500} за выполнение Никнейм задания` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Учёные Ученый класса C (${p.name}) должен привести испытуемых для Образец ${scp} (игрок ${getRandomElement(playerNames)}) ${Math.floor(Math.random() * 2) + 1} шт.` }),
    (p: Player, scp: string) => ({ type: 'NOTIFICATION' as LogType, user: undefined, details: `Учёные Образец ${scp} требует Испытуемых - ${Math.floor(Math.random() * 3) + 1} шт.` }),
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

// --- Single Log Generator Function ---
export function generateSingleRandomLog(players: Player[], timestamp: Date = new Date()): LogEntry | LogEntry[] | null {
    if (players.length === 0) players = mockPlayers;
    
    let generatedLog: Omit<LogEntry, 'id' | 'timestamp'> | null | (Omit<LogEntry, 'id' | 'timestamp'>)[] = null;
    const eventType = Math.random();
    let template: Function;

    try {
        if (eventType < 0.35) { // OOC Chat (35%)
            template = getRandomElement(oocChatTemplates);
            generatedLog = template();
            (generatedLog as LogEntry).user = getRandomElement(players);
        } else if (eventType < 0.40) { // OOC Dialogues (5%)
            if (players.length > 1) {
                template = getRandomElement(oocDialogues);
                generatedLog = template();
                 // Assign users to the dialogue parts
                if (Array.isArray(generatedLog)) {
                    generatedLog[0].user = getRandomElement(players);
                    generatedLog[1].user = getRandomElement(players.filter(p => p.name !== generatedLog![0].user!.name));
                }
            }
        } else if (eventType < 0.65) { // RP Actions / СКО (25%)
            const player = getRandomElement(players);
            const scp = getRandomElement(scpObjects);
            // Special rule for 'Старик'
            if (scp === "Старик" && Math.random() < 0.5) {
                 const step = Math.floor(Math.random() * 5) + 1;
                 if (step < 5) {
                    generatedLog = { type: 'RP', user: player, details: `[СКО] Образец Старик плавит куб Старика ${step}/5` };
                 } else {
                    generatedLog = [
                        { type: 'RP', user: player, details: `[СКО] Образец Старик плавит куб Старика 5/5` },
                        { type: 'RP', user: player, details: `[СКО] Внимание Образец Старик расплавил куб Старика` }
                    ];
                 }
            } else {
                template = getRandomElement(rpActionTemplates.filter(t => !t.toString().includes("Старик")));
                generatedLog = template(player, scp);
            }
        } else if (eventType < 0.85) { // Notifications & Diplomacy (20%)
            template = getRandomElement(notificationTemplates);
             if (template.length === 0) { // no-arg templates like war declaration
                generatedLog = template();
            } else if (template.toString().includes("погиб")) {
                generatedLog = template(getRandomElement(scpObjects), getRandomElement(organizations));
            }
            else {
                generatedLog = template(getRandomElement(players), getRandomElement(scpObjects));
            }
        } else if (eventType < 0.95) { // Announcements (10%)
            template = getRandomElement(announcementTemplates);
             generatedLog = template(getRandomElement(players), getRandomElement(scpObjects), getRandomElement(organizations));
        } else { // Connections, Kills, Damage (5%)
            if (players.length > 1) {
                const [p1, p2] = getTwoRandomPlayers(players);
                const subType = Math.random();
                if (subType < 0.3) generatedLog = getRandomElement(connectionTemplates)(p1);
                else if (subType < 0.6) generatedLog = getRandomElement(killTemplates)(p1, p2);
                else generatedLog = getRandomElement(damageTemplates)(p1, p2);
            }
        }
    } catch (e) {
        return null;
    }

    if (!generatedLog) return null;

    if (Array.isArray(generatedLog)) {
        return generatedLog.map(log => ({ ...log, id: crypto.randomUUID(), timestamp }));
    } else {
        return { ...(generatedLog as Omit<LogEntry, 'id'|'timestamp'>), id: crypto.randomUUID(), timestamp };
    }
}


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


            const generatedLog = generateSingleRandomLog(mockPlayers, timestamp);
            
            if (generatedLog) {
                if (Array.isArray(generatedLog)) {
                    allLogs.push(...generatedLog);
                } else {
                    allLogs.push(generatedLog);
                }
            }
        }
    }

    return allLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}


// Generate a week of logs, with around 1000 entries per day
export const historicalLogs: LogEntry[] = generateHistoricalLogs(7, 1000);


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
