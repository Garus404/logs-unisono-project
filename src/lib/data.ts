
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
    'Василий Ковров', 'Никита Рамашкинов', 'Майкл Суриков', 'Envy Safone', 'Sergey Bulbа', 'Майк Грин',
    'Егор Кидалов', 'Валера Святославович', 'Вася Пипеткин', 'Андрей Дангиев', 'Marco Blackberry',
    'Roman Blackberry', 'Магомед Лопухов', 'Андрей Серпов', 'Artem Metl', 'Джон Розз', 'Lot Tery',
    'Платон Муратов', 'Chill Ketpyv', 'Sasha Naval', 'Gektor Kleen', 'Make Show', 'Margo Solairova',
    'Paul Pupkovich', 'Дмитрий Карасев', 'Фёдор Круглов', 'Бони Пимпс', 'Андрей Сырников', 'Тайлер Перден',
    'Дмитрий Будько', 'Макс Мортен', 'Roma Novikov', 'Дима Базанов', 'Гена Перов', 'Kenjaku Noritoshi',
    'Ника Фамилова', 'Alexander Georgovich', 'Alex Tuareg', 'Muhammad Sanchez', 'Глеб Великий', 'Oleg Fantom',
    'Tolyan Chernov', 'Данил Русокович', 'Clifford Hoegaarden', 'Максим Барад', 'Abbadon Blackberry',
    'Кирилл Яндовицкий', 'Maik Blackberry', 'Томас Полсон', 'Андрей Бек', 'Джон Майс', 'Саймон Дайс',
    'Никита Маслов', 'Минор Минорыч', 'Ярик Великий', 'Артём Сырный'
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

const findUser = (name: string) => {
    let user = mockPlayers.find(p => p.name === name);
    if (!user) {
        user = {
            name,
            score: Math.floor(Math.random() * 200),
            time: Math.floor(Math.random() * 3000),
            timeFormatted: 'mock',
            ping: Math.floor(Math.random() * 100),
            kills: Math.floor(Math.random() * 50),
            timeHours: 0,
            steamId: `STEAM_0:${Math.random() > 0.5 ? 1 : 0}:${Math.floor(Math.random() * 100000000)}`,
        };
        mockPlayers.push(user);
    }
    return user;
};


