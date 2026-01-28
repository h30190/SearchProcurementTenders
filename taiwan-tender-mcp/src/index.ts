import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchAndFilterTenders } from "./tender-service.js";

const server = new McpServer({
  name: "taiwan-tender-searcher",
  version: "1.0.0",
});

server.tool(
  "search_tenders",
  "搜尋台灣政府最新的招標公告與更正公告（自動過濾已結案或非招標案件）",
  {
    keyword: z.string().describe("搜尋關鍵字（例如：'AI'、'系統開發'、'室內裝修'）"),
  },
  async ({ keyword }) => {
    const results = await fetchAndFilterTenders(keyword);

    if (typeof results === "string") {
      return { content: [{ type: "text", text: results }] };
    }

    if (results.length === 0) {
      return { content: [{ type: "text", text: `根據政府目前的公告，找不到與「${keyword}」相關的活動中標案。` }] };
    }

    const formattedText = results.map(t => 
      `### ${t.type} ${t.title}\n` +
      `- **機關**：${t.org}\n` +
      `- **日期**：${t.date}\n` +
      `- **連結**：[點此開啟標案網頁](${t.link})\n`
    ).join("\n---\n\n");

    return {
      content: [
        {
          type: "text", 
          text: `找到以下與「${keyword}」相關的最新標案：\n\n${formattedText}` 
        }
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Taiwan Tender MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server fatal error:", error);
  process.exit(1);
});