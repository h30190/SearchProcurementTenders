import axios from 'axios';

async function debugDetail() {
  // 使用剛才測試中出現的標案：臺中市政府警察局第一分局 (unit_id: 3.76.60.82, job_number: 11501)
  const url = `https://pcc-api.openfun.app/api/tender?unit_id=3.76.60.82&job_number=11501`;
  try {
    const res = await axios.get(url);
    const detail = res.data.records[0].detail;
    console.log("Available Keys in Detail Object:");
    console.log(Object.keys(detail).filter(k => k.includes('日期') || k.includes('時間') || k.includes('金額') || k.includes('方式')));
    console.log("\nSample Data for '11501':");
    console.log(JSON.stringify(detail, null, 2).substring(0, 1000));
  } catch (e) {
    console.error(e.message);
  }
}

debugDetail();

