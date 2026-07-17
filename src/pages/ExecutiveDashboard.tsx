import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKavachWebSocket } from '../lib/websocket';
import { fetchExecutiveDashboard, triggerSimulation } from '../lib/api';
import { ShieldAlert, Activity, DollarSign, CheckCircle2, TrendingDown, Play, TrendingUp, Minus, LogOut } from 'lucide-react';
import { getCurrentUser, logout } from '../lib/auth';
import { Link } from 'react-router-dom';
import { TrendChart } from '../components/TrendChart';

export function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { health: liveHealth, activeIncidents, chiTrend: liveChiTrend, demoLogs, trustScores: liveTrustScores } = useKavachWebSocket();
  const [data, setData] = useState<any>(null);
  const [demoSimulating, setDemoSimulating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const user = getCurrentUser();

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    if (demoLogs.length > 0) {
      setToast(demoLogs[demoLogs.length - 1]);
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [demoLogs]);

  useEffect(() => {
    fetchExecutiveDashboard().then(setData);
  }, []);

  const handleStartDemo = async () => {
    setDemoSimulating(true);
    await triggerSimulation();
    setTimeout(() => setDemoSimulating(false), 12000); // 12 seconds for full sequence
  };

  const health = liveHealth ?? data?.cyberHealthIndex ?? 100;
  const isCritical = activeIncidents.some((i: any) => i.severity === 'critical');
  const chiTrend = liveChiTrend && liveChiTrend.length > 0 ? liveChiTrend : (data?.chiTrend || []);
  const trustScores = liveTrustScores.length > 0 ? liveTrustScores : (data?.trustScores || []);

  if (!data) return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-64 bg-slate-800/50 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-800/30 rounded-xl border border-slate-800/50" />)}
      </div>
    </div>
  );

  const totalExposureValue = activeIncidents.reduce((sum, inc) => sum + (inc.business_impact?.loss_exposure_inr || 0), 0);
  const exposure = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalExposureValue);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-xl shadow-indigo-900/50 flex items-center space-x-3 z-50 animate-in slide-in-from-bottom-5 fade-in">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 relative z-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Command Center</h1>
          <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center">
             <Activity className="h-4 w-4 mr-2" />
             Real-time risk posture and deterministic correlation insights
          </p>
          {user && (
            <p className="text-slate-600 text-xs mt-1 font-mono">
              Logged in as <span className="text-indigo-400 font-bold">{user.name}</span> · {user.role}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleStartDemo}
            disabled={demoSimulating}
            className="bg-indigo-600/80 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center border border-indigo-400/50 disabled:opacity-50 text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] group"
          >
            <Play className="h-5 w-5 mr-3 group-hover:text-cyan-400 transition-colors" />
            {demoSimulating ? 'Injecting Attack...' : 'Start Demo Simulation'}
          </button>
          <button
            onClick={handleLogout}
            className="p-3 bg-slate-800/50 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg border border-slate-700/50 hover:border-red-500/30 transition-all"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Primary KPI Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Cyber Health Index - Expanded with Radial Gauge */}
        <div className="lg:col-span-2 bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="flex items-center justify-between relative z-10 h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm font-bold uppercase tracking-widest text-slate-300">Cyber Health Index</span>
                </div>
                <p className="text-slate-500 text-sm mt-2 max-w-[200px] leading-relaxed">Real-time aggregate risk posture derived from telemetry & transactional models.</p>
              </div>
              <div className="mt-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${health < 50 ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]'}`}>
                  {health < 50 ? 'Critical Risk' : health < 80 ? 'Elevated Risk' : 'System Secure'}
                </span>
              </div>
            </div>
            
            {/* SVG Circular Gauge */}
            <div className="relative flex items-center justify-center shrink-0 pr-4">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring */}
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-slate-800/50" />
                {/* Progress Ring */}
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="transparent" 
                  stroke={health < 50 ? '#ef4444' : health < 80 ? '#f59e0b' : '#22d3ee'} 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - health / 100)}
                  className="transition-all duration-1000 ease-out"
                  style={{ filter: `drop-shadow(0 0 8px ${health < 50 ? 'rgba(239,68,68,0.6)' : health < 80 ? 'rgba(245,158,11,0.6)' : 'rgba(34,211,238,0.6)'})` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-4">
                <span className={`text-5xl font-mono tracking-tighter font-bold ${health < 50 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : health < 80 ? 'text-amber-500' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]'}`}>
                  {health}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Impact */}
        <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between relative shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Value at Risk</span>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.2)]">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-mono tracking-tight text-white">{exposure}</span>
            <div className="flex items-center text-red-400 text-xs mt-3 font-semibold bg-red-500/10 px-2 py-1 rounded-md border border-red-500/10 w-fit">
               <TrendingDown className="h-3 w-3 mr-1.5" />
               Critical exposure detected
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
        </div>

        {/* Compliance */}
        <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 flex flex-col justify-between relative shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] group hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Compliance Stance</span>
            <div className={`p-2.5 rounded-xl border shadow-[0_0_15px_rgba(0,0,0,0.2)] ${isCritical ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-cyan-500/20'}`}>
              {isCritical ? <ShieldAlert className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            </div>
          </div>
          <div className="relative z-10">
            <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold tracking-widest uppercase border shadow-lg ${isCritical ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-cyan-500/20'}`}>
              {isCritical ? 'RBI SLA AT RISK' : 'ISO COMPLIANT'}
            </span>
          </div>
          <div className={`absolute bottom-0 right-0 w-32 h-32 rounded-full blur-[40px] pointer-events-none ${isCritical ? 'bg-red-500/5' : 'bg-cyan-500/5'}`} />
        </div>
      </div>

      {/* Cyber Health Index Trend Chart */}
      <div className="mt-8 bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative">
        <div className="absolute top-0 right-1/4 w-96 h-32 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="mb-6 relative z-10">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">Cyber Health Index Trend (24h)</h2>
          <p className="text-sm text-cyan-500/70 mt-1 font-medium tracking-wide">Continuous monitoring of aggregate risk posture across all environments.</p>
        </div>
        <div className="h-64 w-full relative z-10">
          <TrendChart 
            data={chiTrend} 
            dataKey="chi" 
            isCritical={health < 50} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-8">
        
        {/* Left Column: Incidents */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">Correlated Threats</h2>
            <span className="text-sm font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.2)]">{activeIncidents.length} Active</span>
          </div>
          
          {activeIncidents.length === 0 ? (
            <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 border-dashed rounded-2xl p-12 text-center shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/5 blur-[50px] pointer-events-none" />
              <CheckCircle2 className="h-10 w-10 text-cyan-500 mx-auto mb-4 opacity-80 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <p className="text-slate-300 font-bold uppercase tracking-widest text-sm relative z-10">No active incidents.</p>
              <p className="text-cyan-500/70 text-xs mt-2 uppercase tracking-wider relative z-10">Correlation engine operating nominally.</p>
            </div>
          ) : (
            <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl divide-y divide-indigo-500/10 shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] overflow-hidden relative">
              {activeIncidents.map((inc: any) => (
                <div key={inc.incident_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-indigo-500/5 transition-colors gap-4 relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 z-10">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        {inc.severity}
                      </span>
                      <span className="text-slate-200 font-medium text-sm tracking-wide">Target Entity: <span className="font-mono text-cyan-300 font-bold tracking-normal">{inc.entity_id}</span></span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-slate-400 line-clamp-1 flex-1 border-l-2 border-red-500/50 pl-3 py-0.5 font-medium tracking-wide">
                        {inc.reasons[0]?.factor}
                      </p>
                      <div className="hidden md:flex flex-col items-end shrink-0">
                         <span className="text-[10px] text-red-400/70 uppercase tracking-widest font-bold">Risk Score</span>
                         <span className="font-mono text-red-400 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.5)] text-lg">{inc.risk_score}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex justify-end z-10">
                    <Link to={`/dashboard/incident/${inc.incident_id}`} className="px-5 py-2.5 bg-indigo-600/80 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-400/50 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                      Open Investigation &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Trust Scores */}
        <div className="xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white tracking-wide uppercase">Dynamic Trust Scores</h2>
            <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded border border-cyan-500/20 uppercase tracking-widest shadow-[0_0_10px_rgba(34,211,238,0.2)]">Behavioral AI</span>
          </div>
          <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] flex flex-col h-full relative">
            <div className="absolute inset-0 bg-indigo-500/5 blur-[40px] pointer-events-none" />
            <div className="divide-y divide-indigo-500/10 flex-1 relative z-10">
              {trustScores.sort((a: any, b: any) => a.score - b.score).map((ts: any, idx: number) => (
                <div key={idx} className="p-5 flex items-center justify-between hover:bg-indigo-500/5 transition-colors group">
                   <div>
                     <div className="text-sm font-mono text-cyan-300 font-bold">{ts.entity_id}</div>
                     <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 font-bold">{ts.type}</div>
                   </div>
                   <div className="flex items-center space-x-4">
                     {ts.trend === 'down' ? <TrendingDown className="h-4 w-4 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" /> : 
                      ts.trend === 'up' ? <TrendingUp className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" /> : 
                      <Minus className="h-4 w-4 text-slate-500" />}
                     <div className={`text-2xl font-mono tracking-tighter font-bold ${ts.score < 50 ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'}`}>
                       {ts.score}
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
