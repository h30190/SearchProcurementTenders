import axios from 'axios';

async function testOpenFun() {
  try {
    const keyword = encodeURIComponent('系統');
    const url = `https://pcc-api.openfun.app/api/searchbytitle?query=${keyword}`;
    console.log(`正在測試: ${url}`);
    const res = await axios.get(url, { timeout: 10000 });
    console.log('連線成功！');
    if (res.data.records) {
      console.log('資料筆數:', res.data.records.length);
      console.log('範例標案:', res.data.records[0].brief.title);
    }
  } catch (e) {
    console.error('連線失敗:', e.message);
  }
}

testOpenFun();
