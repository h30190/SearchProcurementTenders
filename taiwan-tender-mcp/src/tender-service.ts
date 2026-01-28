import axios from 'axios';

export interface TenderRecord {
  date: number;
  filename: string;
  job_number: string;
  unit_id: string;
  unit_name: string;
  brief: {
    title: string;
    type: string;
    category: string;
    status: string;
  };
}

/**
 * 強健提取：搜尋 records 中所有可能包含關鍵字的欄位
 */
function findInfo(history: any[], keywords: string[]): string {
  for (const rec of history) {
    if (!rec || !rec.detail) continue;
    const detail = rec.detail;
    const keys = Object.keys(detail);
    for (const kw of keywords) {
      const foundKey = keys.find(k => k.replace(/：/g, ':').includes(kw));
      if (foundKey && detail[foundKey] && !["-", "", "無"].includes(String(detail[foundKey]).trim())) {
        return String(detail[foundKey]).trim();
      }
    }
  }
  return "-";
}

function parseROCDate(dateStr: string): Date | null {
  if (!dateStr || dateStr === "-") return null;
  const match = dateStr.match(/(\d+)\/(\d+)\/(\d+)(?:\s+(\d+):(\d+))?/);
  if (!match) return null;
  const year = parseInt(match[1]) + 1911;
  const month = parseInt(match[2]) - 1;
  const day = parseInt(match[3]);
  const hour = match[4] ? parseInt(match[4]) : 0;
  const minute = match[5] ? parseInt(match[5]) : 0;
  return new Date(year, month, day, hour, minute);
}

function getRemainingDays(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const totalHours = diff / (1000 * 60 * 60);
  const days = Math.floor(totalHours / 24);
  if (diff < 0) return "已截止";
  if (days === 0 && totalHours > 0) return "今日截止";
  return `${days} 天`;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchAndFilterTenders(keyword: string) {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const searchUrl = `https://pcc-api.openfun.app/api/searchbytitle?query=${encodedKeyword}`;
    const searchRes = await axios.get(searchUrl, { timeout: 15000 });
    const records = searchRes.data.records as TenderRecord[];

    if (!records || records.length === 0) return { results: [], hasMore: false };

    const candidates = records.filter(item => {
      const t = item.brief.type || "";
      return t.includes("招標") || t.includes("資格名單");
    });

    const uniqueMap = new Map<string, TenderRecord>();
    candidates.forEach(rec => {
      const key = `${rec.unit_id}_${rec.job_number}`;
      const existing = uniqueMap.get(key);
      if (!existing || rec.date > existing.date) uniqueMap.set(key, rec);
    });

    const sortedUnique = Array.from(uniqueMap.values()).sort((a, b) => b.date - a.date);
    const limit = 20;
    const baseResults = sortedUnique.slice(0, limit);
    const hasMore = sortedUnique.length > limit;

    const results = [];
    for (const item of baseResults) {
      try {
        const tenderUrl = `https://pcc-api.openfun.app/api/tender?unit_id=${item.unit_id}&job_number=${item.job_number}`;
        const detailRes = await axios.get(tenderUrl, { timeout: 8000 });
        const history = detailRes.data.records as any[];
        
        const publishDate = findInfo(history, ["公告日", "日期"]);
        const deadlineStr = findInfo(history, ["截止投標"]);
        const caseId = findInfo(history, ["標案案號", "案號"]);
        const title = findInfo(history, ["標案名稱", "案名"]);
        const budget = findInfo(history, ["預算金額", "金額"]);
        
        // 修正連結抓取邏輯：嚴格抓取 detail.url 且不做不必要的拼接
        let link = "-";
        if (history && history.length > 0) {
          // 只要找到任何一筆歷史紀錄中有 url 就採用 (通常第一筆就是最新的)
          const recWithUrl = history.find(r => r.detail && r.detail.url);
          link = recWithUrl ? recWithUrl.detail.url : "-";
        }
        
        // 只有在確實是相對路徑時才補全
        if (link.startsWith("/") && !link.startsWith("//")) {
          link = `https://web.pcc.gov.tw${link}`;
        }

        const tenderType = (history && history[0]?.type) || item.brief.type || "-";
        
        let remainingDays = "-";
        const deadlineDate = parseROCDate(deadlineStr);
        if (deadlineDate) {
          remainingDays = getRemainingDays(deadlineDate);
        }

        results.push({
          publishDate: publishDate !== "-" ? publishDate : String(item.date),
          deadline: deadlineStr,
          remainingDays,
          type: tenderType,
          caseId: caseId !== "-" ? caseId : item.job_number,
          title: title !== "-" ? title : item.brief.title,
          budget,
          link
        });
        
        await sleep(50);
      } catch (e) {
        continue;
      }
    }

    const finalResults = results.filter(r => r.remainingDays !== "已截止");
    return { results: finalResults, hasMore };
  } catch (error) {
    throw new Error("Connection failed to Procurement API");
  }
}