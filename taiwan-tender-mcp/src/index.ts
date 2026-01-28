import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchAndFilterTenders } from "./tender-service.js";

/**
 * 建立 MCP 伺服器
 */
const server = new McpServer({
  name: "taiwan-tender-searcher",
  version: "1.0.0",
});

/**
 * 註冊搜尋工具
 * AI 可以透過此工具搜尋台灣政府最新的標案。
 */
server.tool(
  "search_tenders",
  "搜尋台灣政府最新的招標公告與更正公告（自動過濾已結案或非招標案件）",
  {
    keyword: z.string().describe("搜尋關鍵字（例如：'AI'、'系統開發'、'室內裝修'）"),
  },
  async ({ keyword }) => {
    // 呼叫服務層進行抓取與篩選
    const results = await fetchAndFilterTenders(keyword);

    // 處理錯誤訊息
    if (typeof results === "string") {
      return { content: [{ type: "text", text: results }] };
    }

    // 處理無結果的情況
    if (results.length === 0) {
      return { content: [{ type: "text", text: `根據政府今日與昨日的公告，找不到與「${keyword}」相關的活動中標案。` }] };
    }

    // 將結果格式化為 Markdown，方便 AI 閱讀與呈現
    const formattedText = results.map(t => 
      `### ${t.type} ${t.title}\n` +
      `- **機關**：${t.org}\n` +
      `- **預算**：${t.budget}\n` +
      `- **截止**：${t.deadline}\n` +
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

/**
 * 啟動伺服器 (使用 stdio 傳輸層)
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Taiwan Tender MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server fatal error:", error);
  process.exit(1);
});
