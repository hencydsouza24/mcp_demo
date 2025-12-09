import * as z from "zod";
import type { ToolConfig } from "../server/mcp";

export const tools: ToolConfig[] = [
	{
		name: "add",
		description: "Add two numbers",
		inputSchema: {
			a: z.number().describe("First number"),
			b: z.number().describe("Second number"),
		},
		handler: async (args) => {
			const a = args.a as number;
			const b = args.b as number;
			return `${a} + ${b} = ${a + b}`;
		},
	},
	{
		name: "multiply",
		description: "Multiply two numbers",
		inputSchema: {
			x: z.number().describe("First number"),
			y: z.number().describe("Second number"),
		},
		handler: async (args) => {
			const x = args.x as number;
			const y = args.y as number;
			return `${x} * ${y} = ${x * y}`;
		},
	},
	{
		name: "echo",
		description: "Echo a message",
		inputSchema: {
			message: z.string().describe("Message to echo"),
		},
		handler: async (args) => {
			const message = args.message as string;
			return `Echo: ${message}`;
		},
	},
];
