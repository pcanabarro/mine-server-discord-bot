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

export interface ApiAuthResponse {
  access_token: string;
}

export interface ServerInfo {
  id: string;
  name: string;
  version?: string;
  status?: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';
}

export interface ServerStatus {
  status: 'stopped' | 'starting' | 'running' | 'stopping' | 'error';
  online: boolean;
  players?: number;
  maxPlayers?: number;
}

export interface Player {
  name: string;
  uuid?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
