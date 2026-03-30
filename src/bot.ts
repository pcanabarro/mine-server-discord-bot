import { Client, GatewayIntentBits, Events } from 'discord.js';
import { commandCollection, registerCommands } from './commands';
import { authService } from './api/auth';

export async function createBot(token: string): Promise<Client> {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    console.log(`✅ Logged in as ${readyClient.user.tag}`);
    console.log(`📊 Serving ${readyClient.guilds.cache.size} guild(s)`);

    // Pre-authenticate with the API
    try {
      await authService.authenticate();
      console.log('✅ Authenticated with mine-server-api');
    } catch (error) {
      console.error('⚠️ Failed to authenticate with API:', error);
    }

    // Register slash commands
    try {
      await registerCommands(token, readyClient.user.id);
    } catch (error) {
      console.error('❌ Failed to register commands:', error);
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandCollection.get(interaction.commandName);
    if (!command) {
      console.warn(`Unknown command: ${interaction.commandName}`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      
      const errorMessage = 'An error occurred while executing this command.';
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, ephemeral: true });
      } else {
        await interaction.reply({ content: errorMessage, ephemeral: true });
      }
    }
  });

  return client;
}
