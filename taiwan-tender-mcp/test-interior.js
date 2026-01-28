import { fetchAndFilterTenders } from './build/tender-service.js';

async function testInteriorTable() {
  const keyword = "室內裝修";
  const results = await fetchAndFilterTenders(keyword);

  if (typeof results === "string" || results.length === 0) {
    console.log("No data");
    return;
  }

  // Use simple labels to avoid encoding issues in shell log
  console.log("\n--- SIMULATED MCP TABLE RESPONSE ---");
  results.slice(0, 3).forEach(t => {
    console.log(`[${t.publishDate}] ${t.title} | Budget: ${t.budget} | Days: ${t.remainingDays}`);
  });
}

testInteriorTable();
