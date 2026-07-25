import fs from 'fs';
import path from 'path';
import { query } from '../db/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initCoreDB() {
    try {
        const schemaPath = path.join(__dirname, '..', 'db', 'core_bank_schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await query(schema);
        console.log("Core Banking CDC schema and triggers applied successfully.");
    } catch (e: any) {
        console.error("Failed to apply schema:", e.message);
    }
    process.exit(0);
}

initCoreDB();
