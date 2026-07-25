import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, Activity, Crosshair, BarChart3, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function RiskAnalytics() {
  const { t } = useTranslation();
  const [analyzingSeq, setAnalyzingSeq] = useState(false);
  const [sequenceData, setSequenceData] = useState<any>(null);

  const runSequenceAnalysis = async () => {
    setAnalyzingSeq(true);
    try {
      const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/ml/sequence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionTimeline: ["VPN Login from new IP", "Accessed CORE_DB", "High data transfer to unknown IP"] })
      });
      const data = await res.json();
      setSequenceData(data);
    } catch(err) {
      console.error(err);
    }
    setAnalyzingSeq(false);
  };
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{t('risk.title', 'Threat Forecast Engine')}</h1>
          <p className="text-slate-500 mt-1">{t('risk.subtitle', 'Predictive intelligence and risk scoring powered by AI.')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">{t('risk.live_prediction', 'Live Prediction Active')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full uppercase tracking-wider">{t('risk.elevated', 'Elevated')}</span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">{t('risk.projected_risk', 'Projected Enterprise Risk')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">74<span className="text-lg text-slate-400 font-normal">/100</span></h3>
            <span className="text-sm text-red-500 flex items-center font-medium">
              {t('risk.plus_12', '+12 in 24h')}
            </span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full uppercase tracking-wider">{t('risk.critical', 'Critical')}</span>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">{t('risk.forecasted_exposure', 'Forecasted Financial Exposure')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{t('risk.exposure_val', '₹4.2')}<span className="text-lg text-slate-400 font-normal">{t('risk.cr', 'Cr')}</span></h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Crosshair className="w-5 h-5" />
            </div>
          </div>
          <p className="text-sm text-slate-500 font-medium mb-1">{t('risk.most_targeted', 'Most Targeted Asset Class')}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 truncate">{t('risk.rtgs_gateways', 'RTGS Gateways')}</h3>
          </div>
          <p className="text-xs text-slate-400 mt-2">{t('risk.based_on', 'Based on current threat vectors')}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="p-6 md:w-1/3 bg-slate-50 border-r border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            {t('risk.active_vectors', 'Active Attack Vectors')}
          </h3>
          <div className="space-y-4">
            {[
              { name: t('risk.v1', 'Database Enumeration'), risk: 85, trend: 'up' },
              { name: t('risk.v2', 'Privilege Escalation'), risk: 62, trend: 'stable' },
              { name: t('risk.v3', 'Data Exfiltration'), risk: 45, trend: 'up' },
            ].map((vector, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-900 text-sm">{vector.name}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${vector.risk > 75 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                    {vector.risk}% {t('risk.risk', 'Risk')}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${vector.risk}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`h-full ${vector.risk > 75 ? 'bg-red-500' : 'bg-orange-400'}`}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              {t('risk.predicted_movement', 'Predicted Attacker Movement')}
            </h3>
            <button 
              onClick={runSequenceAnalysis} 
              disabled={analyzingSeq}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {analyzingSeq ? t('risk.analyzing', 'Analyzing...') : t('risk.run_sequence', 'Run Sequence Analysis')}
            </button>
          </div>

          {sequenceData && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
              <div className="flex justify-between items-start mb-2">
                <span className="text-indigo-800 font-semibold">{t('risk.ai_sequence_verdict', 'AI Sequence Analysis Verdict')}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${sequenceData.threatDetected ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {t('risk.risk_score', 'Risk Score:')} {sequenceData.sequenceRiskScore}
                </span>
              </div>
              <p className="text-sm text-indigo-700 mb-1"><strong>{t('risk.threat_type', 'Threat Type:')}</strong> {sequenceData.threatType}</p>
              <p className="text-sm text-indigo-700"><strong>{t('risk.reasoning', 'Reasoning:')}</strong> {sequenceData.reasoning}</p>
            </motion.div>
          )}
          
          <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 group-[.is-active]:bg-blue-600 group-[.is-active]:text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                1
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 shadow-sm bg-white">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('risk.current_state', 'Current State')}</span>
                  <span className="text-xs text-slate-400">{t('risk.t_0', 'T=0')}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('risk.vpn_comp', 'VPN Compromise & Network Discovery')}</h4>
                <p className="text-sm text-slate-600">{t('risk.vpn_desc', 'Attacker has established a foothold via compromised VPN credentials and is mapping the internal subnet.')}</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 group-[.is-active]:bg-orange-500 group-[.is-active]:text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                2
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-orange-200 shadow-sm bg-orange-50/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">{t('risk.in_progress', 'In Progress')}</span>
                  <span className="text-xs text-orange-500 font-medium">{t('risk.t_15', 'T+15 mins')}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('risk.db_enum', 'Database Enumeration')}</h4>
                <p className="text-sm text-slate-600">{t('risk.db_desc', 'Attempting to identify sensitive tables containing PII and transactional records within CORE_DB.')}</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                3
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 border-dashed shadow-sm bg-white opacity-60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('risk.predicted_action', 'Predicted Action')}</span>
                  <span className="text-xs text-slate-400">{t('risk.t_45', 'T+45 mins')}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{t('risk.cred_dump', 'Credential Dumping')}</h4>
                <p className="text-sm text-slate-600">{t('risk.cred_desc', 'Expected to target memory or registry for privilege escalation to domain admin.')}</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-200 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-red-200 border-dashed shadow-sm bg-red-50/30 opacity-60">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">{t('risk.predicted_impact', 'Predicted Impact')}</span>
                  <span className="text-xs text-red-400 font-medium">{t('risk.t_120', 'T+120 mins')}</span>
                </div>
                <h4 className="font-bold text-red-900 text-sm mb-1">{t('risk.unauth_rtgs', 'Unauthorized RTGS Transfer')}</h4>
                <p className="text-sm text-red-700/80">{t('risk.unauth_desc', 'If not contained, the attacker will likely attempt to initiate fraudulent high-value transfers.')}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
