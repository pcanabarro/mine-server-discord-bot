export interface BotConfig {
  allowedRoleIds: string[];
  defaultServerId: string | null;
  embedColors: {
    success: string;
    error: string;
    info: string;
    warning: string;
  };
}

export interface ServerInfo {
  id: string;
  name: string;
  path: string;
  active: boolean;
  minecraftVersion?: string | null;
  motd?: string;
  port?: number;
  status?: ServerStatus;
}

export interface ServerStatus {
  serverId: string;
  active: boolean;
  state: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';
  live: boolean;
  portReachable: boolean;
  rconReachable: boolean;
  commandAvailable: boolean;
  managed: boolean;
  pid: number | null;
}

export interface Player {
  name: string;
  uuid?: string;
}

export interface WhitelistResponse {
  serverId: string;
  count: number;
  players: string[];
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
