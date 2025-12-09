# Quick Start

## Setup & Run

```bash
npm install          # Install dependencies
npm run dev          # Development with file watching
# or
npm run build && npm start  # Production
```

Server: `http://localhost:3001`

## Test Endpoints

```bash
# Health check
curl http://localhost:3001/mcp/health

# Server info
curl http://localhost:3001/mcp/info
```

## Add a Tool

Edit `src/tools/index.ts`:

```typescript
{
  name: "my-tool",
  description: "What this tool does",
  inputSchema: {
    input: z.string().describe("Input parameter"),
  },
  handler: async (args) => {
    return `Result: ${args.input}`;
  },
}
```

Rebuild:
```bash
npm run build && npm start
```

## Commands

```bash
npm run dev         # Development mode
npm run build       # Build to dist/
npm run type-check  # Type checking
npm start           # Run production build
```

## Project

- **201 lines** of source code
- **5 modules** with single responsibility
- **TypeScript** strict mode
- **Official MCP SDK** integration
