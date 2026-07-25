import { query } from './index.js';

async function migrate() {
    console.log("Adding metadata column to core_transactions...");
    try {
        await query("ALTER TABLE core_transactions ADD COLUMN IF NOT EXISTS metadata JSONB;");
        console.log("Migration complete.");
    } catch (e: any) {
        console.error("Migration failed:", e.message);
    }
    process.exit(0);
}
migrate();
