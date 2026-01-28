import axios from 'axios';

async function testRealOfficial() {
  try {
    const url = 'https://data.pcc.gov.tw/analyzer/api/v1/tender?format=json';
    console.log(`正在測試官方 API: ${url}`);
    const res = await axios.get(url, { timeout: 15000 });
    console.log('✅ 連線成功！');
    if (res.data && res.data.tenders) {
      console.log('資料筆數:', res.data.tenders.length);
      console.log('欄位範例:', Object.keys(res.data.tenders[0]));
    } else {
      console.log('連線成功但格式不同:', Object.keys(res.data));
    }
  } catch (e) {
    console.error('❌ 連線失敗:', e.message);
  }
}

testRealOfficial();
