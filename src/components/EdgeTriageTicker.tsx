import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Simulating the 100TB edge stream visually
export default function EdgeTriageTicker() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Generate a new simulated "stream" event every 500ms
    const interval = setInterval(() => {
      const isAnomaly = Math.random() < 0.05; // 5% chance of visual anomaly in ticker
      const newEvent = {
        id: Math.random().toString(36).substring(7),
        time: new Date().toISOString().split('T')[1].substring(0, 8),
        status: isAnomaly ? 'ELEVATED' : 'PASSED',
        message: isAnomaly ? 'Tier 1 Failed: Velocity Threshold. Elevating to AI.' : 'Tier 1 Triage Passed: Normal Velocity',
      };
      
      setEvents((prev) => {
        const next = [newEvent, ...prev];
        if (next.length > 5) next.pop(); // Keep only last 5 visible
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 bg-slate-950 border-t border-slate-800 flex items-center z-40 overflow-hidden">
       <div className="flex items-center gap-2 px-4 border-r border-slate-800 bg-slate-900 h-full min-w-max">
         <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
         <span className="text-xs font-bold text-slate-300 tracking-wider">100TB EDGE TRIAGE</span>
       </div>
       
       <div className="flex-1 flex items-center gap-6 px-4 overflow-hidden relative">
          <AnimatePresence>
            {events.map((ev) => (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 min-w-max"
              >
                <span className="text-[10px] text-slate-500 font-mono">{ev.time}</span>
                {ev.status === 'PASSED' ? (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    {ev.message}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                    <AlertTriangle className="w-3 h-3" />
                    {ev.message}
                  </span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
       </div>
    </div>
  );
}
