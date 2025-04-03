# Atlas Docs MCP Server

[![NPM Version](https://img.shields.io/npm/v/%40cartographai%2Fatlas-docs-mcp)](https://www.npmjs.com/package/@cartographai/atlas-docs-mcp)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) server that provides AI assistants with documentation for libraries and frameworks.

> [!WARNING]
> Atlas Docs is currently in beta. Not everything might work perfectly, but we're actively improving the service. Your patience and [feedback](#support--feedback) are greatly appreciated!

## What Does This Server Do?

LLMs are great at generating general code, but suck at correctly using less popular or newly released libraries. This isn't surprising, since the models have not been trained comprehensively on code using these libraries.

Atlas Docs MCP server:

- Provides technical documentation for libraries and frameworks
- Processes the official docs into a clean markdown version for LLM consumption
- Is easy to set up with Cursor, Cline, Windsurf and any other MCP-compatible LLM clients

**Claude 3.5 Sonnet on its own:**

![elevenlabs-without-atlas-annotated](https://github.com/user-attachments/assets/78b8309c-0f86-4b20-93d7-2116419f75fd)

**Claude 3.5 Sonnet with Atlas Docs MCP:**

![elevenlabs-with-atlas-annotated](https://github.com/user-attachments/assets/258c5126-242f-43d1-8e78-ea655f44d76a)

<video src="https://github.com/user-attachments/assets/5fb1f3f2-18db-4ba4-8f47-da3892af22ee"></video>

## 📦 Installation

Atlas Docs MCP server works with any MCP client that supports the `stdio` protocol, including:

- Cursor
- Cline
- Windsurf
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

**Tip**: Prompt your model to check the docs eg. "Use the tools to check the documentation for Astro to ensure that you use the library correctly."

## 📒 Available Libraries

- AI-SDK (source: https://sdk.vercel.ai/docs/introduction)
- Astro (source: https://docs.astro.build/en/getting-started)
- ast-grep (source: https://ast-grep.github.io/llms.txt)
- Bun (source: https://bun.sh/llms.txt)
- CrewAI (source: https://docs.crewai.com/llms.txt)
- Drizzle (source: https://orm.drizzle.team/llms.txt)
- ElevenLabs (source: https://elevenlabs.io/docs/llms.txt)
- Fireworks (source: https://docs.fireworks.ai/llms.txt)
- Hono (source: https://hono.dev/llms.txt)
- Langgraph-js (source: https://langchain-ai.github.io/langgraphjs/llms.txt)
- Langgraph-py (source: https://langchain-ai.github.io/langgraph/llms.txt)
- Mastra (source: https://mastra.ai/llms.txt)
- ModelContextProtocol (source: https://modelcontextprotocol.io/llms.txt)
- Pglite (source: https://pglite.dev/docs/about)
- Prisma (source: https://www.prisma.io/docs/llms.txt)
- Resend (source: https://resend.com/docs/llms.txt)
- shadcn/ui (source: https://ui.shadcn.com/docs)
- Stripe (source: https://docs.stripe.com/llms.txt)
- Svelte (source: https://svelte.dev/docs/svelte/overview)
- SvelteKit (source: https://svelte.dev/docs/kit/introduction)
- Trigger.dev (source: https://trigger.dev/docs/llms.txt)
- X (source: https://docs.x.com/llms.txt)
- Zapier (source: https://docs.zapier.com/llms.txt)

Want docs for another library not in this list? Please [open an issue](https://github.com/CartographAI/atlas/issues/new) in this repo, we'll try to process and add it!

## 🔨 Available Tools

1. `list_docs`: List all available documentation sets
2. `get_docs_index`: Retrieves a condensed, LLM-friendly index of a documentation set
3. `get_docs_full`: Retrieves a complete documentation set in a single consolidated file
4. `search_docs`: Search a documentation set by keywords
5. `get_docs_page`: Retrieves a specific page of a documentation set

## 💭 How It Works

Atlas Docs processes tech libraries' documentation sites into clean, markdown versions. This MCP server provides the docs as MCP tools, calling Atlas Docs APIs for the data.

## Support & Feedback

Please [open an issue](https://github.com/CartographAI/atlas/issues/new) in this repo to request docs for a library, or to report a bug.

If you have any questions, feedback, or just want to say hi, we'd love to hear from you. You can find us on Cartograph's [Discord comunity](https://discord.gg/MsBA7U7hH5) for real-time support, or email us at [contact@cartograph.app](mailto:contact@cartograph.app)
