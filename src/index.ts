#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Define tool input schemas using Zod
const AddToolSchema = z.object({
  a: z.number().describe("First number"),
  b: z.number().describe("Second number"),
});

const GreetToolSchema = z.object({
  name: z.string().describe("Name to greet"),
});

// Create server instance
const server = new Server(
  {
    name: "claudebites-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Handler for listing available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "add",
        description: "Add two numbers together",
        inputSchema: {
          type: "object",
          properties: {
            a: {
              type: "number",
              description: "First number",
            },
            b: {
              type: "number",
              description: "Second number",
            },
          },
          required: ["a", "b"],
        },
      },
      {
        name: "greet",
        description: "Generate a greeting message",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name to greet",
            },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Handler for tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "add": {
        const validated = AddToolSchema.parse(args);
        const result = validated.a + validated.b;
        return {
          content: [
            {
              type: "text",
              text: `The sum of ${validated.a} and ${validated.b} is ${result}`,
            },
          ],
        };
      }

      case "greet": {
        const validated = GreetToolSchema.parse(args);
        return {
          content: [
            {
              type: "text",
              text: `Hello, ${validated.name}! Welcome to ClaudeBites MCP Server.`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid arguments: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
});

// Handler for listing resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "claudebites://info",
        name: "Server Information",
        description: "Information about the ClaudeBites MCP Server",
        mimeType: "text/plain",
      },
    ],
  };
});

// Handler for reading resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === "claudebites://info") {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `ClaudeBites MCP Server v1.0.0

This is a boilerplate Model Context Protocol server that demonstrates:
- Tool registration and execution
- Resource exposure
- Input validation with Zod
- TypeScript implementation

Available tools:
- add: Add two numbers
- greet: Generate a greeting message`,
        },
      ],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error("ClaudeBites MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
