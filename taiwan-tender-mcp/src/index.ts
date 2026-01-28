import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchAndFilterTenders } from "./tender-service.js";

const server = new McpServer({
  name: "taiwan-tender-searcher",
  version: "1.2.0",
});

server.tool(
  "search_tenders",
  "搜尋台灣政府招標中標案並以表格回傳（上限 30 筆）",
  {
    keyword: z.string().describe("搜尋關鍵字"),
  },
  async ({ keyword }) => {
    try {
      const { results, hasMore } = await fetchAndFilterTenders(keyword);

      if (results.length === 0) {
        return { content: [{ type: "text", text: `目前找不到與「${keyword}」相關且尚在投標期限內的招標案件。` }] };
      }

      let table = "| 公告日期 | 截止投標 | 剩餘天數 | 招標類別 | 標案案號 | 標案名稱 | 預算金額 | 決標概況 | 連結 |\n";
      table += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n";

      for (const t of results) {
        const sanitize = (s: any) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
        table += `| ${sanitize(t.publishDate)} | ${sanitize(t.deadline)} | **${sanitize(t.remainingDays)}** | ${sanitize(t.type)} | ${sanitize(t.caseId)} | ${sanitize(t.title)} | ${sanitize(t.budget)} | ${sanitize(t.awardType)} | [查看](${t.link}) |\n`;
      }

      let footer = `\n> [!TIP]\n> 以上資料由 PCC Smart Search 自動整理。`;
      if (hasMore) {
        footer += `\n> **注意：搜尋結果超過 30 筆，僅顯示前 30 筆。若需更多結果，請縮小關鍵字範圍或告知我繼續爬取。**`;
      }

      return {
        content: [
          {
            type: "text", 
            text: `### 搜尋關鍵字：「${keyword}」\n\n${table}${footer}` 
          }
        ],
      };
    } catch (error: any) {
      return { content: [{ type: "text", text: `錯誤: ${error.message}` }] };
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