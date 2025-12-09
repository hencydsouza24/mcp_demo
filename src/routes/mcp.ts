import { Router, type Request, type Response } from "express";
import type { MCP } from "../server/mcp";

export function createMCPRouter(mcp: MCP): Router {
	const router = Router();

	router.post("/", async (req: Request, res: Response) => {
		try {
			await mcp.handleRequest(req, res, req.body);
		} catch (error) {
			const err = error as Error;
			console.error("MCP request error:", err);
			if (!res.headersSent) {
				res.status(500).json({
					jsonrpc: "2.0",
					error: { code: -32603, message: "Internal server error" },
					id: null,
				});
			}
		}
	});

	router.get("/", async (req: Request, res: Response) => {
		try {
			await mcp.handleRequest(req, res);
		} catch (error) {
			const err = error as Error;
			console.error("MCP GET error:", err);
			if (!res.headersSent) {
				res.status(500).json({
					jsonrpc: "2.0",
					error: { code: -32603, message: "Internal server error" },
					id: null,
				});
			}
		}
	});

	router.delete("/", async (req: Request, res: Response) => {
		try {
			await mcp.handleRequest(req, res);
		} catch (error) {
			const err = error as Error;
			console.error("MCP DELETE error:", err);
			if (!res.headersSent) {
				res.status(500).json({
					jsonrpc: "2.0",
					error: { code: -32603, message: "Internal server error" },
					id: null,
				});
			}
		}
	});

	router.get("/health", (_req: Request, res: Response) => {
		res.json({ status: "ok", message: "MCP server is running" });
	});

	router.get("/info", (_req: Request, res: Response) => {
		res.json({
			name: "express-mcp-server",
			version: "1.0.0",
			protocolVersion: "2024-11-05",
			capabilities: { tools: true },
		});
	});

	return router;
}
