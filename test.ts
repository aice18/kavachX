import { fetchExecutiveDashboard } from './src/lib/api.ts';

async function test() {
  try {
    const data = await fetchExecutiveDashboard();
    console.log("Success:", data);
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
