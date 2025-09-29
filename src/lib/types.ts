export type LogType = 'CONNECTION' | 'CHAT' | 'DAMAGE' | 'KILL' | 'SPAWN';

export type LogEntry = {
  id: string;
  timestamp: Date;
  type: LogType;
  user: {
    name: string;
    steamId: string;
  };
  details: string;
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
  timeHours: number;
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

    