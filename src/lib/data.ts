import type { LogEntry, PlayerActivity } from '@/lib/types';

const users = [
  { name: 'PlayerOne', steamId: '76561198000000001' },
  { name: 'xX_Sniper_Xx', steamId: '76561198000000002' },
  { name: 'AdminGamer', steamId: '76561198000000003' },
  { name: 'Newbie', steamId: '76561198000000004' },
  { name: 'ProGamer123', steamId: '76561198000000005' },
];

const now = new Date();

export const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: new Date(now.getTime() - 1000 * 60 * 1),
    type: 'CONNECTION',
    user: users[0],
    details: `${users[0].name} подключился.`,
  },
  {
    id: '2',
    timestamp: new Date(now.getTime() - 1000 * 60 * 2),
    type: 'SPAWN',
    user: users[0],
    details: `${users[0].name} появился как Class D.`,
  },
  {
    id: '3',
    timestamp: new Date(now.getTime() - 1000 * 60 * 3),
    type: 'CONNECTION',
    user: users[1],
    details: `${users[1].name} подключился.`,
  },
  {
    id: '4',
    timestamp: new Date(now.getTime() - 1000 * 60 * 4),
    type: 'CHAT',
    user: users[0],
    details: `всем привет!`,
  },
  {
    id: '5',
    timestamp: new Date(now.getTime() - 1000 * 60 * 5),
    type: 'SPAWN',
    user: users[1],
    details: `${users[1].name} появился как Scientist.`,
  },
  {
    id: '6',
    timestamp: new Date(now.getTime() - 1000 * 60 * 6),
    type: 'DAMAGE',
    user: users[1],
    details: `${users[1].name} получил 10 урона от падения.`,
  },
  {
    id: '7',
    timestamp: new Date(now.getTime() - 1000 * 60 * 7),
    type: 'CHAT',
    user: users[1],
    details: `ай`,
  },
  {
    id: '8',
    timestamp: new Date(now.getTime() - 1000 * 60 * 8),
    type: 'CONNECTION',
    user: users[2],
    details: `${users[2].name} подключился.`,
  },
  {
    id: '10',
    timestamp: new Date(now.getTime() - 1000 * 60 * 10),
    type: 'CONNECTION',
    user: users[3],
    details: `${users[3].name} подключился.`,
  },
  {
    id: '11',
    timestamp: new Date(now.getTime() - 1000 * 60 * 11),
    type: 'KILL',
    user: users[0],
    details: `${users[0].name} был убит SCP-173.`,
  },
  {
    id: '12',
    timestamp: new Date(now.getTime() - 1000 * 60 * 12),
    type: 'SPAWN',
    user: users[3],
    details: `${users[3].name} появился как Guard.`,
  },
  {
    id: '13',
    timestamp: new Date(now.getTime() - 1000 * 60 * 13),
    type: 'DAMAGE',
    user: users[3],
    details: `${users[3].name} был ранен xX_Sniper_Xx на 50 здоровья.`,
  },
  {
    id: '14',
    timestamp: new Date(now.getTime() - 1000 * 60 * 14),
    type: 'KILL',
    user: users[3],
    details: `${users[3].name} был убит xX_Sniper_Xx.`,
  },
  {
    id: '15',
    timestamp: new Date(now.getTime() - 1000 * 60 * 15),
    type: 'CONNECTION',
    user: users[0],
    details: `${users[0].name} отключился.`,
  },
  {
    id: '16',
    timestamp: new Date(now.getTime() - 1000 * 60 * 16),
    type: 'CONNECTION',
    user: users[4],
    details: `${users[4].name} подключился.`,
  },
  {
    id: '17',
    timestamp: new Date(now.getTime() - 1000 * 60 * 17),
    type: 'CHAT',
    user: users[4],
    details: `Время побеждать.`,
  },
  {
    id: '19',
    timestamp: new Date(now.getTime() - 1000 * 60 * 19),
    type: 'CONNECTION',
    user: users[1],
    details: `${users[1].name} был отключен (Кикнут).`,
  },
  {
    id: '20',
    timestamp: new Date(now.getTime() - 1000 * 60 * 20),
    type: 'SPAWN',
    user: users[4],
    details: `${users[4].name} появился как Chaos Insurgency.`,
  },
].filter(log => log.type !== 'ADMIN') as LogEntry[];

export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - (i * 2));
    return {
        time: `${d.getHours()}:00`,
        players: Math.floor(Math.random() * (55 - 10 + 1)) + 10,
    };
}).reverse();
