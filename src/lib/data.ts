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
    details: `${users[0].name} has connected.`,
  },
  {
    id: '2',
    timestamp: new Date(now.getTime() - 1000 * 60 * 2),
    type: 'SPAWN',
    user: users[0],
    details: `${users[0].name} spawned as Class D.`,
  },
  {
    id: '3',
    timestamp: new Date(now.getTime() - 1000 * 60 * 3),
    type: 'CONNECTION',
    user: users[1],
    details: `${users[1].name} has connected.`,
  },
  {
    id: '4',
    timestamp: new Date(now.getTime() - 1000 * 60 * 4),
    type: 'CHAT',
    user: users[0],
    details: `hello everyone!`,
  },
  {
    id: '5',
    timestamp: new Date(now.getTime() - 1000 * 60 * 5),
    type: 'SPAWN',
    user: users[1],
    details: `${users[1].name} spawned as Scientist.`,
  },
  {
    id: '6',
    timestamp: new Date(now.getTime() - 1000 * 60 * 6),
    type: 'DAMAGE',
    user: users[1],
    details: `${users[1].name} took 10 damage from fall.`,
  },
  {
    id: '7',
    timestamp: new Date(now.getTime() - 1000 * 60 * 7),
    type: 'CHAT',
    user: users[1],
    details: `ouch`,
  },
  {
    id: '8',
    timestamp: new Date(now.getTime() - 1000 * 60 * 8),
    type: 'CONNECTION',
    user: users[2],
    details: `${users[2].name} has connected.`,
  },
  {
    id: '9',
    timestamp: new Date(now.getTime() - 1000 * 60 * 9),
    type: 'ADMIN',
    user: users[2],
    details: `${users[2].name} noclipped.`,
  },
  {
    id: '10',
    timestamp: new Date(now.getTime() - 1000 * 60 * 10),
    type: 'CONNECTION',
    user: users[3],
    details: `${users[3].name} has connected.`,
  },
  {
    id: '11',
    timestamp: new Date(now.getTime() - 1000 * 60 * 11),
    type: 'KILL',
    user: users[0],
    details: `${users[0].name} was killed by SCP-173.`,
  },
  {
    id: '12',
    timestamp: new Date(now.getTime() - 1000 * 60 * 12),
    type: 'SPAWN',
    user: users[3],
    details: `${users[3].name} spawned as Guard.`,
  },
  {
    id: '13',
    timestamp: new Date(now.getTime() - 1000 * 60 * 13),
    type: 'DAMAGE',
    user: users[3],
    details: `${users[3].name} was damaged by xX_Sniper_Xx for 50 health.`,
  },
  {
    id: '14',
    timestamp: new Date(now.getTime() - 1000 * 60 * 14),
    type: 'KILL',
    user: users[3],
    details: `${users[3].name} was killed by xX_Sniper_Xx.`,
  },
  {
    id: '15',
    timestamp: new Date(now.getTime() - 1000 * 60 * 15),
    type: 'CONNECTION',
    user: users[0],
    details: `${users[0].name} has disconnected.`,
  },
  {
    id: '16',
    timestamp: new Date(now.getTime() - 1000 * 60 * 16),
    type: 'CONNECTION',
    user: users[4],
    details: `${users[4].name} has connected.`,
  },
  {
    id: '17',
    timestamp: new Date(now.getTime() - 1000 * 60 * 17),
    type: 'CHAT',
    user: users[4],
    details: `Time to win.`,
  },
  {
    id: '18',
    timestamp: new Date(now.getTime() - 1000 * 60 * 18),
    type: 'ADMIN',
    user: users[2],
    details: `${users[2].name} kicked xX_Sniper_Xx for RDM.`,
  },
  {
    id: '19',
    timestamp: new Date(now.getTime() - 1000 * 60 * 19),
    type: 'CONNECTION',
    user: users[1],
    details: `${users[1].name} has disconnected (Kicked).`,
  },
  {
    id: '20',
    timestamp: new Date(now.getTime() - 1000 * 60 * 20),
    type: 'SPAWN',
    user: users[4],
    details: `${users[4].name} spawned as Chaos Insurgency.`,
  },
];

export const mockPlayerActivity: PlayerActivity[] = Array.from({ length: 24 }, (_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - (i * 2));
    return {
        time: `${d.getHours()}:00`,
        players: Math.floor(Math.random() * (55 - 10 + 1)) + 10,
    };
}).reverse();
