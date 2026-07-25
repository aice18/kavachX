import fs from 'fs';
import path from 'path';
import { query } from '../db/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDB() {
    try {
        const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await query(schema);
        console.log("Database schema applied successfully.");
    } catch (e: any) {
        console.error("Failed to apply schema:", e.message);
    }
    process.exit(0);
}

initDB();
