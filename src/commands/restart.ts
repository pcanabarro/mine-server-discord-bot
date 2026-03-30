import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('restart')
  .setDescription('Restart the Minecraft server');

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

    await apiClient.restartServer(serverId);
    await interaction.editReply({
      embeds: [successEmbed('Server Restarting', `Server \`${serverId}\` is restarting...`)],
    });
  } catch (error) {
    console.error('Error restarting server:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to restart the server.')],
    });
  }
}
