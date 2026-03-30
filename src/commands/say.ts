import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('say')
  .setDescription('Send an announcement to the server')
  .addStringOption((option) =>
    option.setName('message').setDescription('Message to broadcast').setRequired(true)
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

    const message = interaction.options.getString('message', true);

    await apiClient.say(serverId, message);
    await interaction.editReply({
      embeds: [successEmbed('Announcement Sent', `Message: "${message}"`)],
    });
  } catch (error) {
    console.error('Error sending announcement:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to send the announcement.')],
    });
  }
}
