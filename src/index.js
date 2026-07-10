#!/usr/bin/env node
// falldental-us-mcp · MCP stdio server wrapping falldental-us-sdk · MIT · AI-Native Solutions
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'falldental-us-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'falldental-us_load_config',
    description: 'loadConfig · from falldental-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { loadConfig } = await import('@ai-native-solutions/falldental-us-sdk');
      return typeof loadConfig === 'function' ? await loadConfig(args) : { error: 'loadConfig not callable' };
    }
  },
  {
    name: 'falldental-us_save_config',
    description: 'saveConfig · from falldental-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { saveConfig } = await import('@ai-native-solutions/falldental-us-sdk');
      return typeof saveConfig === 'function' ? await saveConfig(args) : { error: 'saveConfig not callable' };
    }
  },
  {
    name: 'falldental-us_$',
    description: '$ · from falldental-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { $ } = await import('@ai-native-solutions/falldental-us-sdk');
      return typeof $ === 'function' ? await $(args) : { error: '$ not callable' };
    }
  },
  {
    name: 'falldental-us_esc',
    description: 'esc · from falldental-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { esc } = await import('@ai-native-solutions/falldental-us-sdk');
      return typeof esc === 'function' ? await esc(args) : { error: 'esc not callable' };
    }
  },
  {
    name: 'falldental-us_ai_tier',
    description: 'aiTier · from falldental-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { aiTier } = await import('@ai-native-solutions/falldental-us-sdk');
      return typeof aiTier === 'function' ? await aiTier(args) : { error: 'aiTier not callable' };
    }
  },
  {
    name: 'falldental-us_render_ai_chip',
    description: 'renderAiChip · from falldental-us-sdk',
    inputSchema: { type: 'object', properties: {} },
    handler: async (args) => {
      const { renderAiChip } = await import('@ai-native-solutions/falldental-us-sdk');
      return typeof renderAiChip === 'function' ? await renderAiChip(args) : { error: 'renderAiChip not callable' };
    }
  }
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS.map(({ handler, ...rest }) => rest)
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const t = TOOLS.find(x => x.name === req.params.name);
  if (!t) throw new Error('unknown tool: ' + req.params.name);
  const result = await t.handler(req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result) }] };
});

await server.connect(new StdioServerTransport());
console.error('falldental-us-mcp v1.0.0 · stdio ready');
