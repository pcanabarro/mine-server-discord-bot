import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban a player from the server')
  .addStringOption((option) =>
    option.setName('player').setDescription('Player name to ban').setRequired(true)
  )
  .addStringOption((option) =>
    option.setName('reason').setDescription('Reason for banning').setRequired(false)
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
    const reason = interaction.options.getString('reason') || undefined;

    await apiClient.banPlayer(serverId, player, reason);
    await interaction.editReply({
      embeds: [
        successEmbed(
          'Player Banned',
          `Banned \`${player}\`${reason ? ` for: ${reason}` : ''}`
        ),
      ],
    });
  } catch (error) {
    console.error('Error banning player:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to ban the player.')],
    });
  }
}
