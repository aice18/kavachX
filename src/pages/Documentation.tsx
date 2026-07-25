import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export default function Documentation() {
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
            <div className="text-sm font-bold text-slate-900 hidden md:block">{t('docs.title', 'KavachX Documentation')}</div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex gap-12">
        <aside className="w-64 hidden lg:block shrink-0">
          <nav className="sticky top-24 space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">{t('docs.getting_started', 'Getting Started')}</h3>
            <a href="#" className="block px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{t('docs.intro', 'Introduction')}</a>
            <a href="#" className="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">{t('docs.quick_start', 'Quick Start')}</a>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 mt-8 px-3">{t('docs.core_concepts', 'Core Concepts')}</h3>
            <a href="#" className="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">{t('docs.arch', 'Architecture')}</a>
            <a href="#" className="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">{t('docs.sec_comp', 'Security & Compliance')}</a>
            <a href="#" className="block px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">{t('docs.api_ref', 'API Reference')}</a>
          </nav>
        </aside>

        <div className="flex-1 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm prose prose-slate max-w-none">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{t('docs.h1', 'Introduction to KavachX')}</h1>
          <p className="text-lg text-slate-600 lead">
            {t('docs.p1', 'KavachX is an AI-native Cyber Resilience Command Center built specifically for modern banking. It bridges the gap between raw telemetry and executive decision making.')}
          </p>
          
          <hr className="my-8 border-slate-200" />
          
          <h2>{t('docs.h2_1', 'The Problem: Alert Overload')}</h2>
          <p>
            {t('docs.p2', 'Modern banks generate millions of security events daily across Core Banking, UPI, APIs, ATMs, Cloud, and more — each operating in isolation. Traditional SIEM and SOAR platforms generate too much noise. KavachX changes that by predicting threats before they happen, prioritizing based on actual business risk, and protecting critical assets automatically.')}
          </p>

          <h2>{t('docs.h2_2', 'Platform Architecture')}</h2>
          <p>
            {t('docs.p3', 'KavachX is built as a modular, AI-native cybersecurity platform where every incoming event is analyzed, correlated, enriched, and transformed into actionable intelligence within milliseconds.')}
          </p>
          <div className="bg-slate-900 p-6 rounded-xl font-mono text-sm text-green-400 overflow-x-auto whitespace-pre">
{`                    External Sources
 ┌─────────────────────────────────────────────────────┐
 │                                                     │
 │  VPN   Firewall   IAM   Endpoint   Database   APIs  │
 │                                                     │
 └─────────────────────────┬───────────────────────────┘
                           │
                           ▼
                 Cyber Telemetry Collector
                           │
                           │
          Banking Transaction Collector
       (UPI • RTGS • NEFT • ATM • CBS Logs)
                           │
                           ▼
              AI Correlation & Risk Engine
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
 Threat Forecast      Gemini AI          PQC Scanner
      │                    │                    │
      └──────────────┬─────┴──────────────┬─────┘
                     ▼
          Executive Decision Dashboard`}
          </div>

          <h2>{t('docs.h2_3', 'Security by Design')}</h2>
          <p>
            {t('docs.p4', 'KavachX follows a Zero Trust architecture and incorporates enterprise-grade security principles across every layer of the platform.')}
          </p>
          <ul>
            <li><strong>{t('docs.li_1', 'Role-Based Access Control:')}</strong> {t('docs.li_1d', 'Granular permissions ensure users only access resources essential for their specific roles.')}</li>
            <li><strong>{t('docs.li_2', 'AES-256 Encryption:')}</strong> {t('docs.li_2d', 'Industry-leading encryption standards protect all data at rest and in transit.')}</li>
            <li><strong>{t('docs.li_3', 'AI Explainability:')}</strong> {t('docs.li_3d', 'Transparency in AI decisions, crucial for compliance and building trust in automated systems.')}</li>
            <li><strong>{t('docs.li_4', 'RBI Compliance:')}</strong> {t('docs.li_4d', 'Built-in support for RBI Cyber Security Framework, NPCI Guidelines, and ISO/IEC 27001.')}</li>
          </ul>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mt-12 flex gap-4">
            <BookOpen className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div>
              <h4 className="m-0 text-blue-900 font-bold">{t('docs.api_h', 'Explore REST API Docs')}</h4>
              <p className="m-0 mt-2 text-sm text-blue-700">{t('docs.api_p', 'Integrate KavachX directly into your existing SOC tools via our secure RESTful API.')}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
