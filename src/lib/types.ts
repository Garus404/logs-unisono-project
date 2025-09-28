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

export type ServerState = {
  name: string;
  map: string;
  players: Player[];
  maxplayers: number;
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
