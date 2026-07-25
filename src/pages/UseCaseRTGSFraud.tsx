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
            Corporate Account Takeover
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            High-Value <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">RTGS Fraud</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Discover how KavachX correlates disparate cyber telemetry with core banking transactions to detect and stop a £5 million fraud attempt in real-time.
          </p>
        </motion.div>

        {/* Background */}
        <motion.div {...fadeIn} className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 mb-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            Background
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-4">
            <strong>ABC Pharmaceuticals</strong> is a corporate customer of the bank. Every Friday, they pay suppliers using RTGS. Today, they are scheduled to pay <strong>£5 million to five suppliers</strong>.
          </p>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-amber-800 flex items-center gap-2 font-medium">
              <UserX className="w-5 h-5" />
              An attacker has already stolen the finance manager's credentials through a targeted phishing campaign.
            </p>
          </div>
        </motion.div>

        <div className="space-y-16">
          {/* Step 1 */}
          <motion.div {...fadeIn} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 md:text-right mb-6 md:mb-0">
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold mb-2">Step 1</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Initial Compromise</h3>
                <p className="text-slate-600">The attacker logs into internet banking using stolen credentials. Individually, these logs don't guarantee fraud.</p>
              </div>
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <Lock className="w-5 h-5 text-slate-500" />
                    <div><p className="font-semibold text-slate-900">VPN Gateway</p><p className="text-sm text-slate-500">Successful Login</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <UserX className="w-5 h-5 text-slate-500" />
                    <div><p className="font-semibold text-slate-900">Active Directory</p><p className="text-sm text-slate-500">Authentication Success</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <Laptop className="w-5 h-5 text-amber-500" />
                    <div><p className="font-semibold text-slate-900">Endpoint Security</p><p className="text-sm text-slate-500">New Device Detected</p></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div {...fadeIn} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 order-2 md:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-slate-700"><MapPin className="w-5 h-5 text-rose-500" /> Different geographic location</li>
                  <li className="flex items-center gap-3 text-slate-700"><Fingerprint className="w-5 h-5 text-rose-500" /> Different browser fingerprint</li>
                  <li className="flex items-center gap-3 text-slate-700"><Activity className="w-5 h-5 text-rose-500" /> Access outside normal hours</li>
                  <li className="flex items-center gap-3 text-slate-700"><Eye className="w-5 h-5 text-rose-500" /> Explored Beneficiaries & Treasury</li>
                </ul>
                <div className="mt-4 p-3 bg-rose-50 text-rose-700 font-bold rounded-lg text-center border border-rose-100">
                  Risk Score Increasing
                </div>
              </div>
              <div className="md:col-span-5 order-1 md:order-2 mb-6 md:mb-0">
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold mb-2">Step 2</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Behaviour Analysis</h3>
                <p className="text-slate-600">The attacker spends minutes exploring. Legitimate actions, but anomalous patterns begin to emerge when viewed together.</p>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div {...fadeIn} className="relative pl-8 md:pl-0">
            <div className="md:grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 md:text-right mb-6 md:mb-0">
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold mb-2">Step 3</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Banking Transaction</h3>
                <p className="text-slate-600">The attacker modifies a supplier's account and initiates a high-value RTGS transfer.</p>
              </div>
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-sm font-mono text-slate-400 mb-2">Correlation ID: CORR-845921</div>
                <div className="text-4xl font-black text-slate-900 mb-4">£5,000,000 <span className="text-lg font-medium text-slate-500">RTGS</span></div>
                <div className="flex justify-center items-center gap-4 text-sm font-medium">
                  <div className="px-3 py-2 bg-slate-100 rounded-lg text-slate-700">Debit Corp Account</div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-slate-400" />
                  <div className="px-3 py-2 bg-emerald-50 rounded-lg text-emerald-700">Compliance Check</div>
                  <ArrowLeft className="w-4 h-4 rotate-180 text-slate-400" />
                  <div className="px-3 py-2 bg-rose-50 rounded-lg text-rose-700">Credit Mule Account</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 4 & 5 - KavachX Correlates */}
          <motion.div {...fadeIn} className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Zap className="w-64 h-64" />
            </div>
            
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm font-bold mb-4">The KavachX Difference</div>
            <h3 className="text-3xl font-bold mb-6">AI Cyber-Fraud Correlation</h3>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl">
              Instead of six isolated alerts hitting different teams (SIEM, CBS, Fraud), KavachX correlates time, identity, device, and Banking Correlation IDs into <strong>ONE attack narrative</strong>.
            </p>

            <div className="mb-10 relative z-10">
              <FraudGraph3D />
            </div>

            <div className="bg-blue-600 rounded-2xl p-6 border border-blue-500 text-center relative z-10 shadow-[0_0_40px_rgba(37,99,235,0.3)]">
              <div className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2">Generated Narrative Incident #2048</div>
              <div className="text-2xl font-bold text-white mb-2">Corporate Account Takeover</div>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">Confidence: 99%</div>
            </div>
          </motion.div>

          {/* AI Copilot & Forecast */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div {...fadeIn} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Gemini AI Copilot
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-500 font-medium mb-1">Root Cause</div>
                  <div className="font-semibold text-slate-900">Compromised Finance Manager Credentials</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium mb-1">Potential Exposure</div>
                  <div className="font-semibold text-rose-600 text-xl">£5 Million</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium mb-2">Recommended Actions</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs font-bold border border-rose-100">Pause RTGS</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">Disable Session</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold border border-slate-200">Lock Beneficiary</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeIn} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-600" />
                Threat Forecast Engine
              </h3>
              <p className="text-slate-600 text-sm mb-4">Predicting attacker's next moves based on historical APT behaviour:</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Create Additional Beneficiaries</span>
                  <span className="font-bold text-rose-600">90%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{width: '90%'}}></div></div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Attempt Treasury Access</span>
                  <span className="font-bold text-orange-500">82%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-orange-400 h-2 rounded-full" style={{width: '82%'}}></div></div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-900">Customer Data Exfiltration</span>
                  <span className="font-bold text-amber-500">75%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-400 h-2 rounded-full" style={{width: '75%'}}></div></div>
              </div>
            </motion.div>
          </div>

          {/* Outcome */}
          <motion.div {...fadeIn} className="bg-emerald-50 rounded-3xl p-8 md:p-12 border border-emerald-200 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-4">The Outcome</h2>
            <p className="text-emerald-800 text-lg max-w-2xl mx-auto font-medium">
              Because KavachX correlated VPN authentication, device fingerprinting, threat intelligence, and the RTGS transaction...
            </p>
            <div className="mt-8 text-2xl font-black text-emerald-700 bg-white inline-block px-6 py-3 rounded-xl shadow-sm border border-emerald-100">
              The attack was detected before settlement.<br/>
              No funds left the bank.
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
