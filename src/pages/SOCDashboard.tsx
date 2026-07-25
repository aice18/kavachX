import React, { useEffect, useState } from 'react';
import { ShieldAlert, Search, Server, Database, Network, ArrowRight, BarChart3, Activity, PieChart as PieChartIcon, Filter, Clock, CheckCircle2, Lock, Pause, ShieldBan, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import ThreatMap from '../components/ThreatMap';

export default function SOCDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [mitigating, setMitigating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const runAiAnalysis = async (incident: any) => {
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('/api/ml/score', {
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

  useEffect(() => {
    const fetchData = () => {
      fetch('/api/metrics/soc')
        .then(res => res.json())
        .then(setData)
        .catch(err => console.error("Error fetching SOC data:", err));
    };
    
    // Initial fetch
    fetchData();
    
    // Poll every 5 seconds
    const intervalId = setInterval(fetchData, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (!data) return (
    <div className="h-full flex items-center justify-center text-slate-500 text-sm gap-2">
      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      {t('soc.loading', 'Loading SOC data...')}
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
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
              
              <div className="w-full h-full absolute inset-0 z-10 p-2">
                <ThreatMap />
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

          {/* Correlation Efficiency */}
          {data.correlationEfficiency && (
            <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full opacity-50"></div>
               <h3 className="text-sm font-semibold text-slate-900 flex items-center justify-center gap-2 mb-2 relative z-10">
                 <PieChartIcon className="w-4 h-4 text-green-500" />
                 {t('soc.ai_efficiency', 'AI Correlation Efficiency')}
               </h3>
               <p className="text-xs text-slate-500 mb-4 relative z-10">{t('soc.reduction', 'Reduction in alert fatigue')}</p>
               <div className="h-[140px] relative z-10">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={[
                         { name: 'Correlated', value: data.correlationEfficiency },
                         { name: 'Raw Alerts', value: 100 - data.correlationEfficiency }
                       ]}
                       cx="50%"
                       cy="50%"
                       innerRadius={45}
                       outerRadius={60}
                       startAngle={90}
                       endAngle={-270}
                       dataKey="value"
                       stroke="none"
                     >
                       <Cell fill="#10b981" />
                       <Cell fill="#f1f5f9" />
                     </Pie>
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <span className="text-3xl font-bold text-slate-900">{data.correlationEfficiency}%</span>
                 </div>
               </div>
            </motion.div>
          )}
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
              <button onClick={() => setMitigating(true)} className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl transition-all group">
                <span className="flex items-center gap-2 font-medium text-sm">
                  <Lock className="w-4 h-4" />
                  {mitigating ? t('soc.executing', 'Executing...') : t('soc.freeze', 'Freeze Account')}
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
              </button>
              
              <button onClick={() => setMitigating(true)} className="w-full flex items-center justify-between p-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl transition-all group">
                <span className="flex items-center gap-2 font-medium text-sm">
                  <Pause className="w-4 h-4" />
                  {mitigating ? t('soc.executing', 'Executing...') : t('soc.pause', 'Pause RTGS')}
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
              </button>

              <button onClick={() => setMitigating(true)} className="w-full flex items-center justify-between p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl transition-all group">
                <span className="flex items-center gap-2 font-medium text-sm">
                  <ShieldBan className="w-4 h-4" />
                  {mitigating ? t('soc.executing', 'Executing...') : t('soc.isolate', 'Isolate Asset')}
                </span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
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

               <button onClick={() => setMitigating(true)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                 <Play className="w-4 h-4" />
                 {mitigating ? <span className="animate-pulse">{t('soc.executing', 'Executing...')}</span> : t('soc.run_playbook', 'Run Automated Playbook')}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
