import { createBot } from './bot';
import { env } from './utils/config';

async function main(): Promise<void> {
  console.log('🚀 Starting Minecraft Discord Bot...');

  try {
    const client = await createBot(env.discordToken);
    await client.login(env.discordToken);
  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

main();
