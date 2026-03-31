import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ColorResolvable } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { errorEmbed } from '../utils/embeds';
import { loadBotConfig } from '../utils/config';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get detailed information about the server');

export async function execute(interaction: CommandInteraction): Promise<void> {
  if (!(await checkPermission(interaction))) return;

  await interaction.deferReply();

  try {
    const serverId = getActiveServerId();
    if (!serverId) {
      await interaction.editReply({
        embeds: [errorEmbed('No Server Selected', 'Use /servers to list available servers and /switch to select one.')],
      });
      return;
    }

    const [serverInfo, extensions] = await Promise.all([
      apiClient.getServerInfo(serverId),
      apiClient.getExtensions(serverId).catch(() => ({ plugins: [], mods: [] })),
    ]);

    const config = loadBotConfig();
    const embed = new EmbedBuilder()
      .setColor(config.embedColors.info as ColorResolvable)
      .setTitle(`📋 Server Info: ${serverInfo.name || serverId}`)
      .addFields(
        { name: 'ID', value: serverInfo.id, inline: true },
        { name: 'Version', value: serverInfo.minecraftVersion || 'Unknown', inline: true }
      )
      .setTimestamp();

    if (extensions.plugins && extensions.plugins.length > 0) {
      embed.addFields({
        name: `Plugins (${extensions.plugins.length})`,
        value: extensions.plugins.slice(0, 10).join(', ') + (extensions.plugins.length > 10 ? '...' : ''),
      });
    }

    if (extensions.mods && extensions.mods.length > 0) {
      embed.addFields({
        name: `Mods (${extensions.mods.length})`,
        value: extensions.mods.slice(0, 10).join(', ') + (extensions.mods.length > 10 ? '...' : ''),
      });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error getting server info:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to get server information.')],
    });
  }
}
