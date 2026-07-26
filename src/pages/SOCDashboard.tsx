import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert, Search, Server, Database, Network, ArrowRight, BarChart3, Activity, PieChart as PieChartIcon, Filter, Clock, CheckCircle2, Lock, Pause, ShieldBan, X, Play, Brain, RefreshCw, RotateCcw, ShieldCheck, FileDigit } from 'lucide-react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { useAuth } from '../AuthContext';
import ThreatMap from '../components/ThreatMap';
import LiveThreatGraph from '../components/LiveThreatGraph';
import AICopilotSidebar from '../components/AICopilotSidebar';
import EdgeTriageTicker from '../components/EdgeTriageTicker';

export default function SOCDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [mitigating, setMitigating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [executeResult, setExecuteResult] = useState<{success: boolean, message: string} | null>(null);
  const [showReport, setShowReport] = useState(false);
  
  const { user } = useAuth();
  const isL1 = user?.role === 'l1_analyst';

  const handleExecutePlaybook = async (actionName: string) => {
    setMitigating(true);
    try {
      const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/copilot/execute-playbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId: selectedIncident?.id, action: actionName })
      });
      const data = await res.json();
      setExecuteResult(data);
    } catch (err) {
      setExecuteResult({ success: false, message: "Execution failed due to network error." });
    } finally {
      setMitigating(false);
    }
  };

  const runAiAnalysis = async (incident: any) => {
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/ml/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertData: incident })
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const [xgbAccuracy, setXgbAccuracy] = useState(94.2);
  const [rfAccuracy, setRfAccuracy] = useState(91.8);
  const [xgbStatus, setXgbStatus] = useState<'Deployed' | 'Retraining' | 'Rolling back'>('Deployed');
  const [rfStatus, setRfStatus] = useState<'Deployed' | 'Retraining' | 'Rolling back'>('Deployed');

  const xgbStatusRef = useRef(xgbStatus);
  const rfStatusRef = useRef(rfStatus);

  useEffect(() => {
    xgbStatusRef.current = xgbStatus;
    rfStatusRef.current = rfStatus;
  }, [xgbStatus, rfStatus]);

  const handleModelAction = (model: 'xgb' | 'rf', action: 'retrain' | 'deploy' | 'rollback') => {
    const setStatus = model === 'xgb' ? setXgbStatus : setRfStatus;
    const setAcc = model === 'xgb' ? setXgbAccuracy : setRfAccuracy;
    
    if (action === 'retrain') {
      setStatus('Retraining');
      setTimeout(() => {
        setStatus('Deployed');
        setAcc(prev => Math.min(99.9, prev + Math.random() * 2));
      }, 3000);
    } else if (action === 'rollback') {
      setStatus('Rolling back');
      setTimeout(() => {
        setStatus('Deployed');
        setAcc(prev => Math.max(90, prev - Math.random() * 1.5));
      }, 2000);
    } else {
      setStatus('Deployed');
    }
  };

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/metrics/soc')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("Error fetching SOC data:", err));
    };
    
    // Initial fetch
    fetchData();
    
    // Connect to WebSocket
    const socket = io(import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : 'http://localhost:3002');
    
    socket.on('telemetry_update', (telemetry) => {
      setData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          riskScore: telemetry.riskScore,
          activeIncidents: telemetry.activeIncidents
        };
      });
      
      setXgbAccuracy(prev => (xgbStatusRef.current === 'Deployed' ? telemetry.xgbAccuracy : prev));
      setRfAccuracy(prev => (rfStatusRef.current === 'Deployed' ? telemetry.rfAccuracy : prev));
    });

    socket.on('critical_incident', (incident) => {
      setData((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          incidentFeed: [incident, ...(prev.incidentFeed || [])]
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!data) return (
    <div className="h-full flex items-center justify-center text-slate-500 text-sm gap-2">
      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      {t('soc.loading', 'Loading SOC data...')}
    </div>
  );

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const filteredLogs = data.responseLog?.filter((log: any) => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.trigger.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.impact.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6 p-2 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('soc.title', 'SOC Console')}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {t('soc.subtitle', 'Active incidents and infrastructure telemetry.')}
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={() => {
              fetch('/api/demo/trigger-attack', { method: 'POST' })
                .then(res => res.json())
                .then(resData => console.log('Demo triggered:', resData));
            }}
            className="w-full sm:w-auto bg-red-600 px-4 py-2 rounded-lg text-sm font-medium text-white border border-red-700 shadow-sm flex items-center justify-center gap-2 hover:bg-red-700 transition-colors animate-pulse"
          >
             <ShieldAlert className="w-4 h-4" /> Simulate RTGS Cyber Attack
          </button>
          <button className="w-full sm:w-auto bg-white px-4 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200 shadow-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
             <Search className="w-4 h-4" /> {t('soc.search', 'Search Logs')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Architecture Topology */}
          <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-slate-900">{t('soc.topology', 'Infrastructure Topology & Live Threats')}</h3>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                {t('soc.live_view', 'Live View')}
              </span>
            </div>
            <div className="flex items-center justify-center min-h-[350px] bg-gradient-to-b from-slate-50/50 to-white relative overflow-hidden">
              {/* Background Decorative Grid */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
              
              <div className="w-full h-full absolute inset-0 z-10 p-2 rounded-2xl overflow-hidden">
                <LiveThreatGraph />
              </div>
            </div>
          </motion.div>

          {/* Threat Volume Chart */}
          {data.threatVolume && (
            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-[350px] flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-blue-500" />
                    {t('soc.threat_volume', 'Threat Volume (Last 24h)')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{t('soc.event_rate', 'Event ingestion rate by severity')}</p>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.threatVolume} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="url(#colorCritical)" strokeWidth={2} />
                    <Area type="monotone" dataKey="high" stackId="1" stroke="#f59e0b" fill="url(#colorHigh)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* Incidents Table */}
          <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-semibold text-slate-900">{t('soc.active_incidents', 'Active Incidents')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('soc.time', 'Time')}</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('soc.alert_type', 'Alert Type')}</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('soc.target_entity', 'Target Entity')}</th>
                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wider">{t('soc.status', 'Status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.incidentFeed.map((inc: any, i: number) => {
                    const isSelected = selectedIncident?.id === inc.id;
                    return (
                    <motion.tr 
                      key={inc.id} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      onClick={() => {
                        setSelectedIncident(isSelected ? null : inc);
                        setAiAnalysis(null);
                      }}
                      className={`transition-colors group cursor-pointer ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-slate-50'}`}
                    >
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap tabular-nums">{inc.time}</td>
                      <td className="px-5 py-4 font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{inc.type}</td>
                      <td className="px-5 py-4">
                        <span className="text-slate-600 font-mono text-xs bg-slate-100 px-2 py-1 rounded-md">{inc.user}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          inc.status === 'Active' ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' :
                          inc.status === 'Blocked' ? 'bg-green-50 text-green-700 border border-green-200 shadow-sm' : 
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {inc.status}
                        </span>
                      </td>
                    </motion.tr>
                  )})}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Risk Score */}
          <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full opacity-50"></div>
             <div className="relative z-10">
               <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{t('soc.risk_score', 'System Risk Score')}</h3>
                    <p className="text-xs text-slate-500 mt-1">{t('soc.calculated', 'Calculated via deterministic model')}</p>
                  </div>
               </div>
               <div className="text-6xl font-bold text-red-600 tracking-tight">{data.riskScore}</div>
               <div className="mt-6 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-slate-900">{t('soc.critical_status', 'Critical Status')}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t('soc.active_vectors_p1', '')}<strong className="text-slate-900">{data.activeIncidents}</strong> {t('soc.active_vectors_p2', 'active threat vectors detected in the last 24 hours requiring immediate review.')}
                  </p>
               </div>
              </div>
           </motion.div>

          {/* Data Pipeline Health (Tier-1 Scale Metrics) */}
          <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                   <Network className="w-4 h-4 text-emerald-500" />
                   Data Pipeline Health
                 </h3>
                 <p className="text-xs text-slate-500 mt-1">Real-time infrastructure metrics (Simulated)</p>
               </div>
             </div>
             
             <div className="space-y-3">
               <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="text-xs font-medium text-slate-600">Kafka Ingestion Rate</span>
                 <span className="text-sm font-bold text-slate-900 font-mono">83,412 msg/s</span>
               </div>
               <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="text-xs font-medium text-slate-600">Flink Window Latency</span>
                 <span className="text-sm font-bold text-emerald-600 font-mono">12 ms</span>
               </div>
               <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="text-xs font-medium text-slate-600">Redis Feature Store Hit</span>
                 <span className="text-sm font-bold text-slate-900 font-mono">99.8%</span>
               </div>
               <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                 <span className="text-xs font-medium text-slate-600">Neo4j Async Queue</span>
                 <span className="text-sm font-bold text-amber-600 font-mono animate-pulse">1,240 pending</span>
               </div>
             </div>
          </motion.div>

          {/* Incident Types */}
          {data.incidentTypes && (
            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                {t('soc.incident_dist', 'Incident Distribution')}
              </h3>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.incidentTypes} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={11} stroke="#64748b" width={110} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {data.incidentTypes.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#3b82f6', '#6366f1'][index % 4]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* ML Accuracy Metrics (TP / TN) */}
          <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full opacity-50"></div>
             <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2 relative z-10">
               <Brain className="w-4 h-4 text-indigo-500" />
               Multi-Agent ML Accuracy
             </h3>
             <p className="text-xs text-slate-500 mb-4 relative z-10">Performance metrics over last 1M simulated transactions</p>
             
             <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">True Positives</div>
                  <div className="text-2xl font-black text-emerald-700">99.8%</div>
                  <div className="text-[10px] text-emerald-600 mt-1">Correctly caught fraud</div>
                </div>
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">True Negatives</div>
                  <div className="text-2xl font-black text-blue-700">99.9%</div>
                  <div className="text-[10px] text-blue-600 mt-1">Correctly allowed benign</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">False Positives</div>
                  <div className="text-2xl font-black text-slate-700">0.05%</div>
                  <div className="text-[10px] text-slate-500 mt-1">Reduced alert fatigue</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">False Negatives</div>
                  <div className="text-2xl font-black text-slate-700">0.01%</div>
                  <div className="text-[10px] text-slate-500 mt-1">Missed threats</div>
                </div>
             </div>
          </motion.div>

          {/* Active ML Models */}
          <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-purple-500" />
              Active ML Models
            </h3>
            <div className="space-y-4">
              {/* XGBoost Model */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900">XGBoost Classifier</div>
                    <div className="text-xs text-slate-500">RTGS Fraud Detection</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-purple-700">{xgbAccuracy.toFixed(2)}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{xgbStatus}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => handleModelAction('xgb', 'retrain')}
                    disabled={xgbStatus !== 'Deployed'}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${xgbStatus === 'Retraining' ? 'animate-spin' : ''}`} />
                    Retrain
                  </button>
                  <button 
                    onClick={() => handleModelAction('xgb', 'deploy')}
                    disabled={xgbStatus === 'Deployed'}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Deploy
                  </button>
                  <button 
                    onClick={() => handleModelAction('xgb', 'rollback')}
                    disabled={xgbStatus !== 'Deployed'}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Rollback
                  </button>
                </div>
              </div>

              {/* Random Forest Model */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Random Forest</div>
                    <div className="text-xs text-slate-500">Loan Default Predictor</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-700">{rfAccuracy.toFixed(2)}%</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{rfStatus}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => handleModelAction('rf', 'retrain')}
                    disabled={rfStatus !== 'Deployed'}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${rfStatus === 'Retraining' ? 'animate-spin' : ''}`} />
                    Retrain
                  </button>
                  <button 
                    onClick={() => handleModelAction('rf', 'deploy')}
                    disabled={rfStatus === 'Deployed'}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-50 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Deploy
                  </button>
                  <button 
                    onClick={() => handleModelAction('rf', 'rollback')}
                    disabled={rfStatus !== 'Deployed'}
                    className="flex-1 py-1.5 flex justify-center items-center gap-1.5 text-xs font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Rollback
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Automated Response Log */}
      {data.responseLog && (
        <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {t('soc.response_log', 'Automated Response Log')}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{t('soc.timeline', 'Timeline of automated mitigation actions taken by KavachX')}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('soc.search', 'Search logs...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                <Filter className="w-4 h-4 text-slate-400 ml-2" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent text-sm text-slate-700 py-1 pr-4 focus:outline-none cursor-pointer"
                >
                  <option value="all">{t('soc.all_types', 'All Types')}</option>
                  <option value="identity">{t('soc.identity', 'Identity')}</option>
                  <option value="network">{t('soc.network', 'Network')}</option>
                  <option value="data">{t('soc.data', 'Data')}</option>
                  <option value="endpoint">{t('soc.endpoint', 'Endpoint')}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">{t('soc.time', 'Time')}</th>
                  <th className="px-6 py-4 font-medium">{t('soc.action_taken', 'Action Taken')}</th>
                  <th className="px-6 py-4 font-medium">{t('soc.trigger_event', 'Trigger Event')}</th>
                  <th className="px-6 py-4 font-medium">{t('soc.impact', 'Impact & Mitigation')}</th>
                  <th className="px-6 py-4 font-medium text-right">{t('soc.status', 'Status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredLogs.map((log: any) => (
                    <motion.tr 
                      key={log.id} 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500 whitespace-nowrap">
                          <Clock className="w-3.5 h-3.5" />
                          {log.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">{log.action}</span>
                        <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">{log.type}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {log.trigger}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {log.impact}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {log.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                        {t('soc.no_logs', 'No logs match your filters.')}
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Floating Quick Action Sidebar */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-20 md:right-6 w-auto md:w-80 bg-slate-900 shadow-2xl rounded-2xl border border-slate-700 p-6 z-50 text-white max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  {t('soc.quick_actions', 'Quick Actions')}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{t('soc.incident', 'Incident:')} {selectedIncident.id}</p>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('soc.target', 'Target')}</div>
                <div className="font-mono text-sm">{selectedIncident.user}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{t('soc.alert', 'Alert')}</div>
                <div className="text-sm">{selectedIncident.type}</div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => handleExecutePlaybook('freeze')} 
                disabled={isL1 || mitigating}
                title={isL1 ? "L1 Analysts cannot execute mitigation." : ""}
                className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all group ${isL1 || mitigating ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'}`}
              >
                <span className="flex items-center gap-2 font-medium text-sm">
                  <Lock className="w-4 h-4" />
                  {isL1 ? 'Freeze Account (Requires L3)' : (mitigating ? t('soc.executing', 'Executing...') : t('soc.freeze', 'Freeze Account'))}
                </span>
                {!isL1 && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />}
              </button>
              
              <button 
                onClick={() => handleExecutePlaybook('pause')} 
                disabled={isL1 || mitigating}
                className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all group ${isL1 || mitigating ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' : 'bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border-orange-500/30'}`}
              >
                <span className="flex items-center gap-2 font-medium text-sm">
                  <Pause className="w-4 h-4" />
                  {isL1 ? 'Pause RTGS (Requires L3)' : (mitigating ? t('soc.executing', 'Executing...') : t('soc.pause', 'Pause RTGS'))}
                </span>
                {!isL1 && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />}
              </button>

              <button 
                onClick={() => handleExecutePlaybook('isolate')} 
                disabled={isL1 || mitigating}
                className={`w-full flex items-center justify-between p-3 border rounded-xl transition-all group ${isL1 || mitigating ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' : 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/30'}`}
              >
                <span className="flex items-center gap-2 font-medium text-sm">
                  <ShieldBan className="w-4 h-4" />
                  {isL1 ? 'Isolate Asset (Requires L3)' : (mitigating ? t('soc.executing', 'Executing...') : t('soc.isolate', 'Isolate Asset'))}
                </span>
                {!isL1 && <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />}
              </button>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
               <button onClick={() => runAiAnalysis(selectedIncident)} className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                 <ShieldAlert className="w-4 h-4" />
                 {analyzing ? <span className="animate-pulse">{t('soc.analyzing', 'Analyzing...')}</span> : t('soc.run_ai_analysis', 'Run AI Threat Analysis')}
               </button>

               {aiAnalysis && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-sm">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-slate-400 text-xs font-semibold uppercase">{t('soc.ai_verdict', 'AI Verdict')}</span>
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${aiAnalysis.truePositiveProbability > 0.5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                       {Math.round(aiAnalysis.truePositiveProbability * 100)}% Confidence
                     </span>
                   </div>
                   <div className="text-slate-200 font-medium mb-1">{aiAnalysis.classification}</div>
                   <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                     {aiAnalysis.keyIndicators?.map((ind: string, idx: number) => (
                       <li key={idx}>{ind}</li>
                     ))}
                   </ul>
                 </motion.div>
               )}

               <button onClick={() => handleExecutePlaybook('full_playbook')} disabled={isL1 || mitigating} className={`w-full py-2 bg-slate-800 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${isL1 || mitigating ? 'opacity-50 cursor-not-allowed text-slate-500' : 'hover:bg-slate-700 text-white'}`}>
                 <Play className="w-4 h-4" />
                 {mitigating ? <span className="animate-pulse">{t('soc.executing', 'Executing...')}</span> : t('soc.run_playbook', 'Run Automated Playbook')}
               </button>

               <button onClick={() => setShowReport(true)} className="w-full mt-2 py-2 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 hover:bg-emerald-600/40">
                 <FileDigit className="w-4 h-4" />
                 Generate DFIR Compliance Report
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New AI & Architecture Visualizers */}
      <AICopilotSidebar />
      <EdgeTriageTicker />

      {/* DFIR Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl max-w-4xl w-full my-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                    <FileDigit className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Digital Forensics & Incident Response Report</h2>
                    <p className="text-xs text-slate-400 font-mono">Generated by KavachX Gemini Copilot • {new Date().toISOString()}</p>
                  </div>
                </div>
                <button onClick={() => setShowReport(false)} className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-800 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 text-slate-300 font-mono text-sm leading-relaxed max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-xs text-slate-500 mb-1">INCIDENT ID</div>
                    <div className="text-white font-bold">INC-2026-8891</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-xs text-slate-500 mb-1">SEVERITY</div>
                    <div className="text-red-400 font-bold uppercase">Critical (Score: 99.8)</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-xs text-slate-500 mb-1">THREAT VECTOR</div>
                    <div className="text-white font-bold">AiTM Phishing + Session Hijack</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-xs text-slate-500 mb-1">FINANCIAL EXPOSURE</div>
                    <div className="text-rose-400 font-bold">£5,000,000 (CONTAINED)</div>
                  </div>
                </div>

                <h3 className="text-lg text-white font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2"><ShieldAlert className="w-5 h-5 text-rose-500" /> Executive Summary</h3>
                <p className="mb-6">At 17:00 on Friday, KavachX Autonomous Command Center detected a highly coordinated Corporate Account Takeover attempt targeting the bulk RTGS clearing pipeline. An attacker utilized an Adversary-in-the-Middle (AiTM) phishing kit to bypass MFA and hijack a valid Finance Manager session cookie. The system correlated isolated WAF and IAM alerts with Core Banking telemetry in 142ms via the Neo4j Graph Engine, successfully predicting and pausing a £5,000,000 fraudulent transfer prior to settlement.</p>
                
                <h3 className="text-lg text-white font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2"><Activity className="w-5 h-5 text-blue-500" /> MITRE ATT&CK Mapping</h3>
                <ul className="list-none space-y-2 mb-6">
                  <li className="flex items-center gap-3"><span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold w-24 text-center">T1111</span> Two-Factor Authentication Interception (AiTM)</li>
                  <li className="flex items-center gap-3"><span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold w-24 text-center">T1550.004</span> Web Session Cookie Theft</li>
                  <li className="flex items-center gap-3"><span className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-bold w-24 text-center">T1565.001</span> Data Manipulation: Stored Data (Beneficiary Mod)</li>
                </ul>

                <h3 className="text-lg text-white font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2"><ShieldCheck className="w-5 h-5 text-emerald-500" /> Automated Mitigation Timeline</h3>
                <div className="space-y-4 pl-4 border-l-2 border-emerald-500/30 ml-2">
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-400 text-xs font-bold mr-2">T+0ms</span> Attacker initiates RTGS transfer.
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-400 text-xs font-bold mr-2">T+142ms</span> KavachX Graph Engine correlates VPN + Cookie + IP + Core Banking Txn.
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-400 text-xs font-bold mr-2">T+250ms</span> Autonomous Playbook triggered by Gemini Flash AI.
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-emerald-400 text-xs font-bold mr-2">T+800ms</span> Ledger Frozen. Session Terminated. Zero Funds Lost.
                  </div>
                </div>

              </div>
              
              <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end gap-3">
                <button onClick={() => setShowReport(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                  Close Report
                </button>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                  <FileDigit className="w-4 h-4" />
                  Export as PDF
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution Success Modal */}
      <AnimatePresence>
        {executeResult && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse"></div>
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Playbook Executed</h3>
              <p className="text-sm text-slate-300 mb-6 whitespace-pre-wrap">{executeResult.message}</p>
              <button 
                onClick={() => {
                  setExecuteResult(null);
                  if (selectedIncident) {
                    setData((prev: any) => {
                      if (!prev) return prev;
                      return {
                        ...prev,
                        riskScore: Math.max(10, prev.riskScore - 25),
                        activeIncidents: Math.max(0, prev.activeIncidents - 1),
                        incidentFeed: prev.incidentFeed?.map((inc: any) => 
                          inc.id === selectedIncident.id ? { ...inc, status: 'CONTAINED', severity: 'low' } : inc
                        ) || []
                      };
                    });
                  }
                  setSelectedIncident(null);
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-colors"
              >
                Acknowledge & Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
