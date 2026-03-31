import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { AxiosError } from 'axios';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { serverStatusEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Check the current Minecraft server status');

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

    const server = await apiClient.getServer(serverId);

    await interaction.editReply({
      embeds: [
        serverStatusEmbed(
          server.name || serverId,
          server.status?.state || 'unknown',
          server.status?.live || false
        ),
      ],
    });
  } catch (error) {
    console.error('Error getting server status:', error);
    
    let errorMessage = 'Failed to get server status. Is the API available?';
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    await interaction.editReply({
      embeds: [errorEmbed('Error', errorMessage)],
    });
  }
}
