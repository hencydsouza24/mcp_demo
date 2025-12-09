# Command Reference

## Development

### Run in development mode (with file watching)
```bash
npm run dev
```

### Type checking only (no build)
```bash
npm run type-check
```

### Build TypeScript to JavaScript
```bash
npm run build
```

## Production

### Build and run
```bash
npm run build && npm start
```

### Just run (assumes build is done)
```bash
npm start
```

## Project

### Install dependencies
```bash
npm install
```

### Check TypeScript compilation
```bash
npm run type-check
```

### Clean build artifacts
```bash
rm -rf dist
```

## Testing

### Health check
```bash
curl http://localhost:3001/mcp/health
```

### Server info
```bash
curl http://localhost:3001/mcp/info
```

### List tools (with proper headers)
```bash
curl -X POST http://localhost:3001/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## File Navigation

### Entry point
- `src/index.ts` - Start here

### App setup
- `src/app.ts` - Express app factory

### Core MCP logic
- `src/server/mcp.ts` - MCP server class

### HTTP routes
- `src/routes/mcp.ts` - Route handlers

### Tool definitions
- `src/tools/index.ts` - Add tools here

## Configuration

### Port (default 3001)
```bash
PORT=4000 npm start
```

### Development with specific port
```bash
PORT=4000 npm run dev
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm start
```

### TypeScript errors
```bash
# Check for type errors
npm run type-check

# Rebuild from scratch
rm -rf dist
npm run build
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Performance

### Build size check
```bash
ls -lh dist/index.js
```

### Startup time
```bash
time npm start
```

### Watch startup
```bash
time npm run dev
```
