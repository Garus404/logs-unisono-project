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
};

// This mirrors the structure returned by GameDig
export type ServerState = {
  name: string;
  map: string;
  password?: boolean;
  maxplayers: number;
  players: Player[];
  bots: Player[];
  connect: string;
  ping: number;
  game: string;
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
