import { query } from '../db/index.ts';
import fs from 'fs';
import path from 'path';

async function initDB() {
  try {
    const schemaPath = path.join(process.cwd(), 'backend', 'src', 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    console.log('Executing schema...');
    await query(schemaSql);
    console.log('Schema created successfully.');

    // Seed dummy user for auth if it doesn't exist
    const { rows } = await query(`SELECT * FROM tenants WHERE name = 'KavachX Bank'`);
    let tenantId;
    
    if (rows.length === 0) {
      console.log('Creating seed tenant...');
      const tenantRes = await query(`INSERT INTO tenants (name, domain) VALUES ('KavachX Bank', 'kavachx.bank') RETURNING id`);
      tenantId = tenantRes.rows[0].id;
    } else {
      tenantId = rows[0].id;
    }

    const { rows: userRows } = await query(`SELECT * FROM users WHERE email = 'admin@kavachx.bank'`);
    if (userRows.length === 0) {
      console.log('Creating seed admin user...');
      // Plain text password for demo, in production use bcrypt
      await query(`INSERT INTO users (tenant_id, email, password_hash, role) VALUES ($1, 'admin@kavachx.bank', 'password123', 'admin')`, [tenantId]);
    }
    
    console.log('Database initialization complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDB();
