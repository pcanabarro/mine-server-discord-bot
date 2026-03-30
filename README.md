# Minecraft Discord Bot

A Discord bot for managing Minecraft servers via the [mine-server-api](../mine-server-api).

## Features

- **Server Control**: Start, stop, and restart Minecraft servers
- **Player Management**: View online players, manage whitelist, kick/ban/unban
- **Server Announcements**: Send `/say` messages to the server
- **Multi-Server Support**: Switch between multiple servers with `/switch`
- **Role-Based Permissions**: Only users with configured roles can execute commands

## Commands

| Command | Description |
|---------|-------------|
| `/status` | Check server status (online/offline, player count) |
| `/start` | Start the Minecraft server |
| `/stop` | Stop the Minecraft server |
| `/restart` | Restart the Minecraft server |
| `/players` | List online players |
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
3. Go to "Bot" section and create a bot
4. Copy the bot token
5. Enable "Server Members Intent" if needed
6. Go to OAuth2 > URL Generator, select `bot` and `applications.commands` scopes
7. Select required permissions and use the generated URL to invite the bot

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

3. Configure `config/bot-config.json`:
   ```json
   {
     "allowedRoleIds": ["123456789012345678"],
     "defaultServerId": "survival",
     "embedColors": {
       "success": "#00FF00",
       "error": "#FF0000",
       "info": "#0099FF",
       "warning": "#FFAA00"
     }
   }
   ```

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
| `defaultServerId` | Default server to manage on startup |
| `embedColors` | Colors for embed messages (success, error, info, warning) |

## Permissions

Users must have at least one of the roles listed in `allowedRoleIds` to use any command. If no roles are configured, all commands will be denied.

To get a role ID:
1. Enable Developer Mode in Discord (Settings > App Settings > Advanced)
2. Right-click the role and select "Copy ID"

## Requirements

- Node.js 18+
- mine-server-api running and accessible
- Discord bot with `applications.commands` scope

## License

ISC
