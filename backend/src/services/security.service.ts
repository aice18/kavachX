import crypto from 'crypto';

// These should be in .env in a real environment
const BANK_WEBHOOK_SECRET = process.env.BANK_WEBHOOK_SECRET || 'bank-super-secret-key-for-hmac-sha256';
const BANK_ENCRYPTION_KEY = process.env.BANK_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef'; // 32 bytes for AES-256
const BANK_ENCRYPTION_IV = process.env.BANK_ENCRYPTION_IV || '0123456789abcdef'; // 16 bytes for AES

/**
 * Validates the HMAC-SHA256 signature provided by the bank's core system.
 * This guarantees the payload was actually sent by the bank and not tampered with.
 */
export const verifyBankSignature = (payload: string, signature: string): boolean => {
    try {
        const expectedSignature = crypto
            .createHmac('sha256', BANK_WEBHOOK_SECRET)
            .update(payload)
            .digest('hex');
            
        // Use timingSafeEqual to prevent timing attacks
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature, 'utf8'),
            Buffer.from(signature, 'utf8')
        );
    } catch (e) {
        return false;
    }
};

/**
 * Decrypts PII fields (like account numbers or names) using AES-256-CBC.
 * Banks will not send plaintext PII to an external dashboard system.
 */
export const decryptPII = (encryptedHex: string): string => {
    try {
        const decipher = crypto.createDecipheriv(
            'aes-256-cbc',
            Buffer.from(BANK_ENCRYPTION_KEY, 'utf8'),
            Buffer.from(BANK_ENCRYPTION_IV, 'utf8')
        );
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error("Decryption failed for PII field.");
        return "***REDACTED***";
    }
};
