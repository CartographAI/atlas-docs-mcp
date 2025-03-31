#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ToolSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ATLAS_API_URL = process.env.ATLAS_API_URL ?? "https://atlas.cartograph.app/api";

const server = new Server(
  {
    name: "atlas-docs-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

// Schema definitions
const ListDocsSchema = z.object({});

const GetDocsIndexSchema = z.object({
  docName: z.string().describe("Name of the documentation set"),
});

const GetDocsFullSchema = z.object({
  docName: z.string().describe("Name of the documentation set"),
});

const GetDocsPageSchema = z.object({
  docName: z.string().describe("Name of the documentation set"),
  pagePath: z
    .string()
    .describe(
      "The root-relative path of the specific documentation page (e.g., '/guides/getting-started', '/api/authentication')",
    ),
});

const SearchDocsSchema = z.object({
  docName: z.string().describe("Name of the documentation set"),
  query: z.string().describe("Search query to find relevant pages within the documentation set"),
});

const ToolInputSchema = ToolSchema.shape.inputSchema;
type ToolInput = z.infer<typeof ToolInputSchema>;

async function fetchApi(path: string) {
  const response = await fetch(`${ATLAS_API_URL}${path}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }
  return response.json();
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_docs",
        description:
          "Lists all available documentation libraries and frameworks. Use this as your first step to discover available documentation sets. Returns name, description and source url for each documentation set. Required before using other documentation tools since you need the docName.",
        inputSchema: zodToJsonSchema(ListDocsSchema) as ToolInput,
      },
      {
        name: "search_docs",
        description:
          "Searches a documentation set for specific content. Use this to find pages containing particular keywords, concepts, or topics. Returns matching pages ranked by relevance with their paths and descriptions. Follow up with get_docs_page to get full content.",
        inputSchema: zodToJsonSchema(SearchDocsSchema) as ToolInput,
      },
      {
        name: "get_docs_index",
        description:
          "Retrieves a condensed, LLM-friendly index of the pages in a documentation set. Use this for initial exploration to understand what's covered and identify relevant pages. Returns a markdown page with a list of available pages. Follow up with get_docs_page to get full content.",
        inputSchema: zodToJsonSchema(GetDocsIndexSchema) as ToolInput,
      },
      {
        name: "get_docs_page",
        description:
          "Retrieves a specific documentation page's content using its relative path. Use this to get detailed information about a known topic, after identifying the relevant page through get_docs_index or search_docs. Returns the complete content of a single documentation page.",
        inputSchema: zodToJsonSchema(GetDocsPageSchema) as ToolInput,
      },
      {
        name: "get_docs_full",
        description:
          "Retrieves the complete documentation content in a single consolidated file. Use this when you need comprehensive knowledge or need to analyze the full documentation context. Returns a large volume of text - consider using get_docs_page or search_docs for targeted information.",
        inputSchema: zodToJsonSchema(GetDocsFullSchema) as ToolInput,
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "list_docs": {
        const docs = await fetchApi("/docs");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(docs, null, 2),
            },
          ],
        };
      }

      case "get_docs_index": {
        const parsedArgs = GetDocsIndexSchema.safeParse(args);
        if (!parsedArgs.success) {
          throw new Error(`Invalid arguments: ${parsedArgs.error}`);
        }

        const docName = parsedArgs.data.docName;
        const page = await fetchApi(`/docs/${docName}/pages/%2Fllms.txt`);

        return {
          content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
        };
      }

      case "get_docs_full": {
        const parsedArgs = GetDocsFullSchema.safeParse(args);
        if (!parsedArgs.success) {
          throw new Error(`Invalid arguments: ${parsedArgs.error}`);
        }

        const docName = parsedArgs.data.docName;
        const page = await fetchApi(`/docs/${docName}/pages/%2Fllms-full.txt`);

        return {
          content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
        };
      }

      case "get_docs_page": {
        const parsedArgs = GetDocsPageSchema.safeParse(args);
        if (!parsedArgs.success) {
          throw new Error(`Invalid arguments: ${parsedArgs.error}`);
        }

        const { docName, pagePath } = parsedArgs.data;
        // we need to encodeURIComponent as the pagePath is likely to contain slashes
        const page = await fetchApi(`/docs/${docName}/pages/${encodeURIComponent(pagePath)}`);

        return {
          content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
        };
      }

      case "search_docs": {
        const parsedArgs = SearchDocsSchema.safeParse(args);
        if (!parsedArgs.success) {
          throw new Error(`Invalid arguments: ${parsedArgs.error}`);
        }

        const { docName, query } = parsedArgs.data;
        const searchResults = await fetchApi(`/docs/${docName}/search?q=${encodeURIComponent(query)}`);

        return {
          content: [{ type: "text", text: JSON.stringify(searchResults, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    };
  }
});

// Start server
export async function runServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error("Documentation MCP Server running on stdio");
  } catch (error) {
    console.error("Error during server setup:", error);
    process.exit(1);
  }
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
