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

export class MCP {
	private server: McpServer;
	private transports: Map<string, StreamableHTTPServerTransport> = new Map();
	private connectedTransports: Set<string> = new Set();

	constructor() {
		this.server = new McpServer({
			name: "express-mcp-server",
			version: "1.0.0",
		});
	}

	registerTool(config: ToolConfig): void {
		this.server.registerTool(
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

	private getOrCreateTransport(sessionId: string): StreamableHTTPServerTransport {
		if (!this.transports.has(sessionId)) {
			const transport = new StreamableHTTPServerTransport({
				sessionIdGenerator: () => sessionId,
			});
			this.transports.set(sessionId, transport);
		}
		return this.transports.get(sessionId)!;
	}

	private async connectTransport(transport: StreamableHTTPServerTransport, sessionId: string): Promise<void> {
		if (!this.connectedTransports.has(sessionId)) {
			await this.server.connect(transport);
			this.connectedTransports.add(sessionId);
		}
	}

	async handleRequest(
		req: IncomingMessage,
		res: ServerResponse,
		body?: unknown,
	): Promise<void> {
		// Extract session ID from headers if available
		const sessionId = (req.headers["mcp-session-id"] as string) || randomUUID();

		// Get or create transport for this session
		const transport = this.getOrCreateTransport(sessionId);

		// Connect transport to server if not already connected
		await this.connectTransport(transport, sessionId);

		// Handle the request
		await transport.handleRequest(req, res, body);
	}
}
