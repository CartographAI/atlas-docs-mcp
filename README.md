# Atlas Docs MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that provides AI assistants with documentation for libraries and frameworks.

## What Does This Server Do?

LLMs are great at generating general code, but suck at correctly using less popular or newly released libraries. This isn't surprising, since the models have not been trained comprehensively on code using these libraries.

Atlas Docs MCP server:

- Provides technical documentation for libraries and frameworks
- Processes the official docs into a clean markdown version for LLM consumption
- Is easy to set up with Cursor, Cline, Windsurf and any other MCP-compatible LLM clients

## Installation

Atlas Docs MCP server works with any MCP client that supports the `stdio` protocol, including:

- Cursor
- Windsurf
- Cline
- Claude Desktop

Add the following to your MCP client configuration file:

```json
{
  "mcpServers": {
    "atlas-docs": {
      "command": "npx",
      "args": ["-y", "@cartographai/atlas-docs-mcp"]
    }
  }
}
```

That's it! You may need to restart the app (for Claude Desktop) for the server to be recognised.

## Available Tools

1. `list_docs`: List all available documentation sets
2. `get_docs_index`: Retrieves a condensed, LLM-friendly index of a documentation set
3. `get_docs_full`: Retrieves a complete documentation set in a single consolidated file
4. `get_docs_page`: Retrieves a specific page of a documentation set

## How It Works

Atlas Docs processes tech libraries' documentation sites into clean, markdown versions. This MCP server provides the docs as MCP tools, calling Atlas Docs APIs for the data.

## Support & Feedback

Find us on Cartograph's [Discord comunity]() for real-time support, or email us at [contact@cartograph.app](mailto:contact@cartograph.app)
