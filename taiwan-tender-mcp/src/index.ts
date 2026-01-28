import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchAndFilterTenders } from "./tender-service.js";

const server = new McpServer({
  name: "taiwan-tender-searcher",
  version: "1.3.0",
});

server.tool(
  "search_tenders",
  "搜尋台灣政府標案並以精確表格回傳（依公告日、截止投標、剩餘天數、類別、案號、案名、預算、連結排序）",
  {
    keyword: z.string().describe("搜尋關鍵字"),
  },
  async ({ keyword }) => {
    try {
      const { results, hasMore } = await fetchAndFilterTenders(keyword);

      if (results.length === 0) {
        return { content: [{ type: "text", text: `找不到與「${keyword}」相關且可投標的案件。` }] };
      }

      // 建立 Markdown 表格，欄位順序完全遵照使用者需求
      let table = "| 公告日 | 截止投標 | 剩餘天數 | 招標類別 | 標案案號 | 標案名稱 | 預算金額 | 連結 |\n";
      table += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n";

      for (const t of results) {
        const sanitize = (s: any) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
        table += `| ${sanitize(t.publishDate)} | ${sanitize(t.deadline)} | **${sanitize(t.remainingDays)}** | ${sanitize(t.type)} | ${sanitize(t.caseId)} | ${sanitize(t.title)} | ${sanitize(t.budget)} | [查看](${t.link}) |\n`;
      }

      let footer = `\n> [!TIP]\n> 資料來源：PCC Smart Search (基於 Openfun PCC-API)`;
      if (hasMore) {
        footer += "\n> **注意：搜尋結果較多，僅顯示前 30 筆。若需更多請縮小關鍵字範圍。**";
      }

      return {
        content: [
          {
            type: "text", 
            text: `### 關鍵字「${keyword}」的最新招標資訊\n\n${table}${footer}` 
          }
        ],
      };
    } catch (error: any) {
      return { content: [{ type: "text", text: `搜尋失敗: ${error.message}` }] };
    }
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
