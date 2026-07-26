import { query } from '../db/index.js';
import { driver } from './neo4j.service.js';
import crypto from 'crypto';

// Helpers to generate dummy data
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomAmount = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(2);
const generateIP = () => `${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

// Shared entities for correlation
let mockUsers: { id: string, name: string }[] = [];

async function initializeEntities() {
    console.log("Initializing base entities for simulator...");
    for (let i = 1; i <= 5; i++) {
        const userId = crypto.randomUUID();
        const accountId = crypto.randomUUID();
        
        try {
            const tenantRes = await query("INSERT INTO tenants (name, domain) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING id", [`Simulated Bank ${i}`, `bank${i}.com`]);
            let tenantId = tenantRes.rows[0]?.id;
            if (!tenantId) {
                const tRes = await query("SELECT id FROM tenants LIMIT 1");
                tenantId = tRes.rows[0]?.id;
            }

            if (tenantId) {
                const userRes = await query(
                    "INSERT INTO users (id, tenant_id, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING RETURNING id",
                    [userId, tenantId, `user${i}@simulated.com`, 'hash', 'viewer']
                );
                
                const finalUserId = userRes.rows.length > 0 ? userRes.rows[0].id : userId;

                await query(
                    "INSERT INTO bank_accounts (id, user_id, account_number, balance) VALUES ($1, $2, $3, $4) ON CONFLICT (account_number) DO NOTHING",
                    [accountId, finalUserId, `ACCT-000${i}`, 10000.00]
                );

                mockUsers.push({ id: finalUserId, name: `User ${i}` });

                if (driver) {
                    const session = driver.session();
                    try {
                        await session.run(`
                            MERGE (u:User {id: $userId})
                            SET u.name = $name, u.email = $email
                            MERGE (a:BankAccount {id: $accountId})
                            SET a.account_number = $accountNumber, a.balance = $balance
                            MERGE (u)-[:OWNS_ACCOUNT]->(a)
                        `, {
                            userId: finalUserId, name: `User ${i}`, email: `user${i}@simulated.com`,
                            accountId, accountNumber: `ACCT-000${i}`, balance: 10000.00
                        });
                    } finally {
                        await session.close();
                    }
                }
            }
        } catch (e: any) {
            console.error("Setup warning (can be ignored if already exists):", e.message);
            mockUsers.push({ id: userId, name: `User ${i}` });
        }
    }
}

export async function simulateEvent(forceFraud = false) {
    if (mockUsers.length === 0) return;

    const user = randomElement(mockUsers);
    const isFraud = forceFraud || Math.random() < 0.1; // 10% chance of fraud anomaly
    const deviceId = crypto.randomUUID();
    const deviceName = isFraud ? "Unknown Linux Machine" : "Trusted iPhone";
    const ip = isFraud ? "45.22.19.1" : generateIP();
    const txId = crypto.randomUUID();
    const amount = isFraud ? randomAmount(5000, 50000) : randomAmount(10, 500);

    // [RICH DATA UPGRADE] Generating complex multi-dimensional banking telemetry
    const mccs = ["5411", "5812", "5944", "4814", "6011"]; // Groceries, Restaurants, Jewelry, Telecom, ATM
    const channels = ["MOBILE_APP", "WEB_PORTAL", "API_B2B", "BRANCH"];
    
    const metadata = {
        core_banking: {
            swift_code: isFraud ? "XYZZDEF1" : "HDFCUS33",
            merchant_category_code: isFraud ? "5944" : randomElement(mccs),
            transaction_channel: isFraud ? "API_B2B" : randomElement(channels),
            currency_pair: isFraud ? "USD/Crypto" : "USD/USD"
        },
        iam_logs: {
            device_fingerprint: crypto.createHash('sha256').update(deviceName + ip).digest('hex').substring(0, 16),
            session_duration_seconds: isFraud ? Math.floor(Math.random() * 10) : Math.floor(Math.random() * 3600),
            failed_logins_last_24h: isFraud ? Math.floor(Math.random() * 15) : 0,
            mfa_method: isFraud ? "SMS_OTP_BYPASSED" : "BIOMETRIC_FACE_ID"
        },
        waf_logs: {
            tor_exit_node_flag: isFraud,
            vpn_provider: isFraud ? "NordVPN" : "None",
            api_endpoint_accessed: isFraud ? "/api/v1/export_keys" : "/api/v1/transfer",
            geolocation: isFraud ? "Saint Petersburg, RU" : "New York, USA"
        }
    };

    console.log(`[Simulator] Generating event for ${user.name} - Fraud: ${isFraud} - Amount: $${amount} - MCC: ${metadata.core_banking.merchant_category_code}`);

    try {
        const accRes = await query("SELECT id FROM bank_accounts WHERE user_id = $1 LIMIT 1", [user.id]);
        if (accRes.rows.length === 0) return;
        const senderAccountId = accRes.rows[0].id;

        const recRes = await query("SELECT id FROM bank_accounts WHERE user_id != $1 ORDER BY RANDOM() LIMIT 1", [user.id]);
        const receiverAccountId = recRes.rows.length > 0 ? recRes.rows[0].id : null;

        await query(
            "INSERT INTO devices (id, user_id, device_name, ip_address, is_trusted) VALUES ($1, $2, $3, $4, $5)",
            [deviceId, user.id, deviceName, ip, !isFraud]
        );

        if (receiverAccountId) {
            // Push rich JSON blob into Postgres
            await query(
                "INSERT INTO core_transactions (account_from, account_to, amount, status, metadata) VALUES ($1, $2, $3, 'COMPLETED', $4)",
                [senderAccountId, receiverAccountId, amount, JSON.stringify(metadata)]
            );
        }

    } catch (e: any) {
        console.error("[Simulator] Error during event generation:", e.message);
    }
}

let intervalId: NodeJS.Timeout | null = null;

export const startSimulator = async () => {
    if (intervalId) return;
    console.log("Starting Banking Data Simulator...");
    await initializeEntities();
    intervalId = setInterval(simulateEvent, 10000);
};

export const stopSimulator = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("Stopped Banking Data Simulator.");
    }
};
