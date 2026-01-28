import axios from 'axios';

async function findOfficialJson() {
  try {
    // 30265 是「招標公告-當日」的 Dataset ID
    const url = 'https://data.gov.tw/api/v2/rest/dataset/30265';
    console.log(`正在查詢元數據: ${url}`);
    const res = await axios.get(url);
    
    // 如果 V2 API 結構不同，我們直接看回傳的所有資源
    const resources = res.data.result?.resources || res.data.resources;
    
    if (resources) {
      const jsonRes = resources.find(r => r.format.toLowerCase() === 'json');
      if (jsonRes) {
        console.log('✅ 找到官方 JSON 下載網址:', jsonRes.url);
        
        // 嘗試下載前幾個位元組確認內容
        const content = await axios.get(jsonRes.url, { timeout: 10000 });
        console.log('✅ 成功下載官方資料，資料筆數:', Array.isArray(content.data) ? content.data.length : '非陣列');
        if (Array.isArray(content.data) && content.data.length > 0) {
          console.log('官方資料範例欄位:', Object.keys(content.data[0]));
        }
      } else {
        console.log('❌ 找不到 JSON 格式的資源');
      }
    } else {
      console.log('❌ 無法解析資源列表', res.data);
    }
  } catch (e) {
    console.error('❌ 查詢失敗:', e.message);
  }
}

findOfficialJson();
