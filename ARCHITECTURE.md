# Architecture

## Overview

A minimal, modular MCP server built with Express.js and TypeScript using the official MCP SDK's `StreamableHTTPServerTransport`.

## Module Summary

| Module | Lines | Purpose |
|--------|-------|---------|
| `index.ts` | 10 | Server startup |
| `app.ts` | 20 | Express app factory |
| `server/mcp.ts` | 60 | MCP protocol wrapper |
| `routes/mcp.ts` | 69 | HTTP route handlers |
| `tools/index.ts` | 42 | Tool definitions |
| **Total** | **201** | |

## Data Flow

```
Client Request
    ↓
HTTP Route (routes/mcp.ts)
    ↓
MCP Handler (server/mcp.ts)
    ↓
Tool Execution (tools/index.ts)
    ↓
Response via StreamableHTTPServerTransport
```

## Module Responsibilities

### `src/index.ts` (10 lines)
- Parse environment variables
- Create and start Express server
- Startup logging

### `src/app.ts` (20 lines)
- Create Express app instance
- Add JSON middleware
- Instantiate MCP server
- Register all tools
- Mount MCP router

### `src/server/mcp.ts` (60 lines)
- Wrap official `McpServer` and `StreamableHTTPServerTransport`
- Handle tool registration with Zod schemas
- Manage server-to-transport connection
- Process HTTP requests

### `src/routes/mcp.ts` (69 lines)
- POST `/mcp` - Client requests
- GET `/mcp` - SSE streams
- DELETE `/mcp` - Session cleanup
- GET `/mcp/health` - Health check
- GET `/mcp/info` - Server info

### `src/tools/index.ts` (42 lines)
- Declarative tool array
- Each tool: name, description, input schema, handler
- Easy to extend

## Key Features

✓ **Minimal** - 201 lines of code
✓ **Modular** - Clear separation of concerns
✓ **Type-safe** - Full TypeScript strict mode
✓ **Official SDK** - Uses `StreamableHTTPServerTransport`
✓ **Streaming** - Chunked encoding + Server-Sent Events
✓ **Sessions** - Automatic UUID-based session management
✓ **Error handling** - MCP-compliant error responses

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | /mcp/health | Server health status |
| GET | /mcp/info | Server capabilities |
| POST | /mcp | Client requests |
| GET | /mcp | SSE streams |
| DELETE | /mcp | Session cleanup |

## Tool System

Tools are declared in `src/tools/index.ts`:

```typescript
{
  name: "tool-name",
  description: "Tool description",
  inputSchema: {
    param: z.string().describe("Parameter description"),
  },
  handler: async (args) => {
    return `Result: ${args.param}`;
  },
}
```

## Dependencies

- `@modelcontextprotocol/sdk` - Official MCP implementation
- `express` - Web framework
- `zod` - Schema validation
- `typescript` - Type safety

## Build & Run

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Type checking
npm run type-check
```

## Standards

- **Code**: TypeScript strict mode
- **Protocol**: MCP 2024-11-05
- **Streaming**: Chunked encoding + SSE
- **Validation**: Zod schemas
