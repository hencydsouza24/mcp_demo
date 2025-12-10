import "dotenv/config";
import { createApp } from "./app";

const PORT = process.env.PORT || 5001;
const app = createApp();

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
	console.log(`MCP endpoint: http://localhost:${PORT}/mcp`);
	console.log(`Health: http://localhost:${PORT}/mcp/health`);
});
