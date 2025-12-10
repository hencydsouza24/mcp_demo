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

	registerTool(config: ToolConfig): void {
		this.toolConfigs.push(config);
	}

	async handleRequest(
		req: IncomingMessage,
		res: ServerResponse,
		body?: unknown,
	): Promise<void> {
		const sessionId = req.headers["mcp-session-id"] as string;

		if (sessionId && this.sessions.has(sessionId)) {
			const { transport } = this.sessions.get(sessionId)!;
			await transport.handleRequest(req, res, body);
		} else {
			await this.createAndHandleNewSession(req, res, body);
		}
	}

	private async createAndHandleNewSession(
		req: IncomingMessage,
		res: ServerResponse,
		body?: unknown,
	): Promise<void> {
		const server = this.createServer();
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
			onsessioninitialized: (sessionId: string) => {
				this.sessions.set(sessionId, { transport, server });
			},
			onsessionclosed: (sessionId: string) => {
				this.sessions.delete(sessionId);
			},
		});

		await server.connect(transport);
		await transport.handleRequest(req, res, body);
	}

	private createServer(): McpServer {
		const server = new McpServer({
			name: "express-mcp-server",
			version: "1.0.0",
		});

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

	async closeSession(sessionId: string): Promise<void> {
		const sessionState = this.sessions.get(sessionId);
		if (sessionState) {
			await sessionState.server.close();
			this.sessions.delete(sessionId);
		}
	}
}
