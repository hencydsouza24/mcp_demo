import express from "express";
import { MCP } from "./server/mcp";
import { createMCPRouter } from "./routes/mcp";
import { tools } from "./tools/index";

export function createApp(): express.Application {
  const app = express();

  app.use(express.json());

  const mcp = new MCP();

  tools.forEach((tool) => {
    mcp.registerTool(tool);
  });

  app.use("/mcp", createMCPRouter(mcp));

  return app;
}
