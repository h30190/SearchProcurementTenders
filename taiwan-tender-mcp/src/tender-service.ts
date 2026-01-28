import axios from 'axios';

// 政府開放平台「招標公告-當日」資料集 ID
const DATASET_ID = '30265';
const METADATA_URL = `https://data.gov.tw/api/v2/rest/dataset/${DATASET_ID}`;

export interface TenderItem {
  案號: string;
  標案名稱: string;
  招標機關名稱: string;
  招標機關代碼: string;
  公告類別: string;
  預算金額: string | number;
  截止投標時間: string;
}

export async function fetchAndFilterTenders(keyword: string) {
  try {
    // 1. 取得最新資源連結 (Metadata)
    const meta = await axios.get(METADATA_URL);
    const resources = meta.data.result.resources;
    
    // 取得最近的兩個 JSON 資源 (今天與昨天)
    const jsonResources = resources
      .filter((r: any) => r.format.toUpperCase() === 'JSON')
      .slice(0, 2);

    if (jsonResources.length === 0) return "目前政府平台尚未提供 JSON 資料。";

    // 2. 並行下載資料
    const dataArrays = await Promise.all(
      jsonResources.map(async (res: any) => {
        try {
          const resp = await axios.get(res.url, { timeout: 10000 });
          return resp.data as TenderItem[];
        } catch (e) {
          console.error(`下載資源失敗: ${res.url}`, e);
          return [] as TenderItem[];
        }
      })
    );

    // 3. 合併、去重、過濾
    const tenderMap = new Map<string, any>();
    const searchKeyword = keyword.toLowerCase();

    dataArrays.flat().forEach(item => {
      if (!item || !item.標案名稱) return;

      // 篩選條件：只要「招標公告」或「更正公告」
      const isLive = item.公告類別 === '招標公告' || item.公告類別 === '更正公告';
      const matches = item.標案名稱.toLowerCase().includes(searchKeyword) || 
                      item.招標機關名稱.toLowerCase().includes(searchKeyword);

      if (isLive && matches) {
        // 去重邏輯：如果案號重複，更正公告優先覆蓋，或保留最新看到的
        const existing = tenderMap.get(item.案號);
        if (!existing || item.公告類別 === '更正公告') {
          tenderMap.set(item.案號, {
            title: item.標案名稱,
            org: item.招標機關名稱,
            type: item.公告類別 === '更正公告' ? '[更正]' : '[招標]',
            budget: item.預算金額,
            deadline: item.截止投標時間,
            // 自動拼湊直接連結
            link: `https://web.pcc.gov.tw/tps/tpam/main/tps/tpam/tpam_check.do?searchMode=common&method=initItm&unit_id=${item.招標機關代碼}&job_number=${item.案號}`
          });
        }
      }
    });

    return Array.from(tenderMap.values());
  } catch (error) {
    console.error('Fetch Error:', error);
    return "抓取標案資料時發生錯誤，可能政府平台連線不穩，請稍後再試。";
  }
}
