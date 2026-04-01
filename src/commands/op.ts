import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('op')
  .setDescription('Give operator status to a player')
  .addStringOption((option) =>
    option.setName('player').setDescription('Player name to op').setRequired(true)
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

    await apiClient.opPlayer(serverId, player);
    await interaction.editReply({
      embeds: [
        successEmbed(
          'Player Opped',
          `Gave operator status to \`${player}\``
        ),
      ],
    });
  } catch (error) {
    console.error('Error opping player:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to give operator status to the player.')],
    });
  }
}
