import axios from 'axios';

async function checkApi() {
  try {
    const res = await axios.get('https://data.gov.tw/api/v2/rest/dataset/30265');
    console.log('API keys:', Object.keys(res.data));
    if (res.data.result) {
      console.log('Result keys:', Object.keys(res.data.result));
    } else {
      console.log('No "result" field found');
    }
    // 打印前幾個 resource 看看
    const resources = res.data.result?.resources || res.data.resources;
    if (resources) {
      console.log('Found resources, count:', resources.length);
      console.log('First resource sample:', JSON.stringify(resources[0], null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}

checkApi();
