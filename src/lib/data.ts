import type { LogEntry, PlayerActivity } from '@/lib/types';

// More realistic player names based on observations
const users = [
  { name: 'Bober Namazov', steamId: '76561198000000001' },
  { name: 'Kenny Haiden', steamId: '76561198000000002' },
  { name: 'Тони Майлер', steamId: '76561198000000003' },
  { name: 'Chang Milos', steamId: '76561198000000004' },
  { name: 'Olimp Reewis', steamId: '76561198000000005' },
  { name: 'Яра Шист', steamId: '76561198000000006' },
  { name: 'Dashka', steamId: '76561198000000007' },
  { name: 'ProGamer123', steamId: '76561198000000008' },
];

const now = new Date();

// Generate more varied and realistic logs based on the screenshot
export const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(now.getTime() - 1000 * 60 * 1),
    type: 'CHAT',
    user: users[0], // Bober Namazov
    details: `[OOC] ${users[0].name}: Кто ролл 100к`,
  },
  {
    id: '2',
    timestamp: new Date(now.getTime() - 1000 * 60 * 2),
    type: 'SPAWN', // Using SPAWN for general RP actions
    user: users[1], // Kenny Haiden
    details: `(Kenny Haiden) Образец Ящерица ломает ворота к.с Ящерицы`,
  },
  {
    id: '3',
    timestamp: new Date(now.getTime() - 1000 * 60 * 3),
    type: 'CHAT', // Using CHAT for announcements
    user: users[2], // Тони Майлер
    details: `[Объявление] ${users[2].name}: [СО] О.О.Ч. желает заключить контракт с КМ`,
  },
  {
    id: '4',
    timestamp: new Date(now.getTime() - 1000 * 60 * 4),
    type: 'SPAWN', // Using SPAWN for system notifications
    user: users[3], // Chang Milos
    details: `[Оповещение] Образец Маска покинул камеру содержания. (${users[3].name})`,
  },
    {
    id: '5',
    timestamp: new Date(now.getTime() - 1000 * 60 * 5),
    type: 'SPAWN', // Using SPAWN for system notifications
    user: users[4], // Olimp Reewis
    details: `[Оповещение] Образец До-До покинул камеру содержания. (${users[4].name})`,
  },
  {
    id: '6',
    timestamp: new Date(now.getTime() - 1000 * 60 * 6),
    type: 'CONNECTION',
    user: users[5], // Яра Шист
    details: `${users[5].name} подключился.`,
  },
  {
    id: '7',
    timestamp: new Date(now.getTime() - 1000 * 60 * 7),
    type: 'KILL',
    user: users[5], // Яра Шист
    details: `игрок ${users[5].name} убил игрока ${users[6].name}.`,
  },
  {
    id: '8',
    timestamp: new Date(now.getTime() - 1000 * 60 * 8),
    type: 'CHAT',
    user: users[5], // Яра Шист
    details: `[OOC] ${users[5].name}: Как вас КОБРА УБИЛА`,
  },
  {
    id: '9',
    timestamp: new Date(now.getTime() - 1000 * 60 * 9),
    type: 'DAMAGE',
    user: users[1], // Kenny Haiden
    details: `${users[1].name} получил 35 урона от ${users[5].name}.`,
  },
  {
    id: '10',
    timestamp: new Date(now.getTime() - 1000 * 60 * 10),
    type: 'CONNECTION',
    user: users[7], // ProGamer123
    details: `${users[7].name} подключился.`,
  },
  {
    id: '11',
    timestamp: new Date(now.getTime() - 1000 * 60 * 11),
    type: 'SPAWN',
    user: users[7],
    details: `${users[7].name} сменил профессию на [VIP] Сотрудник Службы Безопасности.`,
  },
  {
    id: '12',
    timestamp: new Date(now.getTime() - 1000 * 60 * 12),
    type: 'CHAT',
    user: users[6], // Dashka
    details: `[OOC] ${users[6].name}: лол`,
  },
  {
    id: '13',
    timestamp: new Date(now.getTime() - 1000 * 60 * 13),
    type: 'CONNECTION',
    user: users[0], // Bober Namazov
    details: `${users[0].name} отключился.`,
  },
   {
    id: '14',
    timestamp: new Date(now.getTime() - 1000 * 60 * 14),
    type: 'CHAT',
    user: users[5], // Яра Шист
    details: `[OOC] ${users[5].name}: Дура на кобре блять`,
  },
  {
    id: '15',
    timestamp: new Date(now.getTime() - 1000 * 60 * 15),
    type: 'KILL',
    user: users[1], // Kenny Haiden
    details: `игрок ${users[1].name} был убит падением.`,
  },
  {
    id: '16',
    timestamp: new Date(now.getTime() - 1000 * 60 * 16),
    type: 'CONNECTION',
    user: users[1], // Kenny Haiden
    details: `${users[1].name} был отключен (Кикнут).`,
  }
].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());


export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - (i * 2));
    return {
        time: `${String(d.getHours()).padStart(2, '0')}:00`,
        players: Math.floor(Math.random() * (55 - 10 + 1)) + 10,
    };
}).reverse();