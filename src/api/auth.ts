import axios from 'axios';
import { env } from '../utils/config';

interface ApiAuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: string;
}

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

    this.token = response.data.accessToken;
    // JWT tokens typically expire in 12 hours, refresh 5 minutes before
    this.tokenExpiry = Date.now() + 11 * 60 * 60 * 1000;

    console.log('✅ Authenticated with API');
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
