import { Router } from 'express';
import { chatWithCopilot } from '../controllers/copilot.controller';

const router = Router();

router.post('/chat', chatWithCopilot);

export default router;
