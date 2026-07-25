import React from 'react';
import { motion, Variants } from 'motion/react';
import { Shield, TrendingUp, AlertTriangle, Building, FileText, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const financialData = [
  { time: '00:00', exposure: 250000 },
  { time: '04:00', exposure: 280000 },
  { time: '08:00', exposure: 420000 },
  { time: '12:00', exposure: 310000 },
  { time: '16:00', exposure: 750000 },
  { time: '20:00', exposure: 120000 },
];

export default function ExecutiveDashboard() {
  const { t } = useTranslation();

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

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6 p-2 md:p-4">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <Building className="w-6 h-6 text-slate-700" />
          Executive Command Center
        </h2>
        <p className="text-slate-500 text-sm mt-1">Enterprise cyber health and financial exposure overview.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-700">Cyber Health Index</h3>
          </div>
          <div className="text-4xl font-black text-slate-900">92<span className="text-lg text-slate-500 font-medium">/100</span></div>
          <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2 points this week
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-sm font-semibold text-slate-700">Enterprise Risk Score</h3>
            </div>
            <div className="text-4xl font-black text-red-600">High</div>
            <p className="text-xs text-red-500 font-medium mt-2">Driven by 3 active APTS</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="text-sm font-semibold text-slate-700">Financial Exposure</h3>
          </div>
          <div className="text-4xl font-black text-slate-900">$750K</div>
          <p className="text-xs text-slate-500 mt-2">Potential loss at risk</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-semibold text-slate-700">RBI Compliance</h3>
          </div>
          <div className="text-4xl font-black text-blue-600">98%</div>
          <p className="text-xs text-blue-500 font-medium mt-2">Compliant across 4 frameworks</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Exposure Trend */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 mb-6">Financial Exposure Trend (24h)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorExposure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Exposure']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="exposure" stroke="#ef4444" strokeWidth={2} fill="url(#colorExposure)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* High Level Incident Summary */}
        <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-900">Critical Business Impact</h3>
          </div>
          <div className="p-4 flex-1 space-y-4">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
               <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Core Banking System</h4>
               <p className="text-sm text-red-600">Elevated latency detected due to correlated database enumeration attacks. Risk of operational downtime.</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
               <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-1">RTGS Gateway</h4>
               <p className="text-sm text-orange-600">3 suspicious high-value transfers blocked by KavachX AI. Pending manual authorization.</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
               <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">PQC Readiness</h4>
               <p className="text-sm text-indigo-600">API Gateway encryption is legacy RSA-2048. Vulnerable to Harvest Now, Decrypt Later (HNDL). Migration recommended.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
