import { SlashCommandBuilder, CommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('start')
  .setDescription('Start the Minecraft server');

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

    await apiClient.startServer(serverId);
    await interaction.editReply({
      embeds: [successEmbed('Server Starting', `Server \`${serverId}\` is starting up...`)],
    });
  } catch (error) {
    console.error('Error starting server:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to start the server. It may already be running.')],
    });
  }
}
