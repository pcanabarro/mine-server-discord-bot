import { EmbedBuilder, ColorResolvable } from 'discord.js';
import { loadBotConfig } from './config';

const config = loadBotConfig();

export function successEmbed(title: string, description?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.embedColors.success as ColorResolvable)
    .setTitle(`✅ ${title}`)
    .setDescription(description || null)
    .setTimestamp();
}

export function errorEmbed(title: string, description?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.embedColors.error as ColorResolvable)
    .setTitle(`❌ ${title}`)
    .setDescription(description || null)
    .setTimestamp();
}

export function infoEmbed(title: string, description?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.embedColors.info as ColorResolvable)
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description || null)
    .setTimestamp();
}

export function warningEmbed(title: string, description?: string): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(config.embedColors.warning as ColorResolvable)
    .setTitle(`⚠️ ${title}`)
    .setDescription(description || null)
    .setTimestamp();
}

export function serverStatusEmbed(
  serverName: string,
  status: string,
  online: boolean,
  players?: number,
  maxPlayers?: number
): EmbedBuilder {
  const color = online ? config.embedColors.success : config.embedColors.error;
  const statusIcon = online ? '🟢' : '🔴';

  const embed = new EmbedBuilder()
    .setColor(color as ColorResolvable)
    .setTitle(`${statusIcon} Server: ${serverName}`)
    .addFields(
      { name: 'Status', value: status, inline: true },
      { name: 'Online', value: online ? 'Yes' : 'No', inline: true }
    )
    .setTimestamp();

  if (players !== undefined && maxPlayers !== undefined) {
    embed.addFields({ name: 'Players', value: `${players}/${maxPlayers}`, inline: true });
  }

  return embed;
}

export function playerListEmbed(players: string[], serverName: string): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setColor(config.embedColors.info as ColorResolvable)
    .setTitle(`👥 Players on ${serverName}`)
    .setTimestamp();

  if (players.length === 0) {
    embed.setDescription('No players online');
  } else {
    embed.setDescription(players.map((p) => `• ${p}`).join('\n'));
    embed.setFooter({ text: `${players.length} player(s) online` });
  }

  return embed;
}
