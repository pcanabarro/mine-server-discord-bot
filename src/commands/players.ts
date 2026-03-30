import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
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

    const [serverInfo, players] = await Promise.all([
      apiClient.getServer(serverId),
      apiClient.getPlayers(serverId),
    ]);

    const playerNames = players.map((p) => p.name);
    await interaction.editReply({
      embeds: [playerListEmbed(playerNames, serverInfo.name || serverId)],
    });
  } catch (error) {
    console.error('Error getting players:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to get player list. Is the server running?')],
    });
  }
}
