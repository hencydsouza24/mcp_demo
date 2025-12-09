# Express MCP Server

A clean, modular implementation of the Model Context Protocol (MCP) using Express.js and TypeScript.

## Quick Start

```bash
# Install dependencies
npm install

# Development (with file watching)
npm run dev

# Production
npm run build
npm start

# Type checking
npm run type-check
```

Server runs on `http://localhost:3001`

## Endpoints

- **Health**: `GET /mcp/health` - Server health status
- **Info**: `GET /mcp/info` - Server information and capabilities
- **MCP Protocol**: `POST/GET/DELETE /mcp` - Main MCP endpoints with streaming support

## Project Structure

```
src/
├── index.ts              Entry point - starts the server
├── app.ts                Express app factory
├── server/
│   └── mcp.ts            Core MCP server logic
├── routes/
│   └── mcp.ts            HTTP route handlers
└── tools/
    └── index.ts          Tool definitions
```

**Total: 201 lines of focused, readable code**

## Architecture

### Single Responsibility Principle
Each module has one clear purpose:
- `index.ts` (10 lines) - Server startup
- `app.ts` (20 lines) - Express setup
- `server/mcp.ts` (60 lines) - MCP protocol handling
- `routes/mcp.ts` (69 lines) - HTTP routing
- `tools/index.ts` (42 lines) - Tool catalog

### Features

✓ Official MCP SDK integration (`StreamableHTTPServerTransport`)
✓ HTTP streaming (chunked encoding + Server-Sent Events)
✓ Session management with automatic UUID generation
✓ Zod schema validation for tool inputs
✓ Comprehensive error handling
✓ Health check and info endpoints
✓ TypeScript strict mode

## Tools

Three example tools are included:

1. **add(a, b)** - Add two numbers
2. **multiply(x, y)** - Multiply two numbers  
3. **echo(message)** - Echo a message

### Adding a New Tool

Edit `src/tools/index.ts` and add to the array:

```typescript
{
  name: "my-tool",
  description: "What this tool does",
  inputSchema: {
    param1: z.string().describe("Parameter description"),
    param2: z.number().describe("Another parameter"),
  },
  handler: async (args) => {
    const p1 = args.param1 as string;
    const p2 = args.param2 as number;
    // Tool logic here
    return `Result: ${p1} ${p2}`;
  },
}
```

Then rebuild:
```bash
npm run build
npm start
```

## Testing

```bash
# Health check
curl http://localhost:3001/mcp/health

# Server info
curl http://localhost:3001/mcp/info

# MCP protocol request (with proper headers)
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## Development

```bash
# Watch mode (recompiles on file changes)
npm run dev

# Type checking only
npm run type-check

# Build production bundle
npm run build
```

## Environment Variables

- `PORT` (default: 3001) - Server port

```bash
PORT=4000 npm start
```

## Stack

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Zod** - Schema validation
- **MCP SDK** - Protocol implementation
- **Node.js 18+** - Runtime

## Standards

- MCP Protocol Version: 2024-11-05
- HTTP Streaming: Chunked encoding + SSE
- Schema Validation: Zod
- Code Format: TypeScript with strict mode
- Code Style: Tabs, consistent formatting

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture overview
- [QUICK_START.md](./QUICK_START.md) - 5-minute setup guide
- [COMMANDS.md](./COMMANDS.md) - Command reference
- [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md) - Development history

## License

MIT
