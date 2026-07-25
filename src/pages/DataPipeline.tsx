import React, { useState, useEffect } from 'react';
import { Network, Database, Shield, Zap, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function DataPipelineDemo() {
  const { t } = useTranslation();
  const [events, setEvents] = useState<any[]>([]);
  const [correlated, setCorrelated] = useState<any>(null);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      
      if (count === 1) {
        setEvents(prev => [...prev, { type: 'vpn', msg: 'VPN Login (Anomalous IP)', time: '00:00:12', risk: 'low' }]);
      } else if (count === 3) {
        setEvents(prev => [...prev, { type: 'db', msg: 'DB Enum (CORE_DB)', time: '00:03:45', risk: 'med' }]);
      } else if (count === 5) {
        setEvents(prev => [...prev, { type: 'rtgs', msg: 'High Value RTGS Request', time: '00:05:12', risk: 'high' }]);
      } else if (count === 7) {
        setCorrelated({
          title: 'Advanced Persistent Threat Detected',
          confidence: '98%',
          impact: 'Critical Financial Exposure',
          description: 'AI Engine correlated anomalous VPN access with internal database enumeration and subsequent high-value transaction request.'
        });
        clearInterval(interval);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'vpn': return <Network className="w-4 h-4 text-blue-500" />;
      case 'db': return <Database className="w-4 h-4 text-orange-500" />;
      case 'rtgs': return <Zap className="w-4 h-4 text-red-500" />;
      default: return <Shield className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{t('pipeline.title', 'AI Correlation Pipeline Demo')}</h1>
        <p className="text-slate-500 mt-1">{t('pipeline.subtitle', 'Watch how KavachX ingests raw telemetry and correlates it into a unified attack narrative.')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">{t('pipeline.raw_telemetry', 'Raw Telemetry Ingestion')}</h3>
          <div className="space-y-3 h-80 overflow-hidden relative">
            <AnimatePresence>
              {events.map((evt, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3"
                >
                  <div className={`p-2 rounded-md bg-slate-50 border border-slate-100`}>
                    {getIcon(evt.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{evt.msg}</p>
                    <p className="text-xs text-slate-500">{evt.time}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {!correlated && (
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-50 to-transparent"></div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-center justify-center">
          <div className="w-full flex items-center">
            <div className="h-px bg-slate-300 flex-1"></div>
            <div className="p-4 bg-slate-900 rounded-2xl shadow-xl border border-slate-700 mx-4 relative z-10 text-white flex flex-col items-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
               >
                 <Shield className="w-8 h-8 text-cyan-400 mb-2" />
               </motion.div>
               <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">{t('pipeline.ai_engine', 'AI Engine')}</span>
            </div>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col justify-center">
           <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">{t('pipeline.unified', 'Unified Attack Narrative')}</h3>
           {correlated ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm relative overflow-hidden"
             >
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -z-10"></div>
               <div className="flex items-center gap-2 text-red-600 mb-4">
                 <AlertTriangle className="w-6 h-6" />
                 <span className="font-bold text-sm uppercase tracking-wider">{t('pipeline.critical_alert', 'Critical Alert')}</span>
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-2">{t('pipeline.apt_detected', 'Advanced Persistent Threat Detected')}</h4>
               <p className="text-sm text-slate-700 mb-4">{t('pipeline.apt_desc', 'AI Engine correlated anomalous VPN access with internal database enumeration and subsequent high-value transaction request.')}</p>
               <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white p-3 rounded-lg border border-red-100">
                   <div className="text-xs font-bold text-slate-500 uppercase">{t('pipeline.ai_confidence', 'AI Confidence')}</div>
                   <div className="text-lg font-black text-slate-900">{correlated.confidence}</div>
                 </div>
                 <div className="bg-white p-3 rounded-lg border border-red-100">
                   <div className="text-xs font-bold text-slate-500 uppercase">{t('pipeline.est_impact', 'Est. Impact')}</div>
                   <div className="text-sm font-bold text-red-600 mt-1">{t('pipeline.critical_exposure', 'Critical Financial Exposure')}</div>
                 </div>
               </div>
             </motion.div>
           ) : (
             <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 p-6 text-center">
               {t('pipeline.waiting', 'Waiting for sufficient telemetry to correlate attack patterns...')}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
