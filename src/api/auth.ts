import axios from 'axios';
import { env } from '../utils/config';
import { ApiAuthResponse } from '../types';

class AuthService {
  private token: string | null = null;
  private tokenExpiry: number = 0;

  async authenticate(): Promise<string> {
    const response = await axios.post<ApiAuthResponse>(
      `${env.apiUrl}/auth`,
      {
        username: env.apiUsername,
        password: env.apiPassword,
      }
    );

    this.token = response.data.access_token;
    // JWT tokens typically expire in 1 hour, refresh 5 minutes before
    this.tokenExpiry = Date.now() + 55 * 60 * 1000;

    return this.token;
  }

  async getToken(): Promise<string> {
    if (!this.token || Date.now() >= this.tokenExpiry) {
      return this.authenticate();
    }
    return this.token;
  }

  async refreshToken(): Promise<string> {
    this.token = null;
    this.tokenExpiry = 0;
    return this.authenticate();
  }

  isAuthenticated(): boolean {
    return this.token !== null && Date.now() < this.tokenExpiry;
  }
}

export const authService = new AuthService();
