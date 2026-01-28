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
 * 使用 pcc-api.openfun.app 抓取並篩選標案
 */
export async function fetchAndFilterTenders(keyword: string) {
  try {
    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://pcc-api.openfun.app/api/searchbytitle?query=${encodedKeyword}`;
    
    const response = await axios.get(url, { timeout: 10000 });
    const records = response.data.records as TenderRecord[];

    if (!records || records.length === 0) return [];

    // 在程式端進行過濾
    const filteredResults = records
      .filter(item => {
        const type = item.brief.type || "";
        // 篩選：只要包含「招標」字眼的（如公開招標、更正招標公告等）
        const isLive = type.includes('招標');
        return isLive;
      })
      .map(item => {
        return {
          title: item.brief.title,
          org: item.unit_name,
          type: item.brief.type,
          // 轉換日期 (從 YYYYMMDD 格式轉換，openfun 提供的是 Unix timestamp 或數字)
          date: item.date, 
          // 自動拼湊直接連結 (使用 openfun 的資訊或 pcc 官網格式)
          link: `https://web.pcc.gov.tw/tps/tpam/main/tps/tpam/tpam_check.do?searchMode=common&method=initItm&unit_id=${item.unit_id}&job_number=${item.job_number}`
        };
      });

    return filteredResults;
  } catch (error) {
    console.error('Fetch Error:', error);
    return "連線標案 API 失敗，請稍後再試。";
  }
}