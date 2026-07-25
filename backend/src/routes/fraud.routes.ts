import { Router } from 'express';
import { getFraudCorrelationGraph } from '../services/neo4j.service';

const router = Router();

router.get('/rtgs-graph', async (req, res) => {
  try {
    const graphData = await getFraudCorrelationGraph();
    res.json(graphData);
  } catch (error) {
    console.error('Error fetching fraud graph:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
