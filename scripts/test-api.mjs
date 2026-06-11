const BASE = process.env.API_BASE || "http://localhost:5173";

async function test(name, url, expectedStatus) {
  const res = await fetch(url);
  const ok = res.status === expectedStatus;
  const line = `${ok ? "PASS" : "FAIL"} ${name}: ${res.status} (expected ${expectedStatus})`;
  console.log(line);
  if (!ok) process.exitCode = 1;
  return res;
}

console.log(`Testing against ${BASE}\n`);

await test("GET /api/analytics without key", `${BASE}/api/analytics`, 401);
await test("GET /api/analytics with key 9589", `${BASE}/api/analytics?key=9589`, 200);

if (process.exitCode) {
  process.exit(process.exitCode);
}
