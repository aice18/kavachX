import { Router, Request, Response } from 'express';
import { verifyBankSignature } from '../services/security.service.js';
import { ingestBankEvent, BankPayload } from '../services/bankIntegration.service.js';

const router = Router();

// Middleware to capture the raw body for HMAC signature verification
// This assumes express.json() is configured with verify in index.ts, or we just stringify the body.
// For simplicity in this demo, we'll stringify the body for validation.
const validateBankWebhook = (req: Request, res: Response, next: Function) => {
    const signature = req.headers['x-bank-signature'];
    
    if (!signature || typeof signature !== 'string') {
        return res.status(401).json({ error: 'Unauthorized: Missing Bank Signature' });
    }

    const payloadString = JSON.stringify(req.body);
    
    if (!verifyBankSignature(payloadString, signature)) {
        return res.status(403).json({ error: 'Forbidden: Invalid Signature' });
    }

    next();
};

/**
 * @route POST /api/ingestion/webhook
 * @desc Secure endpoint for core banking systems to push live event data
 */
router.post('/webhook', validateBankWebhook, async (req: Request, res: Response) => {
    try {
        const payload = req.body as BankPayload;
        
        // Basic schema validation could be added here (e.g., Zod)
        if (!payload.eventId || !payload.eventType || !payload.userId) {
            return res.status(400).json({ error: 'Bad Request: Missing required fields' });
        }

        // Process asynchronously to immediately ack the webhook (standard bank architecture)
        ingestBankEvent(payload).catch(console.error);

        res.status(202).json({ status: 'Accepted', message: 'Event successfully queued for ingestion.' });
    } catch (error: any) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
