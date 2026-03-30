import { readFileSync } from 'fs';
import { join } from 'path';
import { config as dotenvConfig } from 'dotenv';
import { BotConfig } from '../types';

dotenvConfig({ path: join(__dirname, '../../config/.env') });

export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function loadBotConfig(): BotConfig {
  const configPath = join(__dirname, '../../config/bot-config.json');
  const configFile = readFileSync(configPath, 'utf-8');
  return JSON.parse(configFile) as BotConfig;
}

export const env = {
  get discordToken(): string {
    return getEnv('DISCORD_TOKEN');
  },
  get apiUrl(): string {
    return getEnv('API_URL', 'http://localhost:3000');
  },
  get apiUsername(): string {
    return getEnv('API_USERNAME');
  },
  get apiPassword(): string {
    return getEnv('API_PASSWORD');
  },
};
