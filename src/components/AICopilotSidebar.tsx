import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, BrainCircuit, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AICopilotSidebar() {
  const { t } = useTranslation();
  const [latestThreat, setLatestThreat] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  // Simulate streaming text effect for the AI explanation
  useEffect(() => {
    if (latestThreat && isOpen) {
      setDisplayedText('');
      const fullText = latestThreat.explainability || "Threat detected by AI Correlation Engine.";
      let i = 0;
      const interval = setInterval(() => {
        if (i < fullText.length) {
          setDisplayedText((prev) => prev + fullText.charAt(i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [latestThreat, isOpen]);

  // Poll for latest threats
  useEffect(() => {
    const fetchLatestThreat = async () => {
      try {
        const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/fraud/correlation-graph`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.nodes) {
            // Find a node that has explainability (a Transaction node)
            const threatNode = data.nodes.find((n: any) => n.group === 'Transaction' && n.label !== 'Normal' && n.explainability && n.explainability !== 'None');
            if (threatNode) {
              setLatestThreat(threatNode);
              if (!isOpen) setIsOpen(true); // Auto-open on new threat
            }
          }
        }
      } catch (err) {}
    };

    const interval = setInterval(fetchLatestThreat, 6000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !latestThreat) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed bottom-6 right-6 w-80 sm:w-96 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/20 rounded-2xl p-5 z-50 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
        
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white tracking-wide">Explainable AI Copilot</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
             <span className="text-xs text-slate-400 uppercase tracking-wider">AI Verdict</span>
             <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-[10px] font-bold flex items-center gap-1">
               <ShieldAlert className="w-3 h-3" />
               {latestThreat.threat_type || 'Anomaly'}
             </span>
          </div>
          
          <div className="text-sm text-slate-200 leading-relaxed font-mono min-h-[80px]">
            {displayedText}
            <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle"></span>
          </div>
        </div>

        {latestThreat.is_quantum_threat && (
           <div className="mt-3 text-[11px] text-orange-400 flex items-center gap-2 bg-orange-500/10 px-3 py-2 rounded-lg border border-orange-500/20">
             ⚠️ Quantum Harvest-Now-Decrypt-Later Indicator Detected
           </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
