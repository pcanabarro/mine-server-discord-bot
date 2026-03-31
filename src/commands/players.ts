import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { AxiosError } from 'axios';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { playerListEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('players')
  .setDescription('List online players on the Minecraft server');

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
    const players = await apiClient.getPlayers(serverId);

    const playerNames = Array.isArray(players) 
      ? players.map((p) => typeof p === 'string' ? p : p.name)
      : [];
      
    await interaction.editReply({
      embeds: [playerListEmbed(playerNames, server.name || serverId)],
    });
  } catch (error) {
    console.error('Error getting players:', error);
    
    let errorMessage = 'Failed to get player list. Is the server running?';
    if (error instanceof AxiosError && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    await interaction.editReply({
      embeds: [errorEmbed('Error', errorMessage)],
    });
  }
}
