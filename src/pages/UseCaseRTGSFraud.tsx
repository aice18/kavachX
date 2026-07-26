import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, ShieldAlert, Laptop, ShieldCheck, Database, FileDigit, 
  Activity, Zap, UserX, LineChart, Banknote, MapPin, Eye, Fingerprint, Lock
} from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import FraudGraph3D from '../components/FraudGraph3D';

export default function UseCaseRTGSFraud() {
  const { t } = useTranslation();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-50px" },
    transition: { duration: 0.5 }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 md:px-10 mb-8">
        <div className="h-14 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full flex justify-between items-center px-6 py-2">
          <Link to="/solutions" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Solutions</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-900 hidden md:block">Use Case</div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 md:px-10">
        
        {/* Hero Section */}
        <motion.div {...fadeIn} className="text-center mb-20 pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold text-sm mb-6 border border-red-100 shadow-sm">
            <ShieldAlert className="w-4 h-4" />
            {t('usecase.uc_hero_cat', 'Corporate Account Takeover')}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            {t('usecase.uc_hero_title1', 'High-Value ')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">{t('usecase.uc_hero_title2', 'RTGS Fraud')}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t('usecase.uc_hero_desc', 'Discover how KavachX correlates disparate cyber telemetry with core banking transactions to detect and stop a £5 million fraud attempt in real-time.')}
          </p>
        </motion.div>

        {/* Background */}
        <motion.div {...fadeIn} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            {t('usecase.uc_bg_title', 'The Scenario: A Friday Evening Nightmare')}
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            {t('usecase.uc_bg_desc', "A major corporate client is executing a bulk RTGS transfer to pay their vendors. It's Friday at 5:00 PM. Unbeknownst to the bank, the client's Finance Manager fell victim to a sophisticated AiTM (Adversary-in-the-Middle) phishing attack earlier that week, allowing the attacker to bypass MFA and steal a valid session cookie.")}
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-amber-800 flex items-center gap-2 font-medium">
              <UserX className="w-5 h-5" />
              {t('usecase.uc_bg_alert', "The attacker is now inside the bank's portal, armed with a valid session and the authority to move millions.")}
            </p>
          </div>
        </motion.div>

        <div className="space-y-16">
          {/* Step 1 */}
          <motion.div {...fadeIn} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 md:text-right mb-6 md:mb-0">
                <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-lg text-sm font-bold mb-2">{t('usecase.uc_s1_badge', "The Bank's Blindspot")}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('usecase.uc_s1_title', 'Siloed Data & Alert Fatigue')}</h3>
                <p className="text-slate-600">{t('usecase.uc_s1_desc', 'The attacker injects the cookie and acts quickly. Legacy systems generate alerts, but they are siloed. The SIEM will take 15 minutes to correlate them—too late.')}</p>
              </div>
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-bold">IAM</div>
                    <div className="flex-1"><p className="font-semibold text-slate-900">{t('usecase.uc_s1_iam_t', 'Valid Session Cookie')}</p><p className="text-sm text-slate-500">{t('usecase.uc_s1_iam_d', 'Access Granted. Risk Score: 10/100')}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-bold">WAF</div>
                    <div className="flex-1"><p className="font-semibold text-slate-900">{t('usecase.uc_s1_waf_t', 'Unrecognized IP Address')}</p><p className="text-sm text-slate-500">{t('usecase.uc_s1_waf_d', 'Flagged, but not blocked. Risk Score: 40/100')}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center text-slate-500 font-bold">CBS</div>
                    <div className="flex-1"><p className="font-semibold text-slate-900">{t('usecase.uc_s1_cbs_t', '£5M RTGS Initiated')}</p><p className="text-sm text-slate-500">{t('usecase.uc_s1_cbs_d', 'Valid API Signature. Pending Settlement.')}</p></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 - KavachX Correlates */}
          <motion.div {...fadeIn} className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative mt-24">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Zap className="w-64 h-64" />
            </div>
            
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-bold mb-4">{t('usecase.uc_s2_badge', 'The KavachX Difference')}</div>
            <h3 className="text-3xl font-bold mb-6">{t('usecase.uc_s2_title', 'Real-Time Graph Correlation')}</h3>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl">
              {t('usecase.uc_s2_desc', "KavachX doesn't wait for the SIEM. It streams WAF, IAM, and Core Banking logs directly into a Neo4j Graph Database via Apache Flink. It instantly connects the dots that a human analyst couldn't see in time.")}
            </p>

            <div className="mb-10 relative z-10">
              <FraudGraph3D />
            </div>

            <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 text-center relative z-10 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2">{t('usecase.uc_s2_v1', 'Autonomous Verdict Reached (142ms)')}</div>
              <div className="text-2xl font-bold text-white mb-2">{t('usecase.uc_s2_v2', 'AiTM Session Hijack + Fraudulent RTGS')}</div>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{t('usecase.uc_s2_v3', 'Confidence: 99.8%')}</div>
            </div>
          </motion.div>

          {/* AI Copilot & Forecast */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                {t('usecase.uc_copilot_title', 'Interactive AI Copilot')}
              </h3>
              <p className="text-slate-600 text-sm mb-4">{t('usecase.uc_copilot_desc', 'Chat directly with the threat graph using Gemini 2.5 Flash to rapidly triage incidents.')}</p>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 font-medium mb-1">{t('usecase.uc_cp_rc', 'Root Cause')}</div>
                  <div className="font-semibold text-slate-900">{t('usecase.uc_cp_rcv', 'Compromised Finance Manager Credentials')}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium mb-1">{t('usecase.uc_cp_pe', 'Potential Exposure')}</div>
                  <div className="font-semibold text-rose-600 text-xl">{t('usecase.uc_cp_pev', '£5 Million')}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium mb-2">{t('usecase.uc_cp_ra', 'Recommended Actions')}</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs font-bold border border-rose-100">{t('usecase.uc_cp_ra1', 'Pause RTGS')}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">{t('usecase.uc_cp_ra2', 'Disable Session')}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">{t('usecase.uc_cp_ra3', 'Lock Beneficiary')}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                {t('usecase.uc_fc_title', 'Threat Forecast Engine')}
              </h3>
              <p className="text-slate-600 text-sm mb-4">{t('usecase.uc_fc_desc', "Predicting attacker's next moves based on historical APT behaviour:")}</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{t('usecase.uc_fc_1', 'Create Additional Beneficiaries')}</span>
                  <span className="font-bold text-rose-600">90%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{width: '90%'}}></div></div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{t('usecase.uc_fc_2', 'Attempt Treasury Access')}</span>
                  <span className="font-bold text-orange-500">82%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{width: '82%'}}></div></div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">{t('usecase.uc_fc_3', 'Customer Data Exfiltration')}</span>
                  <span className="font-bold text-amber-500">75%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-400 h-2 rounded-full" style={{width: '75%'}}></div></div>
              </div>
            </motion.div>
          </div>

          {/* Outcome */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="bg-emerald-50 rounded-3xl p-8 md:p-12 border-2 border-emerald-500/20 text-center relative overflow-hidden shadow-2xl shadow-emerald-500/10"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300 animate-pulse"></div>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              <ShieldCheck className="w-10 h-10 relative z-10" />
            </div>
            <h2 className="text-4xl font-extrabold text-emerald-900 mb-6">{t('usecase.uc_out_title', 'The Outcome')}</h2>
            <p className="text-emerald-800 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              {t('usecase.uc_out_desc', 'Because KavachX correlated VPN authentication, device fingerprinting, threat intelligence, and the RTGS transaction into a single real-time graph...')}
            </p>
            <div className="mt-8 text-2xl md:text-3xl font-black text-emerald-700 bg-white inline-block px-8 py-4 rounded-2xl shadow-lg border border-emerald-200 transform hover:scale-105 transition-transform cursor-default">
              {t('usecase.uc_out_1', 'The attack was detected before settlement.')}<br/>
              <span className="text-emerald-600">{t('usecase.uc_out_2', 'Zero funds left the bank.')}</span>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
