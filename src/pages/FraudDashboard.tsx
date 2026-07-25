import React, { useState } from 'react';
import { motion, Variants } from 'motion/react';
import { Activity, Search, Filter, ShieldBan, Smartphone, Globe, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const transactionData = [
  { time: '10:00', normal: 4000, anomalous: 20 },
  { time: '10:30', normal: 3000, anomalous: 15 },
  { time: '11:00', normal: 2000, anomalous: 10 },
  { time: '11:30', normal: 2780, anomalous: 180 }, // Spike in anomalies
  { time: '12:00', normal: 1890, anomalous: 20 },
  { time: '12:30', normal: 2390, anomalous: 10 },
  { time: '13:00', normal: 3490, anomalous: 15 },
];

export default function FraudDashboard() {
  const [filterType, setFilterType] = useState('all');

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
          <Activity className="w-6 h-6 text-slate-700" />
          Fraud Management Center
        </h2>
        <p className="text-slate-500 text-sm mt-1">Real-time transactional anomaly and behavioral deviation tracking.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
               <ShieldBan className="w-5 h-5 text-red-500" />
               <h3 className="text-sm font-semibold text-slate-700">Blocked Transactions</h3>
             </div>
             <div className="text-4xl font-black text-slate-900">4,281</div>
             <p className="text-xs text-red-500 font-medium mt-2">Past 24 hours</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-0"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
               <Globe className="w-5 h-5 text-orange-500" />
               <h3 className="text-sm font-semibold text-slate-700">RTGS Anomalies</h3>
             </div>
             <div className="text-4xl font-black text-slate-900">18</div>
             <p className="text-xs text-orange-500 font-medium mt-2">Requires manual review</p>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0"></div>
          <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
               <Smartphone className="w-5 h-5 text-blue-500" />
               <h3 className="text-sm font-semibold text-slate-700">UPI Fraud Attempts</h3>
             </div>
             <div className="text-4xl font-black text-slate-900">2,105</div>
             <p className="text-xs text-blue-500 font-medium mt-2">Blocked by AI Correlation</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Volume Trend */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 h-[400px] flex flex-col">
          <h3 className="text-sm font-semibold text-slate-900 mb-6">Live Transaction Flow (Normal vs Anomalous)</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomalous" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="normal" stackId="1" stroke="#3b82f6" fill="url(#colorNormal)" strokeWidth={2} />
                <Area type="monotone" dataKey="anomalous" stackId="2" stroke="#ef4444" fill="url(#colorAnomalous)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Suspicious Activities Feed */}
        <motion.div variants={item} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900">Flagged Behaviors</h3>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
              <Filter className="w-4 h-4 text-slate-400 ml-2" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent text-xs text-slate-700 py-1 pr-4 focus:outline-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="rtgs">RTGS</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>
          
          <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[350px]">
            {/* Mock Items */}
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                 <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1"><Globe className="w-3 h-3"/> RTGS</h4>
                 <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">FROZEN</span>
              </div>
              <p className="text-sm text-slate-700 mb-1 font-mono text-xs">TXN-9982-11A</p>
              <p className="text-xs text-slate-500">Correlated with unusual VPN login from non-compliant IP. Action frozen by AI.</p>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                 <h4 className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1"><Smartphone className="w-3 h-3"/> UPI Velocity</h4>
                 <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">REVIEW</span>
              </div>
              <p className="text-sm text-slate-700 mb-1 font-mono text-xs">USR-442-DEV</p>
              <p className="text-xs text-slate-500">14 rapid small-value transactions. Deviates from user's standard behavioral model.</p>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                 <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1"><CreditCard className="w-3 h-3"/> Card Not Present</h4>
                 <span className="text-[10px] font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">CLEARED</span>
              </div>
              <p className="text-sm text-slate-700 mb-1 font-mono text-xs">CRD-991-XX</p>
              <p className="text-xs text-slate-500">High value international e-commerce. AI verified through 2FA token correlation.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
