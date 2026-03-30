import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, ColorResolvable } from 'discord.js';
import { checkPermission } from '../guards/permission';
import { apiClient } from '../api/client';
import { errorEmbed } from '../utils/embeds';
import { loadBotConfig } from '../utils/config';
import { getActiveServerId } from './index';

export const data = new SlashCommandBuilder()
  .setName('servers')
  .setDescription('List all available Minecraft servers');

export async function execute(interaction: CommandInteraction): Promise<void> {
  if (!(await checkPermission(interaction))) return;

  await interaction.deferReply();

  try {
    const servers = await apiClient.getServers();
    const activeServerId = getActiveServerId();
    const config = loadBotConfig();

    const embed = new EmbedBuilder()
      .setColor(config.embedColors.info as ColorResolvable)
      .setTitle('🖥️ Available Servers')
      .setTimestamp();

    if (servers.length === 0) {
      embed.setDescription('No servers found.');
    } else {
      const serverList = servers.map((s) => {
        const active = s.id === activeServerId ? ' ✅ (active)' : '';
        return `• **${s.name || s.id}**${active}\n  ID: \`${s.id}\``;
      }).join('\n\n');
      embed.setDescription(serverList);
      embed.setFooter({ text: 'Use /switch <server_id> to change the active server' });
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error listing servers:', error);
    await interaction.editReply({
      embeds: [errorEmbed('Error', 'Failed to list servers. Is the API available?')],
    });
  }
}
