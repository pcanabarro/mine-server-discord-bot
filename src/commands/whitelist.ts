import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ColorResolvable } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { loadBotConfig } from '../utils/config';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('whitelist')
  .setDescription('Manage the server whitelist')
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('View all whitelisted players')
  )
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

    if (subcommand === 'list') {
      const whitelist = await apiClient.getWhitelist(serverId);
      const config = loadBotConfig();

      const embed = new EmbedBuilder()
        .setColor(config.embedColors.info as ColorResolvable)
        .setTitle('📋 Whitelist')
        .setTimestamp();

      if (whitelist.length === 0) {
        embed.setDescription('No players whitelisted.');
      } else {
        embed.setDescription(whitelist.map((p) => `• ${p}`).join('\n'));
        embed.setFooter({ text: `${whitelist.length} player(s)` });
      }

      await interaction.editReply({ embeds: [embed] });
    } else if (subcommand === 'add') {
      const player = interaction.options.getString('player', true);
      await apiClient.addToWhitelist(serverId, player);
      await interaction.editReply({
        embeds: [successEmbed('Whitelist Updated', `Added \`${player}\` to the whitelist.`)],
      });
    } else if (subcommand === 'remove') {
      const player = interaction.options.getString('player', true);
      await apiClient.removeFromWhitelist(serverId, player);
      await interaction.editReply({
        embeds: [successEmbed('Whitelist Updated', `Removed \`${player}\` from the whitelist.`)],
      });
    }
  } catch (error) {
    console.error('Error managing whitelist:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to manage the whitelist.')],
    });
  }
}
