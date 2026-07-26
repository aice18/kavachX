import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Activity, Box, BrainCircuit, ShieldAlert, KeyRound, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import UseCase from '../components/UseCase';
import ThreatMap from '../components/ThreatMap';
import { useAuth } from '../AuthContext';

export default function Landing() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleStartDemo = () => {
    // Log the user in as a demo user
    login('demo-token-123', { email: 'demo@kavachx.com', role: 'admin' });
    // Navigate straight to the fraud dashboard where the demo begins
    navigate('/dashboard/fraud');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
    mouseX.set(x);
    mouseY.set(y);
  };

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [15, -15]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 150, damping: 20 });

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900 overflow-hidden" onMouseMove={handleMouseMove}>
      
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-4 left-4 right-4 md:left-10 md:right-10 z-50 max-w-7xl mx-auto"
      >
        <div className="h-14 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full flex justify-between items-center px-6 py-2">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-8 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo.png" alt="KavachX Logo" className="h-full object-contain" />
              </div>
            </Link>
            <nav className="hidden md:flex gap-8 ml-4">
              <a className="text-sm font-medium text-slate-900" href="#">{t('landing.nav_product', 'Product')}</a>
              <Link className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" to="/solutions">{t('landing.nav_solutions', 'Solutions')}</Link>
              <Link className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors" to="/docs">{t('landing.nav_docs', 'Documentation')}</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              {t('landing.launch_nav', 'Launch Platform')}
            </Link>
          </div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="relative px-6 md:px-10 pt-32 pb-32 max-w-7xl mx-auto overflow-visible">
          {/* Animated Background Gradients & 3D Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none -z-20"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 1.5 }, rotate: { duration: 150, repeat: Infinity, ease: "linear" } }}
            className="absolute top-10 right-0 lg:right-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none -z-10"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: -360 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 1.5 }, rotate: { duration: 120, repeat: Infinity, ease: "linear" } }}
            className="absolute top-40 left-0 lg:left-10 w-[400px] h-[400px] bg-gradient-to-bl from-indigo-400/20 to-teal-400/20 rounded-full blur-3xl pointer-events-none -z-10"
          ></motion.div>

          {/* Surreal Floating Orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(31,38,135,0.1)] -z-10 hidden md:block"
            style={{ boxShadow: "inset 0 0 20px rgba(255,255,255,0.5), 0 20px 40px rgba(0,0,0,0.1)" }}
          />

          <motion.div
            animate={{ y: [0, 40, 0], rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-64 left-[10%] w-24 h-24 rounded-full bg-gradient-to-tr from-blue-200/30 to-indigo-300/30 backdrop-blur-md border border-white/50 -z-10 hidden md:block"
            style={{ boxShadow: "inset 0 0 15px rgba(255,255,255,0.6), 0 15px 30px rgba(0,0,0,0.08)" }}
          />
          
          <motion.div
            animate={{ y: [0, -20, 0], x: [0, 20, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-10 right-[25%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/40 backdrop-blur-lg border border-white/60 -z-10 hidden md:block"
            style={{ boxShadow: "inset 0 0 10px rgba(255,255,255,0.8), 0 10px 20px rgba(0,0,0,0.05)" }}
          />

          <div className="text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full mb-8 shadow-sm hover:bg-white/80 transition-colors cursor-default"
            >
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.8)]"></span>
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">{t('landing.enterprise_shield', 'Enterprise Shield Live')}</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl md:text-8xl font-extrabold text-slate-900 tracking-tighter mb-8 max-w-5xl mx-auto leading-[1.05]"
            >
              {t('landing.hero1', 'Cyber resilience')} <br className="hidden md:block"/>
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  {t('landing.hero2', 'for modern banking.')}
                </span>
                <motion.span 
                  animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-2xl -z-10"
                ></motion.span>
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
            >
              {t('landing.desc', 'Unify cybersecurity telemetry and financial transaction data. Detect threats, forecast risk, and manage incidents in a single, powerful command center.')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5"
            >
              <button 
                onClick={handleStartDemo}
                className="relative group bg-slate-900 text-white px-8 py-4 rounded-2xl font-medium flex items-center gap-2 transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.7)] hover:-translate-y-1 w-full sm:w-auto justify-center overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  Start Live Demo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <Link to="/login" className="bg-white/80 backdrop-blur-md text-slate-800 border border-slate-200 px-8 py-4 rounded-2xl font-medium hover:bg-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto flex justify-center">
                Analyst Login
              </Link>
            </motion.div>
          </div>
        </section>

        {/* 3D-ish Dashboard Mockup */}
        <section className="px-6 md:px-10 pb-24 max-w-6xl mx-auto perspective-1000 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.3 }}
            className="relative"
            style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
          >
            {/* Ambient Shadow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-[2rem] blur-3xl opacity-50 pointer-events-none transform -translate-z-10"></div>
            
            <div className="relative bg-white/60 backdrop-blur-2xl p-2 rounded-2xl border border-white/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-slate-900/5 transform-gpu">
               <div className="bg-slate-50/60 backdrop-blur-sm border border-slate-100/50 rounded-xl overflow-hidden shadow-inner">
                  <div className="h-12 border-b border-slate-200/40 flex items-center px-4 gap-2 bg-white/40">
                     <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm border border-red-500/20"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-400 shadow-sm border border-amber-500/20"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400 shadow-sm border border-green-500/20"></div>
                  </div>
                  <div className="p-8 grid grid-cols-3 gap-6">
                     {[
                       { title: t('landing.box1_title', 'Global Threat Level'), value: t('landing.box1_value', 'Elevated'), color: 'text-amber-500', bg: 'bg-amber-100' },
                       { title: t('landing.box2_title', 'Active Incidents'), value: '12', color: 'text-red-500', bg: 'bg-red-100' },
                       { title: t('landing.box3_title', 'Value at Risk'), value: '₹1.2M', color: 'text-slate-900', bg: 'bg-slate-100' }
                     ].map((box, i) => (
                       <motion.div 
                         key={i}
                         initial={{ opacity: 0, y: 20 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true }}
                         transition={{ delay: 0.6 + (i * 0.1) }}
                         className="h-32 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-sm p-4 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-shadow"
                       >
                          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{box.title}</div>
                          <div className={`text-2xl font-bold tracking-tight ${box.color}`}>{box.value}</div>
                          <div className={`absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tl from-slate-100/50 to-transparent rounded-tl-full -mr-12 -mb-12 group-hover:scale-125 transition-transform duration-500 ${box.bg}`}></div>
                       </motion.div>
                     ))}
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1 }}
                        className="col-span-3 h-80 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-sm p-6 relative overflow-hidden flex flex-col"
                     >
                        <div className="flex justify-between items-center mb-2 relative z-20">
                           <div>
                             <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{t('landing.live_telemetry', 'Live Telemetry')}</div>
                             <div className="text-xl font-bold text-slate-900 tracking-tight">{t('landing.global_threat_topography', 'Global Threat Topography')}</div>
                           </div>
                           <div className="flex gap-2">
                             <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                {t('landing.real_time', 'Real-time')}
                             </div>
                           </div>
                        </div>
                        
                        <div className="flex-1 w-full relative z-10 -mx-6 -mb-6 mt-4">
                           <ThreatMap />
                        </div>
                     </motion.div>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Use Case */}
        <UseCase />

        {/* Features */}
        <section className="px-6 md:px-10 py-32 bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center max-w-2xl mx-auto">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-slate-900 mb-6 tracking-tight"
              >
                {t('landing.features_title', 'Everything you need to secure your infrastructure.')}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-slate-600 text-lg"
              >
                {t('landing.features_desc', 'A unified platform bridging the gap between security telemetry and financial integrity.')}
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Activity, title: t('landing.f1_title', 'AI Correlation'), desc: t('landing.f1_desc', 'Correlate raw network logs with transactional anomalies in real-time.') },
                { icon: ShieldAlert, title: t('landing.f2_title', 'Threat Forecast'), desc: t('landing.f2_desc', 'Predictive modeling using historical attack patterns and global threat intelligence.') },
                { icon: BrainCircuit, title: t('landing.f3_title', 'Explainable AI'), desc: t('landing.f3_desc', 'Understand the "Why" behind every alert with deep-contextual LLM summaries.') },
                { icon: Box, title: t('landing.f4_title', 'Digital Twin'), desc: t('landing.f4_desc', 'Simulate attack scenarios on a virtual replica of your infrastructure.') },
                { icon: KeyRound, title: t('landing.f5_title', 'Quantum Readiness'), desc: t('landing.f5_desc', 'Future-proof data with Post-Quantum Cryptography (PQC) assessment.') },
                { icon: Server, title: t('landing.f6_title', 'Executive Intelligence'), desc: t('landing.f6_desc', 'High-level risk heatmaps and compliance posture for C-suite decision makers.') },
              ].map((feat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-100 transition-colors group hover:shadow-xl hover:shadow-blue-500/5 relative overflow-hidden"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center mb-6 group-hover:border-blue-200 group-hover:text-blue-600 transition-colors">
                      <feat.icon className="w-6 h-6 text-slate-700 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feat.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/50 rounded-full blur-3xl pointer-events-none -z-10 -mt-[200px]"></div>
        <div className="px-6 md:px-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="KavachX Logo" className="h-6 object-contain" />
          </div>
          <p className="text-sm text-slate-500">{t('landing.footer_copy', '© 2026 GreyBox Labs. All rights reserved.')}</p>
        </div>
      </footer>
    </div>
  );
}

