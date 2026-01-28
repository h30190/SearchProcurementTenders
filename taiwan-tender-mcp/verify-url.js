import axios from 'axios';

async function verifyURL() {
  const url = `https://pcc-api.openfun.app/api/tender?unit_id=3.76.53&job_number=B054-1150121-1B`;
  try {
    const res = await axios.get(url);
    const records = res.data.records;
    console.log("--- RAW URL FIELD FROM API ---");
    records.forEach((r, i) => {
      console.log(`Record ${i} URL: ${r.detail.url}`);
    });
  } catch (e) {
    console.error(e.message);
  }
}

verifyURL();
