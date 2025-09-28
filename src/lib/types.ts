export type LogType = 'CONNECTION' | 'CHAT' | 'DAMAGE' | 'KILL' | 'SPAWN' | 'ADMIN';

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

export type Anomaly = {
  description: string;
  severity: string;
  logEntries: string[];
};

export type AnomalyDetectionState = {
  message?: string | null;
  errors?: {
    logs?: string[];
  };
  anomalies?: Anomaly[];
};

export type ViewType = 
  | 'summary' 
  | 'logs_all' 
  | 'logs_connection' 
  | 'logs_chat' 
  | 'logs_damage' 
  | 'logs_kill'
  | 'logs_spawn'
  | 'logs_admin'
  | 'anomaly_detection';
