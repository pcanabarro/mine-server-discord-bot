import axios, { AxiosInstance, AxiosError } from 'axios';
import { env } from '../utils/config';
import { authService } from './auth';
import { ServerInfo, ServerStatus, Player, WhitelistResponse } from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async (config) => {
      if (!config.url?.includes('/auth') && !config.url?.includes('/health')) {
        const token = await authService.getToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth')) {
          await authService.refreshToken();
          const token = await authService.getToken();
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${token}`;
            return this.client.request(error.config);
          }
        }
        throw error;
      }
    );
  }

  async health(): Promise<{ status: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getServers(): Promise<ServerInfo[]> {
    const response = await this.client.get('/servers');
    return response.data;
  }

  async getServer(serverId: string): Promise<ServerInfo> {
    const response = await this.client.get(`/servers/${serverId}`);
    return response.data;
  }

  async getServerStatus(serverId: string): Promise<ServerStatus> {
    const response = await this.client.get(`/servers/${serverId}/status`);
    return response.data;
  }

  async startServer(serverId: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/start`);
  }

  async stopServer(serverId: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/stop`);
  }

  async restartServer(serverId: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/restart`);
  }

  async getPlayers(serverId: string): Promise<Player[]> {
    const response = await this.client.get(`/servers/${serverId}/players`);
    return response.data.players || response.data;
  }

  async addToWhitelist(serverId: string, player: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/whitelist`, { player });
  }

  async removeFromWhitelist(serverId: string, player: string): Promise<void> {
    await this.client.delete(`/servers/${serverId}/whitelist/${player}`);
  }

  async getWhitelist(serverId: string): Promise<WhitelistResponse> {
    const response = await this.client.get(`/servers/${serverId}/whitelist`);
    return response.data;
  }

  async kickPlayer(serverId: string, player: string, reason?: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/kick`, { player, reason });
  }

  async banPlayer(serverId: string, player: string, reason?: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/ban`, { player, reason });
  }

  async unbanPlayer(serverId: string, player: string): Promise<void> {
    await this.client.delete(`/servers/${serverId}/ban/${player}`);
  }

  async say(serverId: string, message: string): Promise<void> {
    await this.client.post(`/servers/${serverId}/say`, { message });
  }

  async getServerInfo(serverId: string): Promise<ServerInfo> {
    const response = await this.client.get(`/servers/${serverId}/info`);
    return response.data;
  }

  async getExtensions(serverId: string): Promise<{ plugins?: string[]; mods?: string[] }> {
    const response = await this.client.get(`/servers/${serverId}/extensions`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
