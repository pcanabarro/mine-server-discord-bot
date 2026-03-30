import { SlashCommandBuilder, CommandInteraction, ChatInputCommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('whitelist')
  .setDescription('Manage the server whitelist')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Add a player to the whitelist')
      .addStringOption((option) =>
        option.setName('player').setDescription('Player name to add').setRequired(true)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Remove a player from the whitelist')
      .addStringOption((option) =>
        option.setName('player').setDescription('Player name to remove').setRequired(true)
      )
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

    const subcommand = interaction.options.getSubcommand();
    const player = interaction.options.getString('player', true);

    if (subcommand === 'add') {
      await apiClient.addToWhitelist(serverId, player);
      await interaction.editReply({
        embeds: [successEmbed('Whitelist Updated', `Added \`${player}\` to the whitelist.`)],
      });
    } else if (subcommand === 'remove') {
      await apiClient.removeFromWhitelist(serverId, player);
      await interaction.editReply({
        embeds: [successEmbed('Whitelist Updated', `Removed \`${player}\` from the whitelist.`)],
      });
    }
  } catch (error) {
    console.error('Error managing whitelist:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to update the whitelist.')],
    });
  }
}
