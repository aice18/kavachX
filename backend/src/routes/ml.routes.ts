import { Router } from 'express';
import { analyzeAnomalies, analyzeSequences, scoreAlerts } from '../controllers/ml.controller';

const router = Router();

router.post('/anomaly', analyzeAnomalies);
router.post('/sequence', analyzeSequences);
router.post('/score', scoreAlerts);

export default router;
