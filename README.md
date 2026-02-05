# ClaudeBites

AI workshop test project - Model Context Protocol Server

## Overview

This repository contains a boilerplate implementation of a Model Context Protocol (MCP) server. MCP is a standardized protocol that enables AI assistants like Claude to connect to external data sources and tools.

## Features

- 🚀 **TypeScript-based MCP server** with full type safety
- 🛠️ **Example tools** demonstrating tool registration and execution
- 📚 **Resource exposure** showing how to serve data
- ✅ **Input validation** using Zod schemas
- 📦 **Ready-to-use boilerplate** for building custom MCP servers

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/lorgan3/ClaudeBites.git
cd ClaudeBites
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

### Usage

#### Running the Server

The MCP server communicates via stdio (standard input/output):

```bash
npm start
```

#### Development Mode

To watch for changes and automatically rebuild:

```bash
npm run dev
```

## Project Structure

```
ClaudeBites/
├── src/
│   └── index.ts          # Main MCP server implementation
├── dist/                 # Compiled JavaScript output
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Available Tools

The boilerplate includes two example tools:

### 1. Add Tool
Adds two numbers together.

**Parameters:**
- `a` (number): First number
- `b` (number): Second number

**Example:**
```json
{
  "name": "add",
  "arguments": {
    "a": 5,
    "b": 3
  }
}
```

### 2. Greet Tool
Generates a personalized greeting message.

**Parameters:**
- `name` (string): Name to greet

**Example:**
```json
{
  "name": "greet",
  "arguments": {
    "name": "Alice"
  }
}
```

## Available Resources

### Server Information
- **URI:** `claudebites://info`
- **Description:** Returns information about the MCP server

## Configuring with Claude Desktop

To use this MCP server with Claude Desktop, add it to your Claude Desktop configuration:

### macOS
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claudebites": {
      "command": "node",
      "args": ["/absolute/path/to/ClaudeBites/dist/index.js"]
    }
  }
}
```

### Windows
Edit `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claudebites": {
      "command": "node",
      "args": ["C:\\absolute\\path\\to\\ClaudeBites\\dist\\index.js"]
    }
  }
}
```

After updating the configuration, restart Claude Desktop.

## Extending the Server

### Adding a New Tool

1. Define a Zod schema for input validation:
```typescript
const MyToolSchema = z.object({
  param1: z.string().describe("Description"),
  param2: z.number().describe("Description"),
});
```

2. Add the tool to the `ListToolsRequestSchema` handler:
```typescript
{
  name: "my_tool",
  description: "What the tool does",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "Description" },
      param2: { type: "number", description: "Description" },
    },
    required: ["param1", "param2"],
  },
}
```

3. Implement the tool logic in the `CallToolRequestSchema` handler:
```typescript
case "my_tool": {
  const validated = MyToolSchema.parse(args);
  // Your tool logic here
  return {
    content: [{ type: "text", text: "Result" }],
  };
}
```

### Adding a New Resource

1. Add the resource to the `ListResourcesRequestSchema` handler:
```typescript
{
  uri: "claudebites://my-resource",
  name: "My Resource",
  description: "Resource description",
  mimeType: "text/plain",
}
```

2. Implement the resource handler in the `ReadResourceRequestSchema` handler:
```typescript
if (uri === "claudebites://my-resource") {
  return {
    contents: [{
      uri,
      mimeType: "text/plain",
      text: "Resource content",
    }],
  };
}
```

## Development

### Building

```bash
npm run build
```

### Type Checking

TypeScript type checking is performed during the build process.

## Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop Configuration](https://modelcontextprotocol.io/docs/tools/claude-desktop)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
