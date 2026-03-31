# AGENTS.md

## Project

Discord bot for managing Minecraft servers through the mine-server-api. This bot receives slash commands from Discord users and translates them into REST API calls to control Minecraft servers.

## Product Direction

- This is a Discord bot client that consumes the mine-server-api.
- No direct Minecraft server interaction - all operations go through the API.
- Role-based permissions control who can execute commands.
- Rich embed responses for user-friendly output.

## Core Responsibilities

- Authenticate with mine-server-api using JWT tokens.
- Register and handle Discord slash commands.
- Enforce role-based permissions before executing any command.
- Map Discord commands to API endpoints.
- Display results using rich Discord embeds.
- Track the currently active server for multi-server management.

## Non-Goals

- No direct RCON or console access to Minecraft servers.
- No database - all state is runtime only (active server selection).
- No web dashboard or HTTP server.
- No direct file system access to Minecraft server folders.

## Stack

- Runtime: `Node.js 18+`
- Language: `TypeScript`
- Discord Library: `discord.js v14`
- HTTP Client: `axios`
- Config: `dotenv` for secrets, JSON for bot settings

## High-Level Architecture

```
src/
├── api/
│   ├── auth.ts           # JWT authentication with auto-refresh
│   └── client.ts         # HTTP client for all API endpoints
├── commands/
│   ├── index.ts          # Command registry and active server tracking
│   ├── status.ts         # /status
│   ├── start.ts          # /start
│   ├── stop.ts           # /stop
│   ├── restart.ts        # /restart
│   ├── players.ts        # /players
│   ├── whitelist.ts      # /whitelist list|add|remove
│   ├── kick.ts           # /kick
│   ├── ban.ts            # /ban
│   ├── unban.ts          # /unban
│   ├── say.ts            # /say
│   ├── info.ts           # /info
│   ├── servers.ts        # /servers
│   └── switch.ts         # /switch
├── guards/
│   └── permission.ts     # Role-based access control
├── types/
│   └── index.ts          # TypeScript interfaces
├── utils/
│   ├── config.ts         # Environment and JSON config loader
│   └── embeds.ts         # Embed message builders
├── bot.ts                # Discord client setup and event handling
└── index.ts              # Entry point
```

## Slash Commands

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `/status` | `GET /servers/:id` | Server state and online status |
| `/start` | `POST /servers/:id/start` | Start the server |
| `/stop` | `POST /servers/:id/stop` | Stop the server |
| `/restart` | `POST /servers/:id/restart` | Restart the server |
| `/players` | `GET /servers/:id/players` | List online players |
| `/whitelist list` | `GET /servers/:id/whitelist` | View whitelist |
| `/whitelist add` | `POST /servers/:id/whitelist` | Add to whitelist |
| `/whitelist remove` | `DELETE /servers/:id/whitelist/:player` | Remove from whitelist |
| `/kick` | `POST /servers/:id/kick` | Kick a player |
| `/ban` | `POST /servers/:id/ban` | Ban a player |
| `/unban` | `DELETE /servers/:id/ban/:player` | Unban a player |
| `/say` | `POST /servers/:id/say` | Broadcast announcement |
| `/info` | `GET /servers/:id/info` | Server metadata |
| `/servers` | `GET /servers` | List all servers |
| `/switch` | Runtime only | Change active server |

## Configuration

### Environment Variables (config/.env)

- `DISCORD_TOKEN` - Bot token from Discord Developer Portal
- `API_URL` - mine-server-api base URL (default: http://localhost:3000)
- `API_USERNAME` - API authentication username
- `API_PASSWORD` - API authentication password

### Bot Config (config/bot-config.json)

- `allowedRoleIds` - Array of Discord role IDs that can use commands
- `defaultServerId` - Server ID to use on startup (nullable)
- `embedColors` - Hex colors for success, error, info, warning embeds

## API Response Formats

The bot expects the following response structures from mine-server-api:

### GET /servers/:id
```json
{
  "id": "string",
  "name": "string",
  "status": {
    "state": "stopped|starting|running|stopping|error",
    "live": true|false
  }
}
```

### GET /servers/:id/whitelist
```json
{
  "serverId": "string",
  "count": 0,
  "players": ["player1", "player2"]
}
```

### POST /auth
```json
{
  "accessToken": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": "12h"
}
```

## Implementation Rules

- All commands must check permissions before any API call.
- Always defer reply before making API calls (prevents Discord timeout).
- Handle API errors gracefully with user-friendly error embeds.
- Keep command files focused - one command per file.
- Use the shared embed builders for consistent styling.
- Never store sensitive data (tokens, passwords) in code or logs.

## Permission System

- Permissions are checked against Discord role IDs.
- User must have at least one role from `allowedRoleIds`.
- If `allowedRoleIds` is empty, all commands are denied.
- Permission checks happen before any API interaction.

## Error Handling

- API connection failures → Show API error message if available
- 401 Unauthorized → Auto-refresh token and retry once
- 4xx/5xx errors → Display the error message from API
- Missing active server → Prompt to use `/servers` and `/switch`

## Current Repo State

- Fully implemented and functional.
- All 13 slash commands implemented (15 including subcommands).
- Ready for deployment with proper configuration.
