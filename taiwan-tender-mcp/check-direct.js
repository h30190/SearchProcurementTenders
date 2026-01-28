import axios from 'axios';

async function checkDirectLink() {
  try {
    const url = 'https://data.pcc.gov.tw/pcc/api/v1/data?format=json';
    console.log(`正在嘗試下載: ${url}`);
    const res = await axios.get(url, { timeout: 10000 });
    console.log('連線成功！');
    console.log('資料筆數:', res.data.length);
    if (res.data.length > 0) {
      console.log('第一筆範例:', JSON.stringify(res.data[0], null, 2));
    }
  } catch (e) {
    console.error('連線失敗:', e.message);
  }
}

checkDirectLink();
