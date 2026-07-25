import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Key, Eye, UserX, AlertTriangle, BrainCircuit, Activity, Lock, Play, Pause, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AnimatedScore = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    
    const duration = 800;
    const startTime = performance.now();
    
    const updateScore = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(start + (end - start) * ease));
      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        setDisplayValue(end);
      }
    };
    requestAnimationFrame(updateScore);
  }, [value]); // intentionally leaving displayValue out of deps

  return <>{displayValue}</>;
};

const getRiskScore = (stage: number) => {
  if (stage === 0) return 25;
  if (stage === 1) return 45;
  if (stage === 2) return 75;
  if (stage >= 3) return 98;
  return 0;
};

export default function UseCase() {
  const { t } = useTranslation();
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stages = [
    {
      id: 1,
      icon: Key,
      title: t('usecase.s1_title', 'Credential Compromise'),
      desc: t('usecase.s1_desc', 'Attacker steals finance manager credentials via phishing. Unusual VPN login, MFA fatigue, and high-risk IP detected.'),
      color: 'text-amber-500',
      bg: 'bg-amber-100',
      border: 'border-amber-200'
    },
    {
      id: 2,
      icon: Eye,
      title: t('usecase.s2_title', 'Reconnaissance'),
      desc: t('usecase.s2_desc', 'Attacker browses beneficiary lists and transaction history. KavachX detects unusual behavioural patterns for this user.'),
      color: 'text-orange-500',
      bg: 'bg-orange-100',
      border: 'border-orange-200'
    },
    {
      id: 3,
      icon: UserX,
      title: t('usecase.s3_title', 'Insider Behaviour'),
      desc: t('usecase.s3_desc', 'Access at 2:30 AM. Large DB export, unusual SQL queries, and privilege escalation attempts detected.'),
      color: 'text-red-500',
      bg: 'bg-red-100',
      border: 'border-red-200'
    },
    {
      id: 4,
      icon: AlertTriangle,
      title: t('usecase.s4_title', 'High-Value RTGS Attempt'),
      desc: t('usecase.s4_desc', 'New beneficiary added. 10 minutes later, a ₹4.8 crore RTGS transfer is initiated and split across mule accounts.'),
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      border: 'border-rose-200'
    },
    {
      id: 5,
      icon: BrainCircuit,
      title: t('usecase.s5_title', 'AI Correlation'),
      desc: t('usecase.s5_desc', 'KavachX correlates all events into ONE incident: Probable Corporate Account Takeover. Risk Score: 98/100.'),
      color: 'text-indigo-500',
      bg: 'bg-indigo-100',
      border: 'border-indigo-200'
    },
    {
      id: 6,
      icon: Activity,
      title: t('usecase.s6_title', 'Threat Forecasting'),
      desc: t('usecase.s6_desc', 'Predicts next steps: modify approvals, disable notifications, and access treasury systems.'),
      color: 'text-blue-500',
      bg: 'bg-blue-100',
      border: 'border-blue-200'
    },
    {
      id: 7,
      icon: Lock,
      title: t('usecase.s7_title', 'Automated Response'),
      desc: t('usecase.s7_desc', 'RTGS transaction paused, beneficiary frozen, compromised session disabled. SOC notified instantly.'),
      color: 'text-emerald-500',
      bg: 'bg-emerald-100',
      border: 'border-emerald-200'
    },
    {
      id: 8,
      icon: ShieldAlert,
      title: t('usecase.s8_title', 'Executive View'),
      desc: t('usecase.s8_desc', 'CISO sees one critical incident with ₹4.8 crore exposure and containment status, preventing funds from leaving.'),
      color: 'text-slate-700',
      bg: 'bg-slate-200',
      border: 'border-slate-300'
    }
  ];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % stages.length);
      }, 5000); // 5 seconds per stage
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t('usecase.heading', 'Anatomy of an Attack')}
          </h2>
          <p className="text-lg text-slate-600">
            {t('usecase.subheading', 'Watch how KavachX detects and stops a ₹4.8 crore Corporate Account Takeover in real-time.')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Timeline side */}
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 rounded-full"></div>
            
            <div className="space-y-6 relative z-10 py-4">
              {stages.map((stage, index) => {
                const isActive = activeStage === index;
                const isPast = index < activeStage;
                const Icon = stage.icon;
                
                return (
                  <div 
                    key={stage.id} 
                    className={`flex gap-6 cursor-pointer group transition-all duration-300 ${isActive ? 'opacity-100 scale-105' : 'opacity-50 hover:opacity-75'}`}
                    onClick={() => { setActiveStage(index); setIsPlaying(false); }}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 transition-colors duration-500 ${isActive ? `${stage.bg} ${stage.color} ${stage.border}` : isPast ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="pt-2">
                      <h3 className={`text-lg font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                        {stage.title}
                      </h3>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-slate-600 mt-2 leading-relaxed">
                              {stage.desc}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visualization side */}
          <div className="relative h-[600px] bg-slate-900 rounded-3xl p-6 overflow-hidden shadow-2xl border border-slate-800 flex flex-col">
            <div className="absolute inset-0 bg-grid-slate-800/[0.04] bg-[size:32px_32px]"></div>
            
            <div className="flex justify-between items-center mb-4 relative z-20">
              <div className="flex gap-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center px-4 hidden sm:block">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={activeStage}
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 10 }}
                     className="text-slate-300 text-sm font-medium"
                   >
                     {stages[activeStage].title}
                   </motion.div>
                 </AnimatePresence>
              </div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-sm transition-colors shrink-0"
              >
                {isPlaying ? <><Pause className="w-4 h-4" /> {t('usecase.pause', 'Pause')}</> : <><Play className="w-4 h-4" /> {t('usecase.resume', 'Resume')}</>}
              </button>
            </div>

            <div className="flex-1 flex items-center justify-between relative z-10 w-full mt-4">
              {/* SVG Lines connecting the nodes */}
              <div className="absolute inset-0 z-0">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="overflow-visible">
                   {/* Left to Center (Telemetry to AI Engine) */}
                   {[12, 38, 62, 88].map((y, i) => (
                     <g key={`line-left-${i}`}>
                       <path d={`M 15 ${y} C 35 ${y}, 40 50, 50 50`} stroke="#1e293b" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                       <motion.path 
                         d={`M 15 ${y} C 35 ${y}, 40 50, 50 50`} 
                         stroke={activeStage >= i ? "#6366f1" : "transparent"} 
                         strokeWidth="2" fill="none" 
                         vectorEffect="non-scaling-stroke"
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: activeStage >= i ? 1 : 0 }}
                         transition={{ duration: 0.8, ease: "easeOut" }}
                       />
                     </g>
                   ))}

                   {/* Center to Right (AI Engine to Actions) */}
                   {[16, 50, 84].map((y, i) => (
                     <g key={`line-right-${i}`}>
                       <path d={`M 50 50 C 60 50, 65 ${y}, 85 ${y}`} stroke="#1e293b" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                       <motion.path 
                         d={`M 50 50 C 60 50, 65 ${y}, 85 ${y}`} 
                         stroke={activeStage >= i + 5 ? "#6366f1" : "transparent"} 
                         strokeWidth="2" fill="none" 
                         vectorEffect="non-scaling-stroke"
                         initial={{ pathLength: 0 }}
                         animate={{ pathLength: activeStage >= i + 5 ? 1 : 0 }}
                         transition={{ duration: 0.8, ease: "easeOut" }}
                       />
                     </g>
                   ))}
                </svg>
              </div>

              {/* Left Column (Telemetry) 4 nodes */}
              <div className="flex flex-col justify-between h-full w-1/4 py-2 z-10 relative">
                {[0, 1, 2, 3].map(i => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center gap-2 relative"
                    animate={{ scale: activeStage === i ? 1.1 : 1 }}
                  >
                     <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${activeStage >= i ? stages[i].bg + ' ' + stages[i].color + ' ' + stages[i].border : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        {React.createElement(stages[i].icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                     </div>
                     <div className={`text-[10px] sm:text-xs font-semibold text-center leading-tight px-1 ${activeStage >= i ? 'text-white' : 'text-slate-500'}`}>
                        {stages[i].title}
                     </div>
                  </motion.div>
                ))}
              </div>

              {/* Center Column (AI Correlation Engine & Risk Score) */}
              <div className="flex flex-col items-center justify-center w-2/4 z-10 relative px-2 sm:px-4">
                 <motion.div 
                   animate={{ 
                     scale: activeStage === 4 ? 1.1 : activeStage > 4 ? 1 : 0.9, 
                     filter: activeStage >= 4 ? 'drop-shadow(0 0 30px rgba(99,102,241,0.6))' : 'none',
                     borderColor: activeStage >= 4 ? 'rgba(99,102,241,0.8)' : '#334155'
                   }}
                   className={`w-20 h-20 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center border-4 mb-8 transition-all duration-700 bg-slate-900 shadow-2xl relative z-20`}
                 >
                    {activeStage >= 4 && (
                      <motion.div 
                        className="absolute inset-0 rounded-3xl bg-indigo-500/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                    {React.createElement(stages[4].icon, { className: `w-10 h-10 sm:w-14 sm:h-14 relative z-10 ${activeStage >= 4 ? 'text-indigo-400' : 'text-slate-600'}` })}
                 </motion.div>
                 
                 <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-2xl p-3 sm:p-5 text-center w-full max-w-[180px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 transition-opacity" style={{ opacity: activeStage >= 3 ? 1 : 0 }}></div>
                    <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mb-1 relative z-10 font-medium">Risk Score</div>
                    <div className="text-3xl sm:text-5xl font-black text-red-500 relative z-10 tracking-tighter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)] flex justify-center items-baseline gap-1">
                       <AnimatedScore value={getRiskScore(activeStage)} />
                       <span className="text-lg sm:text-2xl text-slate-500 font-bold">/100</span>
                    </div>
                 </div>
              </div>

              {/* Right Column (Actions) 3 nodes */}
              <div className="flex flex-col justify-around h-full w-1/4 py-12 z-10 relative">
                {[5, 6, 7].map(i => (
                  <motion.div 
                    key={i} 
                    className="flex flex-col items-center gap-2 relative"
                    animate={{ scale: activeStage === i ? 1.1 : 1 }}
                  >
                     <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-lg ${activeStage >= i ? stages[i].bg + ' ' + stages[i].color + ' ' + stages[i].border : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                        {React.createElement(stages[i].icon, { className: "w-6 h-6 sm:w-7 sm:h-7" })}
                     </div>
                     <div className={`text-[10px] sm:text-xs font-semibold text-center leading-tight px-1 ${activeStage >= i ? 'text-white' : 'text-slate-500'}`}>
                        {stages[i].title}
                     </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <p className="text-xl md:text-2xl text-indigo-100 font-light leading-relaxed max-w-4xl mx-auto relative z-10 italic">
            "{t('usecase.quote_part1', 'A traditional SIEM would generate multiple isolated alerts across different teams.')} <strong className="font-semibold text-white">{t('usecase.quote_part2', 'KavachX transforms those fragmented signals into a single, explainable attack narrative')}</strong>{t('usecase.quote_part3', ', quantifies the business impact, predicts the attacker\'s next move, and enables the bank to stop a ₹4.8 crore fraud before the funds leave the system.')}"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
