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
 * 彈性提取 Detail 中的值 (處理全半型冒號與不同前綴)
 */
function getValue(detail: any, keyNames: string[]): string {
  if (!detail) return "-";
  const keys = Object.keys(detail);
  for (const name of keyNames) {
    const foundKey = keys.find(k => k.includes(name));
    if (foundKey) return String(detail[foundKey]).trim();
  }
  return "-";
}

/**
 * 解析日期字串 (處理 "114/01/27 17:00")
 */
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

async function fetchTenderDetail(unitId: string, jobNumber: string, searchDate: number, searchFilename: string) {
  try {
    const url = `https://pcc-api.openfun.app/api/tender?unit_id=${unitId}&job_number=${jobNumber}`;
    const res = await axios.get(url, { timeout: 5000 });
    const records = res.data.records as any[];
    if (!records || records.length === 0) return null;

    let matched = records.find(r => r.date === searchDate && r.filename === searchFilename);
    if (!matched) matched = records[0];
    return matched.detail;
  } catch {
    return null;
  }
}

export async function fetchAndFilterTenders(keyword: string) {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://pcc-api.openfun.app/api/searchbytitle?query=${encodedKeyword}`;
    const response = await axios.get(url, { timeout: 10000 });
    const records = response.data.records as TenderRecord[];

    if (!records || records.length === 0) return { results: [], hasMore: false };

    const candidates = records.filter(item => {
      const type = item.brief.type || "";
      return type.includes('招標') || type.includes('資格名單');
    });

    const limit = 30;
    const baseResults = candidates.slice(0, limit);
    const hasMore = candidates.length > limit;

    const results = await Promise.all(
      baseResults.map(async (item) => {
        const detail = await fetchTenderDetail(item.unit_id, item.job_number, item.date, item.filename);
        
        // 增加更多可能的 Key 組合以提高命中率
        const publishDate = getValue(detail, ["公告日期", "日期"]) !== "-" ? getValue(detail, ["公告日期", "日期"]) : item.date.toString();
        const deadlineStr = getValue(detail, ["截止投標時間", "截止投標", "投標期限"]);
        const budget = getValue(detail, ["預算金額", "採購金額"]);
        const awardType = getValue(detail, ["決標方式", "決標概況"]);
        const tenderType = getValue(detail, ["招標方式", "招標類別"]) !== "-" ? getValue(detail, ["招標方式", "招標類別"]) : (item.brief.type || "-");
        const caseId = getValue(detail, ["標案案號", "案號"]) !== "-" ? getValue(detail, ["標案案號", "案號"]) : item.job_number;
        
        let remainingDays = "-";
        const deadlineDate = parseROCDate(deadlineStr);
        if (deadlineDate) {
          remainingDays = getRemainingDays(deadlineDate);
        }

        return {
          publishDate,
          deadline: deadlineStr,
          remainingDays,
          type: tenderType,
          caseId,
          title: item.brief.title,
          budget,
          awardType,
          link: `https://web.pcc.gov.tw/tps/tpam/main/tps/tpam/tpam_check.do?searchMode=common&method=initItm&unit_id=${item.unit_id}&job_number=${item.job_number}`
        };
      })
    );

    // 過濾已截止案件並排序
    const filteredResults = results
      .filter(r => r.remainingDays !== "已截止")
      .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
    
    return { results: filteredResults, hasMore };
  } catch (error) {
    throw new Error("連線標案 API 失敗");
  }
}