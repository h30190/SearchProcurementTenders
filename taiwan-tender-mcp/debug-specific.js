import axios from 'axios';

async function debugSpecific() {
  const url = `https://pcc-api.openfun.app/api/tender?unit_id=3.76.53&job_number=B054-1150121-1B`;
  try {
    const res = await axios.get(url);
    const firstRec = res.data.records[0];
    console.log("Root Keys:", Object.keys(firstRec));
    console.log("Detail Keys Sample:", Object.keys(firstRec.detail).slice(0, 20));
    
    // 尋找包含您指定名稱的 Key
    const allKeys = Object.keys(firstRec.detail);
    console.log("Matched Keys for '公告日':", allKeys.filter(k => k.includes('公告日')));
    console.log("Matched Keys for '截止投標':", allKeys.filter(k => k.includes('截止投標')));
    console.log("Matched Keys for '預算金額':", allKeys.filter(k => k.includes('預算金額')));
  } catch (e) {
    console.error(e.message);
  }
}

debugSpecific();
