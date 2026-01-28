import axios from 'axios';

async function checkExactKeys() {
  const url = `https://pcc-api.openfun.app/api/tender?unit_id=3.76.53&job_number=B054-1150121-1B`;
  try {
    const res = await axios.get(url);
    const detail = res.data.records[0].detail;
    console.log("--- All Keys in Detail ---");
    console.log(Object.keys(detail).join('\n'));
    console.log("--- URL Value ---");
    console.log(detail["url"]);
  } catch (e) {
    console.error(e.message);
  }
}

checkExactKeys();
