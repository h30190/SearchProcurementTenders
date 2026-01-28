import { fetchAndFilterTenders } from './build/tender-service.js';

async function testRaw() {
  const { results, hasMore } = await fetchAndFilterTenders("室內裝修");
  console.log(JSON.stringify({ count: results.length, hasMore, first: results[0] }, null, 2));
}

testRaw();
