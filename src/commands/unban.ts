import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('unban')
  .setDescription('Unban a player from the server')
  .addStringOption((option) =>
    option.setName('player').setDescription('Player name to unban').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
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

    const player = interaction.options.getString('player', true);

    await apiClient.unbanPlayer(serverId, player);
    await interaction.editReply({
      embeds: [successEmbed('Player Unbanned', `Unbanned \`${player}\``)],
    });
  } catch (error) {
    console.error('Error unbanning player:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to unban the player.')],
    });
  }
}
