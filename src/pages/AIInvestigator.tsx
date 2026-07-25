import React from 'react';
import { motion, Variants } from 'motion/react';
import { ShieldAlert, Network, ArrowRight, Server, Smartphone, Key, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RiskCopilot from '../components/RiskCopilot';

export default function AIInvestigator() {
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
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-6 p-2 md:p-4 h-full flex flex-col">
      
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-600" />
          Risk Analysis
        </h2>
        <p className="text-slate-500 text-sm mt-1">Multi-domain alert correlation and generative AI mitigation.</p>
      </div>

      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: The Correlation Chain */}
        <motion.div variants={item} className="lg:w-1/2 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
             <Network className="w-5 h-5 text-indigo-500" />
             <h3 className="text-sm font-semibold text-slate-900">Incident INC-9942 Correlation Chain</h3>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <p className="text-sm text-slate-600 mb-4">
              KavachX AI has successfully correlated <strong>5 separate alerts</strong> across 3 domains (Network, Database, Transactional) into a single overarching incident.
            </p>

            <div className="relative pl-6 border-l-2 border-indigo-100 space-y-6">
              
              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                  <Key className="w-3 h-3 text-slate-500" />
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Alert 1: Identity Provider</span>
                  <h4 className="text-sm font-semibold text-slate-800">Anomalous VPN Login</h4>
                  <p className="text-xs text-slate-500 mt-1">User 'admin_jdoe' logged in from a high-risk IP outside of normal business hours.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center">
                  <Server className="w-3 h-3 text-slate-500" />
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Alert 2: Database Firewall</span>
                  <h4 className="text-sm font-semibold text-slate-800">Unusual Table Access</h4>
                  <p className="text-xs text-slate-500 mt-1">Query patterns indicate sequential enumeration of CORE_DB 'user_accounts' table.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center">
                  <Smartphone className="w-3 h-3 text-orange-500" />
                </div>
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1 block">Alert 3: Transaction Gateway</span>
                  <h4 className="text-sm font-semibold text-orange-800">High Velocity UPI Requests</h4>
                  <p className="text-xs text-orange-600/80 mt-1">Multiple small-value transaction initiations originating from the compromised session.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[35px] top-1 w-6 h-6 rounded-full bg-red-100 border-2 border-white flex items-center justify-center">
                  <ShieldAlert className="w-3 h-3 text-red-500" />
                </div>
                <div className="bg-red-50/50 p-3 rounded-lg border border-red-200">
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-1 block">Alert 4 & 5: Core Banking System</span>
                  <h4 className="text-sm font-semibold text-red-900">RTGS Fraud Pattern Detected</h4>
                  <p className="text-xs text-red-700/80 mt-1">Attempted ₹4.2Cr unauthorized transfer to offshore entity blocked by KavachX anomaly engine.</p>
                </div>
              </div>

              <div className="pt-4 flex justify-center">
                <div className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Correlated Incident: INC-9942
                </div>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Right Side: Copilot */}
        <motion.div variants={item} className="lg:w-1/2 flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
           <RiskCopilot />
        </motion.div>

      </div>
    </motion.div>
  );
}
