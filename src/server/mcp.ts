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
	private transport: StreamableHTTPServerTransport;
	private connected = false;

	constructor() {
		this.transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: () => randomUUID(),
		});

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

	async handleRequest(
		req: IncomingMessage,
		res: ServerResponse,
		body?: unknown,
	): Promise<void> {
		if (!this.connected) {
			await this.server.connect(this.transport);
			this.connected = true;
		}
		await this.transport.handleRequest(req, res, body);
	}
}
