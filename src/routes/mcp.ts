import { Router, type Request, type Response } from "express";
import type { MCP } from "../server/mcp";

export function createMCPRouter(mcp: MCP): Router {
	const router = Router();

	const handleRequest = async (req: Request, res: Response) => {
		try {
			await mcp.handleRequest(req, res, req.body);
		} catch (error) {
			console.error("MCP request error:", error);
			if (!res.headersSent) {
				res.status(500).json({
					jsonrpc: "2.0",
					error: { code: -32603, message: "Internal server error" },
					id: null,
				});
			}
		}
	};

	router.post("/", handleRequest);
	router.get("/", handleRequest);
	router.delete("/", handleRequest);

	router.get("/health", (_req: Request, res: Response) => {
		res.json({ status: "ok" });
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
