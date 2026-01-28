import { fetchAndFilterTenders } from './build/tender-service.js';

async function testInteriorFinal() {
  const keyword = "室內裝修";
  try {
    const { results, hasMore } = await fetchAndFilterTenders(keyword);

    if (results.length === 0) {
      console.log("無結果。");
      return;
    }

    let table = "| 公告日期 | 截止投標 | 剩餘天數 | 招標類別 | 標案案號 | 標案名稱 | 預算金額 | 決標概況 | 連結 |
";
    table += "| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
";

    for (const t of results.slice(0, 5)) {
      const sanitize = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
      table += `| ${sanitize(t.publishDate)} | ${sanitize(t.deadline)} | **${sanitize(t.remainingDays)}** | ${sanitize(t.type)} | ${sanitize(t.caseId)} | ${sanitize(t.title)} | ${sanitize(t.budget)} | ${sanitize(t.awardType)} | [查看](${t.link}) |
`;
    }

    console.log(`### 搜尋關鍵字：「${keyword}」\n`);
    console.log(table);
    console.log(`\n> [!TIP]\n> 以上資料由 PCC Smart Search 自動整理。`);
    if (hasMore) {
      console.log(`> **注意：搜尋結果超過 30 筆...**`);
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}

testInteriorFinal();