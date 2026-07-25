import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Box, LayoutGrid } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Solutions() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 md:px-10 mb-8">
        <div className="h-14 bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full flex justify-between items-center px-6 py-2">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('docs.back', 'Back to Home')}</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-900 hidden md:block">{t('solutions.title', 'KavachX Solutions')}</div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">{t('solutions.h1', 'Our Solutions')}</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('solutions.sub', 'Discover how KavachX protects your enterprise across various threat landscapes.')}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            { title: t('solutions.s1', 'Executive Command Center'), desc: t('solutions.s1_d', 'Real-time dashboards providing CISOs and board members with organizational cyber health, enterprise risk scores, and financial exposure.'), icon: LayoutGrid },
            { title: t('solutions.s2', 'SOC Console'), desc: t('solutions.s2_d', 'Live event streaming, threat timelines, and AI-prioritized incident queues designed for security analysts to streamline response workflows.'), icon: Box },
            { title: t('solutions.s3', 'AI Correlation Engine'), desc: t('solutions.s3_d', 'Intelligently correlates cybersecurity telemetry with transactional behavior, transforming isolated alerts into a single, explainable attack narrative.'), icon: Box },
            { title: t('solutions.s4', 'Threat Forecast Engine'), desc: t('solutions.s4_d', 'Predicts the attacker\'s next probable action before damage occurs, shifting security from reactive to predictive.'), icon: Box },
            { title: t('solutions.s5', 'Gemini AI Copilot'), desc: t('solutions.s5_d', 'An intelligent cybersecurity assistant that provides incident summaries, blast radius analysis, and containment recommendations using contextual banking intelligence.'), icon: Box },
            { title: t('solutions.s6', 'Quantum Readiness Scanner'), desc: t('solutions.s6_d', 'Continuously evaluates cryptographic assets against emerging quantum threats (NIST FIPS 203, 204, 205) helping organizations prepare for Harvest Now, Decrypt Later attacks.'), icon: Box },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 bg-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden relative shadow-2xl"
        >
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
          <div className="relative z-10 md:w-2/3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-sm mb-6">
              Case Study
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Corporate Account Takeover & High-Value RTGS Fraud
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-xl leading-relaxed">
              Discover how KavachX correlates disparate cyber telemetry with core banking transactions to detect and stop a £5 million fraud attempt in real-time.
            </p>
            <Link 
              to="/use-cases/rtgs-fraud"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Explore Use Case <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
