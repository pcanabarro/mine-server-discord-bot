import { Collection, SlashCommandBuilder, ChatInputCommandInteraction, REST, Routes, SharedSlashCommand } from 'discord.js';
import { loadBotConfig } from '../utils/config';

import * as statusCmd from './status';
import * as startCmd from './start';
import * as stopCmd from './stop';
import * as restartCmd from './restart';
import * as playersCmd from './players';
import * as whitelistCmd from './whitelist';
import * as kickCmd from './kick';
import * as banCmd from './ban';
import * as unbanCmd from './unban';
import * as sayCmd from './say';
import * as infoCmd from './info';
import * as serversCmd from './servers';
import * as switchCmd from './switch';
import * as opCmd from './op';

export interface Command {
  data: SharedSlashCommand;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

const commands: Command[] = [
  statusCmd,
  startCmd,
  stopCmd,
  restartCmd,
  playersCmd,
  whitelistCmd,
  kickCmd,
  banCmd,
  unbanCmd,
  sayCmd,
  infoCmd,
  serversCmd,
  switchCmd,
  opCmd,
];

export const commandCollection = new Collection<string, Command>();
commands.forEach((cmd) => {
  commandCollection.set(cmd.data.name, cmd);
});

// Active server tracking
let activeServerId: string | null = null;

export function getActiveServerId(): string | null {
  if (activeServerId) return activeServerId;
  const config = loadBotConfig();
  return config.defaultServerId;
}

export function setActiveServerId(serverId: string): void {
  activeServerId = serverId;
}

export async function registerCommands(token: string, clientId: string): Promise<void> {
  const rest = new REST({ version: '10' }).setToken(token);

  const commandData = commands.map((cmd) => cmd.data.toJSON());

  console.log(`Registering ${commandData.length} slash commands...`);

  await rest.put(Routes.applicationCommands(clientId), { body: commandData });

  console.log('Successfully registered slash commands globally.');
}
