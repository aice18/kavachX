import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DEMO_TOKEN } from './auth';

let socket: Socket;

export function getSocket() {
  if (!socket) {
    socket = io({ auth: { token: DEMO_TOKEN } });
  }
  return socket;
}

export function useKavachWebSocket() {
  const [health, setHealth] = useState<number | null>(null);
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);
  const [chiTrend, setChiTrend] = useState<any[]>([]);
  const [demoLogs, setDemoLogs] = useState<string[]>([]);
  const [trustScores, setTrustScores] = useState<any[]>([]);

  useEffect(() => {
    const s = getSocket();

    s.on('health_update', setHealth);
    s.on('chi_trend_update', setChiTrend);
    s.on('incidents_update', setActiveIncidents);
    s.on('trust_score_update', setTrustScores);
    s.on('demo_log', (val: string) => setDemoLogs(prev => [...prev, val]));

    s.on('incident_update', (updatedIncident: any) => {
      setActiveIncidents(prev => {
        if (updatedIncident.status !== 'active') {
          return prev.filter(i => i.incident_id !== updatedIncident.incident_id);
        }
        const existing = prev.find(i => i.incident_id === updatedIncident.incident_id);
        if (existing) {
          return prev.map(i => i.incident_id === updatedIncident.incident_id ? updatedIncident : i);
        }
        return [updatedIncident, ...prev];
      });
    });

    return () => {
      s.off('health_update');
      s.off('chi_trend_update');
      s.off('incidents_update');
      s.off('incident_update');
      s.off('demo_log');
      s.off('trust_score_update');
    };
  }, []);

  return { health, activeIncidents, chiTrend, demoLogs, trustScores };
}
