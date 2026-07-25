import { Router } from 'express';
import { getExecutiveMetrics, getSocMetrics } from '../controllers/metrics.controller';

const router = Router();

router.get('/executive', getExecutiveMetrics);
router.get('/soc', getSocMetrics);

export default router;
