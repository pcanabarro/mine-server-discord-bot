# Minecraft Discord Bot

A Discord bot for managing Minecraft servers via the [mine-server-api](../mine-server-api).

## Features

- **Server Control**: Start, stop, and restart Minecraft servers
- **Player Management**: View online players, manage whitelist, kick/ban/unban
- **Server Announcements**: Send `/say` messages to the server
- **Multi-Server Support**: Switch between multiple servers with `/switch`
- **Role-Based Permissions**: Only users with configured roles can execute commands
- **Rich Embeds**: Color-coded responses for better readability

## Commands

| Command | Description |
|---------|-------------|
| `/status` | Check server status (state, online/offline) |
| `/start` | Start the Minecraft server |
| `/stop` | Stop the Minecraft server |
| `/restart` | Restart the Minecraft server |
| `/players` | List online players |
| `/whitelist list` | View all whitelisted players |
| `/whitelist add <player>` | Add player to whitelist |
| `/whitelist remove <player>` | Remove player from whitelist |
| `/kick <player> [reason]` | Kick a player |
| `/ban <player> [reason]` | Ban a player |
| `/unban <player>` | Unban a player |
| `/say <message>` | Broadcast a message to the server |
| `/info` | Show server information (version, plugins/mods) |
| `/servers` | List all available servers |
| `/switch <server_id>` | Switch to a different server |

## Setup

### 1. Create Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and click "Reset Token" to get your bot token
4. Go to OAuth2 > URL Generator
5. Select scopes: `bot` and `applications.commands`
6. Select permissions: `Send Messages`, `Embed Links`, `Use Slash Commands`
7. Use the generated URL to invite the bot to your server

### 2. Configure the Bot

1. Copy the example environment file:
   ```bash
   cp config/.env.example config/.env
   ```

2. Edit `config/.env` with your credentials:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   API_URL=http://localhost:3000
   API_USERNAME=admin
   API_PASSWORD=your_api_password
   ```

3. Configure `config/bot-config.json` with allowed role IDs:
   ```json
   {
     "allowedRoleIds": ["123456789012345678"],
     "defaultServerId": null,
     "embedColors": {
       "success": "#00FF00",
       "error": "#FF0000",
       "info": "#0099FF",
       "warning": "#FFAA00"
     }
   }
   ```

   To get a role ID: Enable Developer Mode in Discord (Settings > Advanced), then right-click the role and select "Copy ID".

### 3. Install Dependencies

```bash
npm install
```

### 4. Build and Run

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Configuration

### Environment Variables (config/.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_TOKEN` | Discord bot token | Yes |
| `API_URL` | mine-server-api URL | Yes (default: http://localhost:3000) |
| `API_USERNAME` | API username | Yes |
| `API_PASSWORD` | API password | Yes |

### Bot Config (config/bot-config.json)

| Field | Description |
|-------|-------------|
| `allowedRoleIds` | Array of Discord role IDs that can use commands |
| `defaultServerId` | Default server ID to manage on startup (optional) |
| `embedColors` | Hex colors for embed messages |

## Permissions

Users must have at least one of the roles listed in `allowedRoleIds` to use any command. If no roles are configured, all commands will be denied.

## Project Structure

```
mine-server-discord-bot/
├── config/
│   ├── .env              # Secrets (not committed)
│   ├── .env.example      # Template for secrets
│   └── bot-config.json   # Bot settings
├── src/
│   ├── api/
│   │   ├── auth.ts       # JWT authentication
│   │   └── client.ts     # API HTTP client
│   ├── commands/         # Slash command handlers
│   ├── guards/
│   │   └── permission.ts # Role-based access control
│   ├── types/
│   │   └── index.ts      # TypeScript interfaces
│   ├── utils/
│   │   ├── config.ts     # Configuration loader
│   │   └── embeds.ts     # Embed message builders
│   ├── bot.ts            # Discord client setup
│   └── index.ts          # Entry point
├── package.json
└── tsconfig.json
```

## Requirements

- Node.js 18+
- mine-server-api running and accessible
- Discord bot with `bot` and `applications.commands` scopes

## License

ISC
