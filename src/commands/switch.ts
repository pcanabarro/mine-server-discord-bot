import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { successEmbed, errorEmbed } from '../utils/embeds';
import { setActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('switch')
  .setDescription('Switch to a different Minecraft server')
  .addStringOption((option) =>
    option.setName('server_id').setDescription('Server ID to switch to').setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  if (!(await checkPermission(interaction))) return;

  await interaction.deferReply();

  try {
    const serverId = interaction.options.getString('server_id', true);

    // Verify the server exists
    const servers = await apiClient.getServers();
    const server = servers.find((s) => s.id === serverId);

    if (!server) {
      await interaction.editReply({
        embeds: [
          errorEmbed(
            'Server Not Found',
            `No server with ID \`${serverId}\` found.\nUse /servers to list available servers.`
          ),
        ],
      });
      return;
    }

    setActiveServerId(serverId);
    await interaction.editReply({
      embeds: [
        successEmbed(
          'Server Switched',
          `Now managing: **${server.name || serverId}**`
        ),
      ],
    });
  } catch (error) {
    console.error('Error switching server:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to switch servers.')],
    });
  }
}
