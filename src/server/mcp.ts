import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { randomUUID } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";
import type * as z from "zod";

export type ToolHandler = (args: Record<string, unknown>) => Promise<string>;

export interface ToolConfig {
	name: string;
	description: string;
	inputSchema: Record<string, z.ZodSchema>;
	handler: ToolHandler;
}

interface SessionState {
	transport: StreamableHTTPServerTransport;
	server: McpServer;
}

export class MCP {
	private toolConfigs: ToolConfig[] = [];
	private sessions: Map<string, SessionState> = new Map();

	constructor() {
		// No longer create a single shared server
		// Each session will get its own server instance
	}

	registerTool(config: ToolConfig): void {
		// Store tool configs to register them on each new server instance
		this.toolConfigs.push(config);
	}

	private createAndConfigureServer(): McpServer {
		const server = new McpServer({
			name: "express-mcp-server",
			version: "1.0.0",
		});

		// Register all tools on this server instance
		for (const config of this.toolConfigs) {
			server.registerTool(
				config.name,
				{
					title: config.name,
					description: config.description,
					inputSchema: config.inputSchema,
				},
				async (args) => {
					const result = await config.handler(args as Record<string, unknown>);
					return {
						content: [{ type: "text" as const, text: result }],
					};
				},
			);
		}

		return server;
	}

	async handleRequest(
		req: IncomingMessage,
		res: ServerResponse,
		body?: unknown,
	): Promise<void> {
		// Extract session ID from headers if available
		const sessionId = req.headers["mcp-session-id"] as string;

		if (sessionId && this.sessions.has(sessionId)) {
			// Reuse existing session with existing transport and server
			const { transport } = this.sessions.get(sessionId)!;
			await transport.handleRequest(req, res, body);
		} else {
			// Create new session with its own server and transport
			const server = this.createAndConfigureServer();
			const transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => randomUUID(),
				onsessioninitialized: (newSessionId: string) => {
					console.log(`Session initialized: ${newSessionId}`);
					// Store the transport when session is initialized to avoid race conditions
					const sessionState: SessionState = { transport, server };
					this.sessions.set(newSessionId, sessionState);
				},
				onsessionclosed: (closedSessionId: string) => {
					console.log(`Session closed: ${closedSessionId}`);
					// Clean up the session
					this.sessions.delete(closedSessionId);
				},
			});

			// Connect this transport to its own server
			// This is safe because we only have one transport per server
			await server.connect(transport);

			// Handle the request
			await transport.handleRequest(req, res, body);
		}
	}

	// Optional: Method to explicitly close a session
	async closeSession(sessionId: string): Promise<void> {
		const sessionState = this.sessions.get(sessionId);
		if (sessionState) {
			await sessionState.server.close();
			this.sessions.delete(sessionId);
		}
	}
}
