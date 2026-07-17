import { useEffect, useState } from 'react';
import { db } from '../../server/db/memory.js';
import { syntheticDataGenerator } from '../../server/data/synthetic.js';

let initialized = false;
let initPromise: Promise<void> | null = null;
async function initDb() {
  if (!initialized) {
    if (!initPromise) {
      initPromise = syntheticDataGenerator().then(() => { initialized = true; });
    }
    await initPromise;
  }
}

export function useKavachWebSocket() {
  const [health, setHealth] = useState<number | null>(null);
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);
  const [chiTrend, setChiTrend] = useState<any[]>([]);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [trustScores, setTrustScores] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function load() {
      await initDb();
      // Initialize with db values
      setHealth(db.cyberHealthIndex);
      setActiveIncidents(db.getLiveIncidents());
      setChiTrend(db.chiTrend);
      setTrustScores(db.trustScores);

      // Simple polling loop to simulate websocket events
      interval = setInterval(() => {
        setHealth(db.cyberHealthIndex);
        setActiveIncidents(db.getLiveIncidents());
        setChiTrend(db.chiTrend);
        setTrustScores(db.trustScores);
      }, 2000);
    }
    load();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return { health, activeIncidents, chiTrend, demoLogs, trustScores };
}