const hardcodedLogs: Partial<LogEntry>[] = [
  { timestamp: new Date('2024-07-25T17:56:00'), type: 'RP', user: findUser('Иван Дмитревич'), details: '[СКО] Образец Амфибия прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:56:00'), type: 'RP', user: findUser('Томас Полсон'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 4/5' },
  { timestamp: new Date('2024-07-25T17:55:00'), type: 'RP', user: findUser('Андрей Бек'), details: '[СКО] Образец Медвежонок ломает ворота к.с Медвежонка 3/5' },
  { timestamp: new Date('2024-07-25T17:55:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска потеряло тело возле бессоников и желает контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 2/5' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'CHAT', user: findUser('Alexander Georgovich'), details: '[OOC] безопасных дак-же вусс' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'CHAT', user: findUser('Clifford Hoegaarden'), details: '[OOC] у тебя эвака а ты безопасных вусаешь найс разум' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Образец Старик плавит куб Старика 5/5' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Внимание Образец Старик расплавил куб Старика' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'RP', user: findUser('Кирилл Яндовицкий'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 4/5' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Старик покинул камеру содержания. (Максим Барад)' },
  { timestamp: new Date('2024-07-25T17:54:00'), type: 'ANNOUNCEMENT', user: findUser('Maik Blackberry'), details: '[CO] O.Каплеглазик Б желает эвакуацию' },
  { timestamp: new Date('2024-07-25T17:53:00'), type: 'RP', user: findUser('Maik Blackberry'), details: '[СКО] Образец Каплеглазик Б прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:53:00'), type: 'RP', user: findUser('Бони Пимпс'), details: '[СКО] Образец Мимик ломает Герметичные ворота правого отсека легкой зоны 3/5' },
  { timestamp: new Date('2024-07-25T17:53:00'), type: 'RP', user: findUser('Томас Полсон'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 3/5' },
  { timestamp: new Date('2024-07-25T17:53:00'), type: 'ANNOUNCEMENT', user: findUser('Maik Blackberry'), details: '[CO] O.Каплеглазик Б желает эвакуацию' },
  { timestamp: new Date('2024-07-25T17:53:00'), type: 'ANNOUNCEMENT', user: findUser('Kenjaku Noritoshi'), details: '(RP) Заказ на образец ящер был выполнен!' },
  { timestamp: new Date('2024-07-25T17:52:00'), type: 'CHAT', user: findUser('Никита Маслов'), details: '[OOC] подаш ?' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Вася Пипеткин'), details: '[OOC] кстати есть варик создать рп в профе крысы?' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] я застрял' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Никита Маслов'), details: '[OOC] укаво есть клык волка ?' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Margo Solairova'), details: '[OOC] у меня' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Степан Хорошов'), details: '[OOC] примите жб' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] ТОЧНО В ЦЕЛЬ' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] -' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Саймон Дайс'), details: '[СКО] Образец Бессонник прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 2/5' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Андрей Бек'), details: '[СКО] Образец Медвежонок ломает ворота к.с Медвежонка 2/5' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] НУ ВЫХОДИ' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Кирилл Яндовицкий'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 3/5' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] у нас спавн' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'ANNOUNCEMENT', user: findUser('Lot Tery'), details: '[RP] Жирный умер' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'NOTIFICATION', details: 'Интерком Alexander Georgovich: ОПН 9м даю исправить по состоянии комплексе дальше яб' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] ПОД ВАМИ ЖИРНАЯ ХУИНЯ' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Образец Старик плавит куб Старика 4/5' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] впн все' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Rydy Blackberry'), details: '[OOC] ОПН ЗАСТРЯЛИ' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Бек'), details: '[CO]О.Медвежонок желает прогулку по блоку испытуемых' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] УРААА' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 1/5' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] опну пизда' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:51:00'), type: 'CHAT', user: findUser('Ярик Великий'), details: '[OOC] авель 3 тира не успокаевается' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] обычные' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Мясник покинул камеру содержания. (Толя Дальнобой)' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска покинул камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'NOTIFICATION', details: 'Интерком Alexander Georgovich: База эвс' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Внимание Образец Мясник сломал ворота к.с Мясника' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Образец Мясник ломает ворота к.с Мясника 5/5' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'NOTIFICATION', details: 'Интерком (Alexander Georgovich) обьявил Эвакуация' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] ящер ты слишком жир чтобы по мостам ходить' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой - Лицехват покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'RP', user: findUser('Томас Полсон'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 2/5' },
  { timestamp: new Date('2024-07-25T17:50:00'), type: 'ANNOUNCEMENT', user: findUser('Maik Blackberry'), details: '[RP] я успокоил авеля но меня убил бек 2' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска вернулся в камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'CHAT', user: findUser('Никита Семенек'), details: '[OOC] нет' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] ЛОЛ. че за баги' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска покинул камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'CHAT', user: findUser('Джон Майс'), details: '[OOC] образцы, делайте запросы' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска вернулся в камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:49:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] мдаа' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска покинул камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 1/5' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'RP', user: findUser('Кирилл Яндовицкий'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 2/5' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] [VIP] Образец Хищник прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'CHAT', user: findUser('Clifford Hoegaarden'), details: '[OOC] когда нибудь' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'CHAT', user: findUser('Галим Вискарь'), details: '[OOC] когда след раз будут скидки на донат?' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Образец Старик плавит куб Старика 3/5' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Кошмар ломает дверь к.с Чужого 2/5' },
  { timestamp: new Date('2024-07-25T17:48:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает дверь к.с Чужого 1/5' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска желает заключить контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'CHAT', user: findUser('Maksim Mercer'), details: '[OOC] хран прости ахахаха' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска вернулся в камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'RP', user: findUser('Андрей Бек'), details: '[СКО] Образец Медвежонок ломает ворота к.с Медвежонка 1/5' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой ЗАпрашивает РАзрешение на вход на територию ЭВС' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'RP', user: findUser('Андрей Бек'), details: '[СКО] Образец Медвежонок прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'RP', user: findUser('Томас Полсон'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 1/5' },
  { timestamp: new Date('2024-07-25T17:47:00'), type: 'RP', user: findUser('Томас Полсон'), details: '[СКО] Образец Гибрид прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'CHAT', user: findUser('Margo Solairova'), details: '[OOC] продам лку за 180к, клыки волка по 25к' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'RP', user: findUser('Maik Blackberry'), details: '[СКО] Образец До-До покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска покинул камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] Tolyan Chernov нет' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'ANNOUNCEMENT', user: findUser('Кирилл Яндовицкий'), details: '(СО) огненый хочет коеиракт' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'RP', user: findUser('Валера Святославович'), details: '[СКО] Внимание Образец Маска сломал двери к.с Маски' },
  { timestamp: new Date('2024-07-25T17:46:00'), type: 'RP', user: findUser('Валера Святославович'), details: '[СКО] Образец Маска ломает двери к.с Маски 5/5' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'CHAT', user: findUser('Maksim Mercer'), details: '[OOC] дирик легенда' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'NOTIFICATION', details: 'Интерком Lot Tery вызвал отряд "Последняя надежда"' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'NOTIFICATION', details: 'Интерком (Lot Tery) обьявил Красный код' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'RP', user: findUser('Maik Blackberry'), details: '[СКО] Образец До-До прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'RP', user: findUser('Кирилл Яндовицкий'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 1/5' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Огненный Человек покинул камеру содержания. (Кирилл Яндовицкий)' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой ЗАпрашивает РАзрешение на вход на територию Длань-Змеи' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'CHAT', user: findUser('Лоренсо Нэп'), details: '[OOC] Да' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Образец Старик плавит куб Старика 2/5' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'CHAT', user: findUser('Ярик Великий'), details: '[OOC] мимик может находится в д блоке без контракта?' },
  { timestamp: new Date('2024-07-25T17:45:00'), type: 'CHAT', user: findUser('Maksim Mercer'), details: '[OOC] кстати ты обязан опн вызвать' },
  { timestamp: new Date('2024-07-25T17:44:00'), type: 'NOTIFICATION', details: 'Оповещения [VIP] Образец Кошмар покинул камеру содержания. (Алекс Тролген)' },
  { timestamp: new Date('2024-07-25T17:44:00'), type: 'NOTIFICATION', details: 'Учёные Ученый класса C (Степан Хорошов) должен привести испытуемых для Образец Огненный Человек (Кирилл Яндовицкий) 1 шт.' },
  { timestamp: new Date('2024-07-25T17:44:00'), type: 'NOTIFICATION', details: 'Интерком Alexander Georgovich: всему Б.Е прибыть база эвс эвак же идёт а даже опн если вызву все умрут' },
  { timestamp: new Date('2024-07-25T17:44:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Кошмар прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:44:00'), type: 'NOTIFICATION', details: 'Учёные Образец Огненный Человек требует Испытуемых - 1 шт. (Кирилл Яндовицкий)' },
  { timestamp: new Date('2024-07-25T17:44:00'), type: 'RP', user: findUser('Кирилл Яндовицкий'), details: '[СКО] Образец Огненный Человек прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:43:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] кина не будет' },
  { timestamp: new Date('2024-07-25T17:43:00'), type: 'RP', user: findUser('Валера Святославович'), details: '[СКО] Образец Маска ломает двери к.с Маски 4/5' },
  { timestamp: new Date('2024-07-25T17:43:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой - Лицехват покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:43:00'), type: 'RP', user: findUser('Maksim Mercer'), details: '[СКО] Образец Авель ломает дверь Интеркома 2/5' },
  { timestamp: new Date('2024-07-25T17:42:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска желает заключить контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:42:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает дверь Интеркома 1/5' },
  { timestamp: new Date('2024-07-25T17:41:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Ионик' },
  { timestamp: new Date('2024-07-25T17:41:00'), type: 'NOTIFICATION', details: 'Оповещения [VIP] Образец Хищник покинул камеру содержания. (Алекс Тролген)' },
  { timestamp: new Date('2024-07-25T17:41:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] Внимание [VIP] Образец Хищник сломал ворота к.с Хищника' },
  { timestamp: new Date('2024-07-25T17:41:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 5/5' },
  { timestamp: new Date('2024-07-25T17:41:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Скромник покинул камеру содержания. (Роман Тимов)' },
  { timestamp: new Date('2024-07-25T17:41:00'), type: 'RP', user: findUser('Domas Harikov'), details: '[СКО] Образец Ионик прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:40:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Внимание Образец Скромник сломал двери к.с Скромника' },
  { timestamp: new Date('2024-07-25T17:40:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Образец Скромник ломает двери к.с Скромника 5/5' },
  { timestamp: new Date('2024-07-25T17:40:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает уличные большие ворота А 1/5' },
  { timestamp: new Date('2024-07-25T17:40:00'), type: 'RP', user: findUser('Валера Святославович'), details: '[СКО] Образец Маска ломает двери к.с Маски 3/5' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'CHAT', user: findUser('Максим Барад'), details: '[OOC] sorr' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Образец Старик плавит куб Старика 1/5' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'ANNOUNCEMENT', user: findUser('Максим Барад'), details: '[RP ] Бунт провален глава был убит СБшником.' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Внимание Образец Гибрид сломал внутренние ворота А' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает внутренние ворота А 5/5' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'CHAT', user: findUser('Максим Барад'), details: '[OOC] Сорри д класс' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'RP', user: findUser('Максим Барад'), details: '[СКО] Образец Старик прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'NOTIFICATION', details: 'Интерком Alexander Georgovich: База эвс, в данный случии опн не получится вызвать за многосбежасшими образцов' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает внутренние ворота А 4/5' },
  { timestamp: new Date('2024-07-25T17:39:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает внутренние ворота А 4/5' },
  { timestamp: new Date('2024-07-25T17:38:00'), type: 'NOTIFICATION', details: 'Интерком (Alexander Georgovich) обьявил Эвакуация' },
  { timestamp: new Date('2024-07-25T17:38:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] нет' },
  { timestamp: new Date('2024-07-25T17:38:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 4/5' },
  { timestamp: new Date('2024-07-25T17:38:00'), type: 'CHAT', user: findUser('Галим Вискарь'), details: '[OOC] надо еще доказать что бинд есть' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска желает заключить контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Каэдэ Чан'), details: '[OOC] какой тебе бинд МАЛЬЧИК' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Rin Hanasaku'), details: '[OOC] это наказуемо' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Rin Hanasaku'), details: '[OOC] Нельзя использовать бинды на взятие ролей' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Abbadon Blackberry'), details: '[OOC] (((' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Каэдэ Чан'), details: '[OOC] ваххваха' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Margo Solairova'), details: '[OOC] нельзя' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Комплекс погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Abbadon Blackberry'), details: '[OOC] Кхм' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Фёдор Круглов'), details: '[OOC] как контратаковать крысой' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Abbadon Blackberry'), details: '[OOC] Дайте бинд на то что бы брать БРСа' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт Длань-Змеи' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Образец Скромник ломает двери к.с Скромника 4/5' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'RP', user: findUser('Maksim Mercer'), details: '[СКО] Образец Авель ломает дверь Интеркома 1/5' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'CHAT', user: findUser('Ярик Великий'), details: '[OOC] авель кошмарит род рсов' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'ANNOUNCEMENT', user: findUser('Maksim Mercer'), details: '[RP] Авель убил РС-а.' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'ANNOUNCEMENT', user: findUser('Максим Барад'), details: '[RP ] Д класс объявил бунт глава Маским БАРАД.' },
  { timestamp: new Date('2024-07-25T17:37:00'), type: 'ANNOUNCEMENT', details: '[Объявление]: Неизвестная организация прекращает рейд в КМ. (Смерть предводителя)' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] база' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'ANNOUNCEMENT', user: findUser('Alexander Georgovich'), details: '[RP] PC Врывается в км' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Alexander Georgovich'), details: '[OOC] откат' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'ANNOUNCEMENT', user: findUser('Alexander Georgovich'), details: '[RP] Врывается в км' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] как же это мемно' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Paul Pupkovich'), details: '[OOC] вот и вернули ' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'RP', user: findUser('Данил Русокович'), details: '[СКО] Образец Чумной Доктор покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'RP', user: findUser('Валера Святославович'), details: '[СКО] Образец Маска ломает двери к.с Маски 2/5' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] ГИБРИД МЕДДЛЕННО ПЛАВАЕТ АХА' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает внутренние ворота А 3/5' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Maksim Mercer'), details: '[OOC] пон' },
  { timestamp: new Date('2024-07-25T17:36:00'), type: 'CHAT', user: findUser('Paul Pupkovich'), details: '[OOC] умер изза бага' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Комплекс погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Margo Solairova'), details: '[OOC] окак' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Каэдэ Чан'), details: '[OOC] я' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Maksim Mercer'), details: '[OOC] а кто рс вызвал?' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Alexander Georgovich'), details: '[OOC] откат' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'ANNOUNCEMENT', user: findUser('Alexander Georgovich'), details: '[RP] Врывается в км' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Каэдэ Чан'), details: '[OOC] xd' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'RP', user: findUser('Данил Русокович'), details: '[СКО] Образец Чумной Доктор ломает двери к.с Чумного доктора 1/5' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Rydy Blackberry'), details: '[OOC] [Объявление]: Неизвестная организация вторгается в Margo.' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'ANNOUNCEMENT', user: findUser('Alexander Georgovich'), details: '[RP] PC Прибыл на жалкий мир' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Каэдэ Чан'), details: '[OOC] xd' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'RP', user: findUser('Данил Русокович'), details: '[СКО] Образец Чумной Доктор прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'NOTIFICATION', details: 'Дипломатия Образец Ионик погиб. Контракт с Организацией Комплекс аннулирован.' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] бож ты че' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 3/5' },
  { timestamp: new Date('2024-07-25T17:35:00'), type: 'ANNOUNCEMENT', details: '[Объявление]: Неизвестная организация вторгается в КМ.' },
  { timestamp: new Date('2024-07-25T17:34:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска получила новое тело и желает заключить контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:34:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Образец Скромник ломает двери к.с Скромника 3/5' },
  { timestamp: new Date('2024-07-25T17:34:00'), type: 'RP', user: findUser('Alex Tuareg'), details: '[СКО] Образец Каплеглазик Б покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:33:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Ионик' },
  { timestamp: new Date('2024-07-25T17:33:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Образец Мясник ломает ворота к.с Мясника 4/5' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'RP', user: findUser('Валера Святославович'), details: '[СКО] Образец Маска ломает двери к.с Маски 1/5' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'RP', user: findUser('Ника Фамилова'), details: '[СКО] Образец До-До покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'CHAT', user: findUser('Tolyan Chernov'), details: '[OOC] Дк фри' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 2/5' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает вторые ворота А 2/5' },
  { timestamp: new Date('2024-07-25T17:32:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает вторые ворота А 1/5' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска получила тело и желает заключить контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] я на 2 этаже' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] ИИ помоги домовому побратски' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Akakii Akakievich'), details: '[OOC] он 2 раза вылез так еще и стрелял хотя рейд не кончился весь эвс видел' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Маска вернулся в камеру содержания. (Валера Святославович)' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Oleg Fantom'), details: '[OOC] че за шторм' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] блицкриг' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Образец Скромник ломает двери к.с Скромника 2/5' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Margo Solairova'), details: '[OOC] продам шторм за 280к, 2 лки по 180к, клыки волка по 25к.' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Oleg Fantom'), details: '[OOC] он меня блять убил когда я за рейнджера' },
  { timestamp: new Date('2024-07-25T17:31:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] правила для слабых' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'CHAT', user: findUser('Akakii Akakievich'), details: '[OOC] тяж соп 2 раза правила новой жизни и после преследуешь эвс ты правла точно читал' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Старик покинул камеру содержания. (Alexander Georgovich)' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой - Лицехват покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Комплекс погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] нет' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'RP', user: findUser('Artem Metl'), details: '[СКО] Образец ИИ прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'CHAT', user: findUser('Глеб Великий'), details: '[OOC] вступайте в соп' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Каплеглазик Б покинул камеру содержания. (Alex Tuareg)' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'RP', user: findUser('Maksim Mercer'), details: '[СКО] Образец Авель ломает дверь Интеркома 3/5' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Каплеглазик А покинул камеру содержания. (Muhammad Sanchez)' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Каплеглазик Б вернулся в камеру содержания. (Alex Tuareg)' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'RP', user: findUser('Alexander Georgovich'), details: '[СКО] Образец Старик плавит куб Старика 1/5' },
  { timestamp: new Date('2024-07-25T17:30:00'), type: 'CHAT', user: findUser('Alexander Georgovich'), details: '[OOC] ёбаный рот та' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] кто?' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Alexander Georgovich'), details: '[СКО] Образец Старик прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Каплеглазик Б покинул камеру содержания. (Alex Tuareg)' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Alexander Georgovich'), details: '[СКО] Образец ИИ покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Домовой покинул камеру содержания. (Андрей Серпов)' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Желейка покинул камеру содержания. (Минор Минорыч)' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает дверь Интеркома 2/5' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'NOTIFICATION', details: 'Оповещения Образец До-До покинул камеру содержания. (Ника Фамилова)' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] бекЯ стреля в меня но не в гибрида' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает дверь Интеркома 1/5' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Хищник ломает ворота к.с Хищника 1/5' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Хищник прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Alex Tuareg'), details: '[СКО] Образец Каплеглазик Б прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Roman Blackberry'), details: '[СКО] Образец Старик покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'RP', user: findUser('Muhammad Sanchez'), details: '[СКО] Образец Каплеглазик А прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:29:00'), type: 'CHAT', user: findUser('Roman Blackberry'), details: '[OOC] ладно я наигрался на дедушке) ловите' },
  { timestamp: new Date('2024-07-25T17:28:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт с КМ*' },
  { timestamp: new Date('2024-07-25T17:28:00'), type: 'ANNOUNCEMENT', user: findUser('Ника Фамилова'), details: '(RP) Птичка Додо хочет в д блок' },
  { timestamp: new Date('2024-07-25T17:28:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:28:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Ионик' },
  { timestamp: new Date('2024-07-25T17:28:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Образец Скромник ломает двери к.с Скромника 1/5' },
  { timestamp: new Date('2024-07-25T17:28:00'), type: 'RP', user: findUser('Роман Тимов'), details: '[СКО] Образец Скромник прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:27:00'), type: 'ANNOUNCEMENT', user: findUser('Лоренсо Нэп'), details: '[RP] Чужой сожжён, но поколение их ещё нет' },
  { timestamp: new Date('2024-07-25T17:27:00'), type: 'RP', user: findUser('Alexander Georgovich'), details: '[СКО] Образец ИИ прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:27:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Сопротивление погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:27:00'), type: 'ANNOUNCEMENT', user: findUser('Дмитрий Карасев'), details: '[rp] Чужой сожжен' },
  { timestamp: new Date('2024-07-25T17:27:00'), type: 'RP', user: findUser('Domas Harikov'), details: '[СКО] Образец Ионик прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:27:00'), type: 'RP', user: findUser('Kenjaku Noritoshi'), details: '[СКО] Образец ИИ покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:26:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] Откройте домового Ну Ребзя ПЖ' },
  { timestamp: new Date('2024-07-25T17:26:00'), type: 'ANNOUNCEMENT', user: findUser('Ника Фамилова'), details: '(RP) Птичка Додо хочет в д блок' },
  { timestamp: new Date('2024-07-25T17:26:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Огненный Человек' },
  { timestamp: new Date('2024-07-25T17:26:00'), type: 'RP', user: findUser('Kenjaku Noritoshi'), details: '[СКО] Образец ИИ прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:26:00'), type: 'RP', user: findUser('Ника Фамилова'), details: '[СКО] Образец До-До прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:26:00'), type: 'CHAT', user: findUser('Артём Сырный'), details: '[OOC] Ну да, 15 типов рейдят одного, мужики' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] Откройте домового ПЖ' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'ANNOUNCEMENT', user: findUser('Egor Caramora'), details: '[RP] ЭВС заканчивают рейд причина успех в рейде' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'ANNOUNCEMENT', user: findUser('Kenjaku Noritoshi'), details: '(RP) Нету глав' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] трагедия в 3-х актах' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Кошмар ломает Дверь КПП Ворот А 4/5' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] На вас написали жалобу! -> PM from Chill Ketpyv: а чё мы уворачиваемся? -> Игрок вышел из игры.' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает внутренние ворота А 3/5' },
  { timestamp: new Date('2024-07-25T17:25:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс разорвала союз с Организацией Длань-Змея' },
  { timestamp: new Date('2024-07-25T17:24:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] ХАХПХАХПАП' },
  { timestamp: new Date('2024-07-25T17:24:00'), type: 'CHAT', user: findUser('Domas Harikov'), details: '[OOC] Цели/Задачи - уничтожить всех учёных, роботов и Хищника.' },
  { timestamp: new Date('2024-07-25T17:24:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] Откройте домового ПЖ' },
  { timestamp: new Date('2024-07-25T17:24:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] фокус' },
  { timestamp: new Date('2024-07-25T17:24:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] опа' },
  { timestamp: new Date('2024-07-25T17:24:00'), type: 'CHAT', user: findUser('Ярик Великий'), details: '[OOC] спасибо' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Медвежонок покинул камеру содержания. (Андрей Сырников)' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'CHAT', user: findUser('Oleg Fantom'), details: '[OOC] чужой только 1 зону знает это административная' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'CHAT', user: findUser('Ярик Великий'), details: '[OOC] лот тери убери пропы из спавна дирика' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Домовой вернулся в камеру содержания. (Андрей Серпов)' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает дверь Интеркома 2/5' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'CHAT', user: findUser('Галим Вискарь'), details: '[OOC] у т' },
  { timestamp: new Date('2024-07-23:00'), type: 'CHAT', user: findUser('Галим Вискарь'), details: '[OOC] чужой зач ты дальше убиваешь,тебе же сказали ты ток ученых убиваешь' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] УРА' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'RP', user: findUser('Минор Минорыч'), details: '[СКО] Образец Желейка прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'RP', user: findUser('Макс Мортен'), details: '[СКО] Образец Амфибия покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:23:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Господин Рыба' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'ANNOUNCEMENT', user: findUser('Чад Пепел'), details: '[RP] Ионик и совра сожраны' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] куплю клыки волка и броник киллы' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Gektor Kleen'), details: '[OOC] bb all' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'NOTIFICATION', details: 'Учёные Образец Медвежонок требует Испытуемых - 2 шт. (Андрей Сырников)' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Лоренсо Нэп'), details: '[OOC] Захват XV' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Внимание Образец Огненный Человек расплавил Ворота к.с Огненного Человека' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 5/5' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] новичек' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Домовой покинул камеру содержания. (Андрей Серпов)' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'ANNOUNCEMENT', user: findUser('Egor Caramora'), details: '[RP] ЭВС рейдить базу СОП причина XV' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Chill Ketpyv'), details: '[OOC] забей он новичёк' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Галим Вискарь'), details: '[OOC] ты ток ученых убиваешь' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] куплю клыки волка по 40к' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'NOTIFICATION', details: 'Дипломатия Образец Ионик погиб. Контракт с Организацией Комплекс аннулирован.' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] Всмысле?' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'RP', user: findUser('Андрей Сырников'), details: '[СКО] Образец Медвежонок прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Envy Safone'), details: '[OOC] ????' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'CHAT', user: findUser('Галим Вискарь'), details: '[OOC] чужой зач убил?' },
  { timestamp: new Date('2024-07-25T17:22:00'), type: 'RP', user: findUser('Андрей Дангиев'), details: '[СКО] Образец ИИ покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:21:00'), type: 'RP', user: findUser('Андрей Дангиев'), details: '[СКО] Образец ИИ прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:21:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Длань-Змея заключила союз с Организацией Комплекс' },
  { timestamp: new Date('2024-07-25T17:21:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Внимание Образец Ящерица сломал вторые ворота А' },
  { timestamp: new Date('2024-07-25T17:21:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает вторые ворота А 5/5' },
  { timestamp: new Date('2024-07-25T17:21:00'), type: 'ANNOUNCEMENT', user: findUser('Chill Ketpyv'), details: '[RP] PC пошёл на тушку' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] все за агрились' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] куплю клыки волка по 40к' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] Откройте домового ПЖ' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] куплю клыки волка' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'NOTIFICATION', details: 'Оповещения [VIP] Образец Кошмар покинул камеру содержания. (Алекс Тролген)' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Кошмар прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] нет*' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] нети' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Макс Мортен'), details: '[OOC] ты?' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'RP', user: findUser('Андрей Серпов'), details: '[СКО] Образец Домовой прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] я' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает дверь Интеркома 3/5' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'RP', user: findUser('Maksim Mercer'), details: '[СКО] Образец Авель ломает дверь Интеркома 2/5' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'CHAT', user: findUser('Макс Мортен'), details: '[OOC] кто сетку на базе эвс ставил?' },
  { timestamp: new Date('2024-07-25T17:20:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Образец Мясник ломает ворота к.с Мясника 3/5' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'ANNOUNCEMENT', user: findUser('Kenjaku Noritoshi'), details: '[05]-----[ Длань змея] Здраствуйте, я не против прощу пройдите на базу эвс' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] ща приду' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 4/5' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] гей парад у обр щя был' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] бля, яб нахуй' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Ионик' },
  { timestamp: new Date('2024-07-25T17:19:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой - Лицехват покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:18:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] ионик фри был' },
  { timestamp: new Date('2024-07-25T17:18:00'), type: 'RP', user: findUser('Егор Кидалов'), details: '[СКО] Образец Ионик прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает дверь Интеркома 1/5' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'CHAT', user: findUser('Дмитрий Будько'), details: '[Группа] У нас нету туалетов' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'CHAT', user: findUser('Дмитрий Будько'), details: '[Группа] Давайте БУНТ!' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'CHAT', user: findUser('Дмитрий Будько'), details: '[Группа] БУНТ!!!!' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Мимик покинул камеру содержания. (Бони Пимпс)' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'ANNOUNCEMENT', user: findUser('Майк Грин'), details: '[ГУ-ДЗ]==> [КМ] Желаете союз?' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'ANNOUNCEMENT', user: findUser('Дима Базанов'), details: '[RP] Найм выполнил заказ на убийство директора' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'RP', user: findUser('Гена Перов'), details: '[СКО] Образец Желейка покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'CHAT', user: findUser('Дима Базанов'), details: '[OOC] откат' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'NOTIFICATION', details: 'Оповещения [VIP] Образец Суккуб покинул камеру содержания. (Алекс Тролген)' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'ANNOUNCEMENT', user: findUser('Дима Базанов'), details: 'Найм выполнил заказ на убийство директора' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'CHAT', user: findUser('Сэм Великий'), details: '[OOC] скрома тебе на цель похуй?' },
  { timestamp: new Date('2024-07-25T17:17:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Образец Мясник ломает ворота к.с Мясника 2/5' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Ящерица покинул камеру содержания. (Чад Пепел)' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] Внимание [VIP] Образец Суккуб сломал двери к.с Суккуба' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 5/5' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Ящерица вернулся в камеру содержания. (Чад Пепел)' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'CHAT', user: findUser('Макс Мортен'), details: '[OOC] глава учёных дз ты где щас?' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Комплекс погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Ящерица покинул камеру содержания. (Чад Пепел)' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 3/5' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Внимание Образец Ящерица сломал ворота к.с Ящерицы' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает ворота к.с Ящерицы 5/5' },
  { timestamp: new Date('2024-07-25T17:16:00'), type: 'ANNOUNCEMENT', user: findUser('Roma Novikov'), details: '[RP] Рыцарь смерти врывается в км' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] и шотает меня' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] и он подрубает хуйню свою' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] я руку с мышки убрал' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс заключила контракт c Образец Господин Рыба' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'RP', user: findUser('Тайлер Перден'), details: '[СКО] Образец ИИ покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает ворота к.с Ящерицы 4/5' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Дмитрий Будько'), details: '[OOC] Gegjr' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] ну мы с ним базарили' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Сэм Великий'), details: '[OOC] неа, он с соврой пиздился' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Майк Грин'), details: '[OOC] Это тебе не за ГУшкой бегать))' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] +' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Амфибия покинул камеру содержания. (Макс Мортен)' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] нет' },
  { timestamp: new Date('2024-07-25T17:15:00'), type: 'RP', user: findUser('Бони Пимпс'), details: '[СКО] Образец Мимик прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:14:00'), type: 'CHAT', user: findUser('Каэдэ Чан'), details: '[OOC] он фулл был' },
  { timestamp: new Date('2024-07-25T17:14:00'), type: 'ANNOUNCEMENT', user: findUser('Gektor Kleen'), details: '[RP] Из портала тьмы вышел Рыцарь Смерти без контроля' },
  { timestamp: new Date('2024-07-25T17:14:00'), type: 'CHAT', user: findUser('Сэм Великий'), details: '[OOC] нуу рс покоцанный так что неудивительно' },
  { timestamp: new Date('2024-07-25T17:14:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Дангиев'), details: '[RP] РСа наебнул авель с одного удара.' },
  { timestamp: new Date('2024-07-25T17:14:00'), type: 'CHAT', user: findUser('Сэм Великий'), details: '[Группа] no' },
  { timestamp: new Date('2024-07-25T17:14:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает ворота к.с Ящерицы 3/5' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'CHAT', user: findUser('Дмитрий Будько'), details: '[Группа] Давайте сбежим' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'CHAT', user: findUser('Дмитрий Будько'), details: '[Группа] Ребята' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 4/5' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает ворота к.с Ящерицы 2/5' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Медвежонок покинул камеру содержания. (Андрей Сырников)' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'RP', user: findUser('Тайлер Перден'), details: '[СКО] Образец ИИ прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Дангиев'), details: '[RP] РС рейдит км' },
  { timestamp: new Date('2024-07-25T17:13:00'), type: 'RP', user: findUser('Андрей Сырников'), details: '[СКО] Образец Медвежонок прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:12:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Домовой покинул камеру содержания. (Андрей Серпов)' },
  { timestamp: new Date('2024-07-25T17:12:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Господин Рыба покинул камеру содержания. (Лоренсо Нэп)' },
  { timestamp: new Date('2024-07-25T17:12:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает ворота к.с Ящерицы 1/5' },
  { timestamp: new Date('2024-07-25T17:12:00'), type: 'CHAT', user: findUser('Лоренсо Нэп'), details: '[OOC] Мимику норм выходить Багом?' },
  { timestamp: new Date('2024-07-25T17:12:00'), type: 'CHAT', user: findUser('Андрей Серпов'), details: '[OOC] Откройте домового ПЖ' },
  { timestamp: new Date('2024-07-25T17:12:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 2/5' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Мимик покинул камеру содержания. (Бони Пимпс)' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Мимик вернулся в камеру содержания. (Бони Пимпс)' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'CHAT', user: findUser('Фёдор Круглов'), details: '[OOC] я выход с измерения деда впервые нашел' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Запрашивает прогулку по т.к' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Внимание Образец Ящерица сломал большие ворота к.с Ящерицы' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает большие ворота к.с Ящерицы 5/5' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Гибрид покинул камеру содержания. (Marco Blackberry)' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Внимание Образец Гибрид сломал ворота к.с Гибрида' },
  { timestamp: new Date('2024-07-25T17:11:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 5/5' },
  { timestamp: new Date('2024-07-25T17:10:00'), type: 'CHAT', user: findUser('Фёдор Круглов'), details: '[OOC] ахаххахааахаа' },
  { timestamp: new Date('2024-07-25T17:10:00'), type: 'RP', user: findUser('Илья Голубцов'), details: '[СКО] Образец ИИ покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:10:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:10:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Огненный Человек ломает Ворота к.с Огненного Человека 4/5' },
  { timestamp: new Date('2024-07-25T17:10:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 3/5' },
  { timestamp: new Date('2024-07-25T17:09:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает большие ворота к.с Ящерицы 3/5' },
  { timestamp: new Date('2024-07-25T17:09:00'), type: 'NOTIFICATION', user: findUser('Domas Harikov'), details: 'Интерком (Domas Harikov) обьявил Красный код' },
  { timestamp: new Date('2024-07-25T17:09:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает вторые ворота А 4/5' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] рс под контролем хмммм' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Запрашивает прогулку по т.к' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'ANNOUNCEMENT', user: findUser('Дмитрий Карасев'), details: '[CO] Спичка желает контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Запрашивает прогулку по км' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Образец Огненный Человек плавит Ворота к.с Огненного Человека 1/5' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Огненный Человек покинул камеру содержания. (Дмитрий Карасев)' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'CHAT', user: findUser('Paul Pupkovich'), details: '[OOC] марго афк монстр' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Длань-Змея погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:08:00'), type: 'RP', user: findUser('Дмитрий Карасев'), details: '[СКО] Образец Огненный Человек прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт с ДЗ' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'CHAT', user: findUser('Paul Pupkovich'), details: '[OOC] что я?' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает большие ворота к.с Ящерицы 2/5' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'CHAT', user: findUser('Сэм Великий'), details: '[OOC] продам сферу ионика, 1к хлама' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 4/5' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'CHAT', user: findUser('Marco Blackberry'), details: '[OOC] можно нарушать' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'CHAT', user: findUser('Margo Solairova'), details: '[OOC] нет' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'CHAT', user: findUser('Лоренсо Нэп'), details: '[OOC] Может Пауль?' },
  { timestamp: new Date('2024-07-25T17:07:00'), type: 'RP', user: findUser('Maksim Mercer'), details: '[СКО] Образец Авель ломает Герметичные ворота правого отсека легкой зоны 2/5' },
  { timestamp: new Date('2024-07-25T17:06:00'), type: 'CHAT', user: findUser('Егор Фамилов'), details: '[OOC] марго в соло админ на серваке' },
  { timestamp: new Date('2024-07-25T17:06:00'), type: 'ANNOUNCEMENT', user: findUser('Лоренсо Нэп'), details: '{CO} Господин рыба просит контракт с КМ' },
  { timestamp: new Date('2024-07-25T17:06:00'), type: 'NOTIFICATION', details: 'Дипломатия Образец Ионик погиб. Контракт с Организацией Комплекс аннулирован.' },
  { timestamp: new Date('2024-07-25T17:06:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 2/5' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт с ДЗ' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Запрашивает прогулку по км' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица ломает большие ворота к.с Ящерицы 1/5' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Ящерица вернулся в камеру содержания. (Чад Пепел)' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Ящерица прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'CHAT', user: findUser('Domas Harikov'), details: '[OOC] Незнаю обычное' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Огненный Человек покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт с ДЗ' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Магомед Лопухов'), details: '[СКО] Образец Ящерица покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Андрей Серпов'), details: '[СКО] Образец Домовой прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Образец Мясник ломает ворота к.с Мясника 1/5' },
  { timestamp: new Date('2024-07-25T17:05:00'), type: 'RP', user: findUser('Толя Дальнобой'), details: '[СКО] Образец Мясник прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] КАКОИ ПМ' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 3/5' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'CHAT', user: findUser('Domas Harikov'), details: '[OOC] Сергей заебал писать в пм иди жалуйся если чот не нравится' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'CHAT', user: findUser('Майк Грин'), details: '[OOC] да пофиг))' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Огненный Человек прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'RP', user: findUser('Магомед Лопухов'), details: '[СКО] Образец Ящерица ломает большие ворота к.с Ящерицы 1/5' },
  { timestamp: new Date('2024-07-25T17:04:00'), type: 'RP', user: findUser('Магомед Лопухов'), details: '[СКО] Образец Ящерица прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Domas Harikov'), details: '[OOC] Аахахахах ez Война' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] - весь эвс' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Make Show'), details: '[OOC] bye-bye all' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Gektor Kleen'), details: '[OOC] войны нет' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] домас блять' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] СУКА НАШЕЛ ВРЕМЯ' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Lot Tery'), details: '[OOC] мега изи' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Sasha Naval'), details: '[OOC] быстро' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] ez' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'NOTIFICATION', details: 'Дипломатия Главы Организации Длань-Змея погибли. Все контракты, войны, союзы аннулированы.' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'ANNOUNCEMENT', user: findUser('Domas Harikov'), details: '[RP] Нападение на КМ' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'NOTIFICATION', details: 'Дипломатия Организация Комплекс объявила войну Организации Длань-Змея' },
  { timestamp: new Date('2024-07-25T17:03:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб ломает двери к.с Суккуба 1/5' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Чужой покинул камеру содержания. (Envy Safone)' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Внимание Образец Чужой сломал дверь к.с Чужого' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает дверь к.с Чужого 5/5' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Илья Голубцов'), details: '[СКО] Образец ИИ прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Chill Ketpyv'), details: '[СКО] [VIP] Образец Хищник прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Старик покинул камеру содержания. (Roman Blackberry)' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Суккуб прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Roman Blackberry'), details: '[СКО] Внимание Образец Старик расплавил куб Старика' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Roman Blackberry'), details: '[СКО] Образец Старик плавит куб Старика 5/5' },
  { timestamp: new Date('2024-07-25T17:02:00'), type: 'RP', user: findUser('Платон Муратов'), details: '[СКО] Образец До-До покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:01:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 2/5' },
  { timestamp: new Date('2024-07-25T17:01:00'), type: 'CHAT', user: findUser('Тони Майлер'), details: '[OOC] ....' },
  { timestamp: new Date('2024-07-25T17:01:00'), type: 'ANNOUNCEMENT', user: findUser('Lot Tery'), details: '[RP] черный репер ака Кошмар споткнулся на лестнице и упал' },
  { timestamp: new Date('2024-07-25T17:01:00'), type: 'RP', user: findUser('Maksim Mercer'), details: '[СКО] Образец Авель ломает дверь Интеркома 1/5' },
  { timestamp: new Date('2024-07-25T17:01:00'), type: 'ANNOUNCEMENT', user: findUser('Джон Розз'), details: '[RP] О.Кошмар убит' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'ANNOUNCEMENT', user: findUser('Egor Caramora'), details: '[О5]-----[Дз] Мы вас поняли' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] авель в км' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'ANNOUNCEMENT', user: findUser('Egor Caramora'), details: '[О5]-----[Дз] НУ что вы согласны' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Огненный Человек покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'RP', user: findUser('Artem Metl'), details: '[СКО] Образец ИИ покинул комплекс' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Огненный Человек прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T17:00:00'), type: 'RP', user: findUser('Алекс Тролген'), details: '[СКО] [VIP] Образец Кошмар ломает Ворота к.с Огненного Человека 1/5' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'RP', user: findUser('Леха Фастфудов'), details: '[СКО] Образец Огненный Человек покинул комплекс' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'ANNOUNCEMENT', user: findUser('Андрей Серпов'), details: '[RP] О.Домовой Желает заключить конракт с ДЗ' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] пизда мешают' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] ДОМАс пропы из интеркома убери' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'ANNOUNCEMENT', user: findUser('Магомед Лопухов'), details: '[RP] Мясник убит' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает дверь к.с Чужого 4/5' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'ANNOUNCEMENT', user: findUser('Egor Caramora'), details: '[О5]-----[Дз] Тогда убиваете Авеля и будите только захватывать Хища тогда так и быть союз' },
  { timestamp: new Date('2024-07-25T16:59:00'), type: 'RP', user: findUser('Roman Blackberry'), details: '[СКО] Образец Старик плавит куб Старика 4/5' },
  { timestamp: new Date('2024-07-25T16:58:00'), type: 'ANNOUNCEMENT', user: findUser('Лоренсо Нэп'), details: '{CO} Господин рыба просит контракт с КМ' },
  { timestamp: new Date('2024-07-25T16:58:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид ломает ворота к.с Гибрида 1/5' },
  { timestamp: new Date('2024-07-25T16:58:00'), type: 'RP', user: findUser('Marco Blackberry'), details: '[СКО] Образец Гибрид прибыл в комплекс' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'ANNOUNCEMENT', user: findUser('Майк Грин'), details: '[ГУ-ДЗ]==> [КМ] Мы способны вам помочь так как Соврана сейчас на пике своих сил' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] пишется' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'CHAT', user: findUser('Андрей Дангиев'), details: '[OOC] никаких' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'CHAT', user: findUser('Вася Пипеткин'), details: '[OOC] почему камеры д классов закрыли' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'ANNOUNCEMENT', user: findUser('Egor Caramora'), details: '[О5]-----[Дз] не каких сообщений я не получал' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'CHAT', user: findUser('Domas Harikov'), details: '[OOC] Это один 1 на один проход и на другой' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'ANNOUNCEMENT', user: findUser('Валера Святославович'), details: '[CO] О.Маска хочет новое тело и желает заключить контракт' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'CHAT', user: findUser('Егор Кидалов'), details: '[OOC] повезали черти' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'NOTIFICATION', details: 'Оповещения Образец Мясник покинул камеру содержания. (Чад Пепел)' },
  { timestamp: new Date('2024-07-25T16:57:00'), type: 'CHAT', user: findUser('Сэм Великий'), details: '[OOC] это легко заабузить' },
  { timestamp: new Date('2024-07-25T16:56:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Внимание Образец Мясник сломал ворота к.с Мясника' },
  { timestamp: new Date('2024-07-25T16:56:00'), type: 'RP', user: findUser('Чад Пепел'), details: '[СКО] Образец Мясник ломает ворота к.с Мясника 5/5' },
  { timestamp: new Date('2024-07-25T16:56:00'), type: 'CHAT', user: findUser('Sergey Bulbа'), details: '[OOC] больлше 2 кеипадов на проход нельзя' },
  { timestamp: new Date('2024-07-25T16:56:00'), type: 'ANNOUNCEMENT', user: findUser('Майк Грин'), details: '[ГУ-ДЗ]==> [КМ] В моих словах до этого, было уже всё сказано' },
  { timestamp: new Date('2024-07-25T16:56:00'), type: 'CHAT', user: findUser('Domas Harikov'), details: '[OOC] В чем это нельзя как имено' },
  { timestamp: new Date('2024-07-25T16:56:00'), type: 'RP', user: findUser('Envy Safone'), details: '[СКО] Образец Чужой ломает дверь к.с Чужого 3/5' },
];



// --- Main Generator Function for Historical Data ---
function generateHistoricalLogs(startDate: Date, logsPerDay: number): LogEntry[] {
    const allLogs: LogEntry[] = hardcodedLogs.map(log => ({
        ...log,
        id: crypto.randomUUID(),
        timestamp: log.timestamp || new Date(),
    } as LogEntry));

    const now = new Date();
    const start = new Date(startDate);
    const days = Math.ceil((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));

    for (let day = 0; day < days; day++) {
        const currentDay = new Date(now.getTime() - day * 24 * 60 * 60 * 1000);
        if (currentDay < start) continue;

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


// Generate logs from Sep 1st
export const historicalLogs: LogEntry[] = generateHistoricalLogs(new Date('2024-09-01'), 500);


// Mock data for player activity chart
export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 48 }, (_, i) => {
    const d = new Date();
    // Go back in 1-hour increments over 48 hours
    d.setHours(new Date().getHours() - i);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);

    const hour = d.getHours();
    let players;

    // Simulate day/night cycle
    if (hour > 2 && hour < 9) { // Deep night (Asia/Singapore UTC+8 is +5 from Moscow)
        players = Math.floor(Math.random() * 10) + 5; // 5-14 players
    } else if (hour >= 9 && hour < 16) { // Morning/Day
        players = Math.floor(Math.random() * 20) + 20; // 20-39 players
    } else { // Peak hours (evening)
        players = Math.floor(Math.random() * 25) + 35; // 35-59 players
    }
    
    return {
        time: `${String(hour).padStart(2, '0')}:00`,
        players: players,
    };
}).reverse();

