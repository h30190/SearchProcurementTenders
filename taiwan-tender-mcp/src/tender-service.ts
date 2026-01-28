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

export interface TenderDetail {
  [key: string]: any;
}

/**
 * 解析民國日期字串 (如 "114/01/27 17:00") 並轉換為 Date 物件
 */
function parseROCDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(/[\/\s:]/);
  if (parts.length < 3) return null;

  const year = parseInt(parts[0]) + 1911;
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);
  const hour = parts[3] ? parseInt(parts[3]) : 0;
  const minute = parts[4] ? parseInt(parts[4]) : 0;

  return new Date(year, month, day, hour, minute);
}

/**
 * 計算剩餘天數
 */
function getRemainingDays(deadline: Date): string {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diff < 0) return "已截止";
  if (days === 0) return "今日截止";
  return `${days} 天`;
}

/**
 * 抓取單一標案的詳細資訊
 */
async function fetchTenderDetail(unitId: string, jobNumber: string, searchDate: number, searchFilename: string) {
  try {
    const url = `https://pcc-api.openfun.app/api/tender?unit_id=${unitId}&job_number=${jobNumber}`;
    const res = await axios.get(url, { timeout: 5000 });
    const records = res.data.records as any[];
    
    if (!records || records.length === 0) return null;

    let matched = records.find(r => r.date === searchDate && r.filename === searchFilename);
    if (!matched) matched = records[0];

    return matched.detail as TenderDetail;
  } catch (error) {
    return null;
  }
}

/**
 * 抓取並篩選標案
 */
export async function fetchAndFilterTenders(keyword: string) {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://pcc-api.openfun.app/api/searchbytitle?query=${encodedKeyword}`;
    
    const response = await axios.get(url, { timeout: 10000 });
    const records = response.data.records as TenderRecord[];

    if (!records || records.length === 0) return { results: [], hasMore: false };

    // 1. 初步篩選招標案件
    const candidates = records.filter(item => {
      const type = item.brief.type || "";
      return type.includes('招標') || type.includes('資格名單');
    });

    const limit = 30;
    const baseResults = candidates.slice(0, limit);
    const hasMore = candidates.length > limit;

    // 2. 並行抓取詳細資訊
    const results = await Promise.all(
      baseResults.map(async (item) => {
        const detail = await fetchTenderDetail(item.unit_id, item.job_number, item.date, item.filename);
        
        const publishDate = detail?.["招標資訊:公告日期"] || item.date.toString();
        const deadlineStr = detail?.["截止投標:截止投標時間"] || "-";
        const budget = detail?.["招標資訊:預算金額"] || "-";
        const awardType = detail?.["決標資訊:決標方式"] || "-";
        const tenderType = detail?.["招標資訊:招標方式"] || item.brief.type || "-";
        const caseId = detail?.["招標資訊:標案案號"] || item.job_number;
        
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

    // 3. 過濾掉已截止的案件
    const filteredResults = results.filter(r => r.remainingDays !== "已截止");
    
    return { 
      results: filteredResults, 
      hasMore: hasMore || (candidates.length > filteredResults.length && candidates.length > limit)
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error("連線標案 API 失敗");
  }
}