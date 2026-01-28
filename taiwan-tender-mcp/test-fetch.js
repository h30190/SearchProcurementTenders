import { fetchAndFilterTenders } from './build/tender-service.js';

async function test() {
  console.log('--- 開始測試標案抓取 ---');
  console.log('正在搜尋關鍵字: "系統"...');
  
  const results = await fetchAndFilterTenders('系統');

  if (typeof results === 'string') {
    console.log('❌ 抓取失敗:', results);
  } else if (results.length === 0) {
    console.log('⚠️ 成功連線，但目前沒有符合關鍵字的活標案。');
  } else {
    console.log(`✅ 成功抓取！找到 ${results.length} 筆相關標案。`);
    console.log('第一筆範例：');
    console.log(JSON.stringify(results[0], null, 2));
  }
}

test();