export const consoleLogs: string[] = [
    "SYSTEM: Initializing UnisonoGuard v3.1...",
    "FIREWALL: Applying rule set 'default_game_server'",
    "NETWORK: Monitoring traffic on port 27015/udp",
    "AUTH: Successful login for user 'Admin' from 127.0.0.1",
    "ANTIVIRUS: Starting daily scan of game files...",
    "ANTIVIRUS: Scan complete. No threats detected.",
    "NETWORK: Packet analysis running...",
    "FIREWALL: Blocked inbound connection from 101.56.88.2 - Reason: Blacklisted IP",
    "SYSTEM: Running system file integrity check...",
    "SYSTEM: Integrity check passed. All critical files are secure.",
    "THREAT_INTELLIGENCE: Updating database from feed 'abuse.ch'...",
    "THREAT_INTELLIGENCE: Database updated. 150 new malicious IPs added.",
    "NETWORK: Anomaly detected: Unusual packet size from 192.168.45.12",
    "FIREWALL: Temporarily throttling connection for 192.168.45.12",
    "AUTH: Failed login attempt for user 'root' from 212.5.77.13",
    "AUTH: Failed login attempt for user 'root' from 212.5.77.13",
    "AUTH: Failed login attempt for user 'root' from 212.5.77.13",
    "FIREWALL: Rule #114 triggered. Blocking IP 212.5.77.13 for 15 minutes (brute-force attempt).",
    "DDOS_MITIGATION: Low-level UDP flood detected. Activating mitigation mode.",
    "NETWORK: Analyzing traffic pattern for DDoS attack...",
    "DDOS_MITIGATION: Attack source identified: network 45.132.0.0/16. Applying filters.",
    "SYSTEM: CPU usage stable at 35%. Memory usage at 55%.",
    "FIREWALL: Allowed connection from new player IP 88.201.15.67.",
    "NETWORK: Player 88.201.15.67 authenticated. SteamID: STEAM_0:1:12345678",
    "THREAT_INTELLIGENCE: Checking player IP 88.201.15.67 against known cheater databases... Clean.",
    "DDOS_MITIGATION: Attack mitigated. Traffic levels returning to normal.",
    "DDOS_MITIGATION: Deactivating mitigation mode.",
    "SYSTEM: Server tick rate nominal at 66/s.",
    "FIREWALL: Detected port scan from 114.33.21.99 on ports 1-1024.",
    "FIREWALL: IP 114.33.21.99 added to watchlist for suspicious activity.",
    "AUTH: Admin 'Guardian' executed command: 'status'",
    "NETWORK: Outbound traffic normal. Latency to main hubs: 25ms.",
    "SYSTEM: Running scheduled backup of player database...",
    "SYSTEM: Backup complete. Stored securely off-site.",
    "FIREWALL: Blocked known cheat-related DNS query from player 'SuspiciousPlayer' (189.34.11.2)",
    "SYSTEM: Player 'SuspiciousPlayer' flagged for monitoring.",
    "NETWORK: High latency detected for player 'LaggyGuy' (201.44.55.66) - 350ms.",
    "AUTH: Disconnected player 'TimeoutUser' - Reason: Ping too high.",
    "THREAT_INTELLIGENCE: Updating signatures for new LUA-based exploits...",
    "THREAT_INTELLIGENCE: Signatures updated successfully.",
    "SYSTEM: All services are running normally.",
    "FIREWALL: Synced with global UnisonoGuard blacklist.",
    "NETWORK: Normal traffic flow resumed on port 27015.",
    "ANTIVIRUS: Real-time protection active.",
    "AUTH: Player 'CoolDude123' authenticated via Steam.",
    "SYSTEM: Checking for game server updates... No new updates available.",
    "FIREWALL: Rule #45 (Block Russia-based proxy networks) matched. 15 IPs blocked.",
    "NETWORK: Detected minor packet loss (0.1%) to Frankfurt.",
    "SYSTEM: Adjusting network buffers to compensate for packet loss.",
    "AUTH: Admin 'NightOwl' logged in from a new location. Verification sent.",
    "AUTH: Admin 'NightOwl' successfully verified via 2FA.",
    "THREAT_INTELLIGENCE: IP 93.184.216.34 (example.com) has a low reputation score. Monitoring.",
    "FIREWALL: Warning: RCON password has not been changed in 90 days.",
    "SYSTEM: Server uptime: 12 days, 4 hours, 22 minutes.",
    "NETWORK: Analyzing top talkers: Player 'Chatterbox' sending high volume of chat data.",
    "FIREWALL: Blocked outbound connection to suspicious domain 'totally-not-a-virus.com'.",
    "ANTIVIRUS: Quarantined a suspicious file `garrysmod/addons/super_cool_aimbot.lua` uploaded by a player.",
    "SYSTEM: Player associated with malicious file has been auto-kicked. SteamID logged.",
    "AUTH: Multiple failed RCON login attempts from 77.88.55.22.",
    "FIREWALL: IP 77.88.55.22 has been permanently banned from RCON access.",
];
