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

## Recommended Stack

- Runtime: `Node.js`
- Language: `TypeScript`
- Discord Library: `discord.js`
- HTTP Client: `axios`
- Config: `dotenv` for secrets, JSON for bot settings

## High-Level Architecture

- `api/auth.ts`:
  - Authenticates with mine-server-api
  - Manages JWT token with auto-refresh before expiration
- `api/client.ts`:
  - HTTP client wrapping all API endpoints
  - Automatically attaches bearer token to requests
  - Handles 401 errors with token refresh and retry
- `commands/`:
  - One file per slash command
  - Each command checks permissions, calls API, returns embed
- `guards/permission.ts`:
  - Checks if user has any of the allowed role IDs
  - Returns error embed if permission denied
- `utils/embeds.ts`:
  - Builders for success, error, info, and warning embeds
  - Consistent styling across all commands
- `utils/config.ts`:
  - Loads environment variables and bot-config.json

## Slash Commands

| Command | API Endpoint | Description |
|---------|--------------|-------------|
| `/status` | `GET /servers/:id/status` | Server status and player count |
| `/start` | `POST /servers/:id/start` | Start the server |
| `/stop` | `POST /servers/:id/stop` | Stop the server |
| `/restart` | `POST /servers/:id/restart` | Restart the server |
| `/players` | `GET /servers/:id/players` | List online players |
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

## Implementation Rules

- All commands must check permissions before any API call.
- Always defer reply before making API calls (prevents timeout).
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

- API connection failures → "Server unavailable" message
- 401 Unauthorized → Auto-refresh token and retry once
- 4xx/5xx errors → Display friendly error message
- Missing active server → Prompt to use `/servers` and `/switch`

## Testing Expectations

- Unit test permission guard with various role configurations.
- Unit test embed builders produce valid embeds.
- Mock API client for command handler tests.
- Integration test command registration.

## Dependencies on mine-server-api

This bot depends on the following API endpoints being available:

- `POST /auth` - JWT token issuance
- `GET /servers` - List available servers
- `GET /servers/:id` - Server details
- `GET /servers/:id/status` - Server status
- `POST /servers/:id/start` - Start server
- `POST /servers/:id/stop` - Stop server
- `POST /servers/:id/restart` - Restart server
- `GET /servers/:id/players` - Online players
- `POST /servers/:id/whitelist` - Add to whitelist
- `DELETE /servers/:id/whitelist/:player` - Remove from whitelist
- `POST /servers/:id/kick` - Kick player
- `POST /servers/:id/ban` - Ban player
- `DELETE /servers/:id/ban/:player` - Unban player
- `POST /servers/:id/say` - Server announcement
- `GET /servers/:id/info` - Server info
- `GET /servers/:id/extensions` - Plugins/mods list

## Current Repo State

- Fully implemented and functional.
- All 13 slash commands implemented.
- Ready for deployment with proper configuration.
