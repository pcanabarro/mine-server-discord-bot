import { GuildMember, CommandInteraction } from 'discord.js';
import { loadBotConfig } from '../utils/config';
import { errorEmbed } from '../utils/embeds';

export function hasPermission(member: GuildMember | null): boolean {
  const config = loadBotConfig();

  if (!member) {
    return false;
  }

  // If no roles are configured, deny all
  if (config.allowedRoleIds.length === 0) {
    console.warn('No allowed roles configured in bot-config.json');
    return false;
  }

  // Check if user has at least one of the allowed roles
  return config.allowedRoleIds.some((roleId) => member.roles.cache.has(roleId));
}

export async function checkPermission(interaction: CommandInteraction): Promise<boolean> {
  const member = interaction.member as GuildMember | null;

  if (!hasPermission(member)) {
    await interaction.reply({
      embeds: [
        errorEmbed(
          'Permission Denied',
          'You do not have permission to use this command. Contact a server administrator.'
        ),
      ],
      ephemeral: true,
    });
    return false;
  }

  return true;
}
