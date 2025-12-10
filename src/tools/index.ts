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
			const { a, b } = args as { a: number; b: number };
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
			const { x, y } = args as { x: number; y: number };
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
			const { message } = args as { message: string };
			return `Echo: ${message}`;
		},
	},
];
