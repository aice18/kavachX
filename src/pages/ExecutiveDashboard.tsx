import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldAlert, AlertTriangle, PlayCircle, TrendingUp, ShieldCheck, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, animate } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from 'react-i18next';

const AnimatedNumber = ({ value, formatter }: { value: number, formatter?: (v: number) => string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => {
        setDisplayValue(Math.round(v));
      }
    });
    return () => controls.stop();
  }, [value]);

  return <span>{formatter ? formatter(displayValue) : displayValue}</span>;
};

export default function ExecutiveDashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/metrics/executive`)
      .then(res => res.json())
      .then(setData);
  }, []);

  const exportPDF = () => {
    setIsExporting(true);
    // Simulate generation time for UX
    setTimeout(() => {
      try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const date = new Date().toLocaleDateString();
        
        // Header
        pdf.setFillColor(15, 23, 42); // slate-900
        pdf.rect(0, 0, 210, 40, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(22);
        pdf.text('KavachX Cybersecurity Assessment', 15, 20);
        pdf.setFontSize(12);
        pdf.text(`Executive Summary Report - ${date}`, 15, 30);

        // Current Status
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(16);
        pdf.text('1. Current Risk Posture & Status', 15, 55);
        
        pdf.setFontSize(11);
        pdf.setTextColor(71, 85, 105); // slate-600
        pdf.text(`Cyber Health Index: ${data.healthIndex} / 100 (Requires Attention)`, 15, 65);
        pdf.text(`Value at Risk: INR ${(data.valueAtRisk / 100000).toFixed(2)} Lakhs`, 15, 72);
        pdf.text(`Compliance Stance: ${data.complianceStance}`, 15, 79);
        
        // Observations
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(14);
        pdf.text('Key Observations:', 15, 95);
        pdf.setFontSize(10);
        pdf.setTextColor(71, 85, 105);
        pdf.text('- Elevated network scanning activity detected in the past 24 hours.', 15, 105);
        pdf.text('- Critical exposure linked to unpatched legacy systems in segment VLAN-40.', 15, 112);
        pdf.text('- Multi-factor authentication gaps identified in 12% of administrative accounts.', 15, 119);
        pdf.text(`- False Positives Reduction at ${data.falsePositivesReduction} indicating optimized alerting.`, 15, 126);

        // Suggested Actions
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(16);
        pdf.text('2. Strategic Recommendations & Actions', 15, 145);
        
        pdf.setFontSize(11);
        pdf.setTextColor(185, 28, 28); // red-700
        pdf.text('[Immediate Priority]', 15, 155);
        pdf.setTextColor(71, 85, 105);
        pdf.text('1. Isolate VLAN-40 from the core banking database cluster.', 15, 162);
        pdf.text('2. Enforce FIDO2-based MFA for all remaining administrative accounts.', 15, 169);
        
        pdf.setTextColor(217, 119, 6); // amber-600
        pdf.text('[Medium Term]', 15, 185);
        pdf.setTextColor(71, 85, 105);
        pdf.text('3. Initiate post-quantum cryptography readiness assessment for TLS endpoints.', 15, 192);
        pdf.text('4. Review automated SLA reporting to ensure continuous regulatory alignment.', 15, 199);

        // Footer
        pdf.setFontSize(9);
        pdf.setTextColor(148, 163, 184); // slate-400
        pdf.text('Generated autonomously by KavachX AI', 15, 285);
        pdf.text('Confidential - For Executive Review Only', 135, 285);

        pdf.save(`KavachX_Report_${Date.now()}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsExporting(false);
      }
    }, 800);
  };

  if (!data) return (
    <div className="h-full flex items-center justify-center text-slate-500 text-sm gap-2">
      <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
      Loading metrics...
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-6 p-2 md:p-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0 mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">{t('exec.title', 'Executive Overview')}</h2>
          <p className="text-slate-500 text-sm mt-1">
            {t('exec.subtitle', 'Real-time risk posture and threat correlations.')}
          </p>
        </div>
        <button 
          onClick={exportPDF}
          disabled={isExporting}
          className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-transparent animate-spin"></div>
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isExporting ? t('exec.exporting', 'Generating PDF...') : t('exec.export', 'Export Report')}
        </button>
      </div>

      <div ref={dashboardRef} className="space-y-6 bg-slate-50 p-2 -m-2 rounded-2xl">
        {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{t('exec.health_index', 'Cyber Health Index')}</div>
            <div className="text-4xl font-bold text-slate-900 tracking-tight"><AnimatedNumber value={data.healthIndex} /><span className="text-xl text-slate-400 font-medium">/100</span></div>
          </div>
          <div className="mt-6 relative z-10">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${data.healthIndex}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
              ></motion.div>
            </div>
            <div className="text-xs font-medium text-slate-500 mt-2">{t('exec.requires_attention', 'Requires attention')}</div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10">
             <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{t('exec.value_at_risk', 'Value At Risk')}</div>
             <div className="text-4xl font-bold text-slate-900 tracking-tight">₹<AnimatedNumber value={data.valueAtRisk} formatter={(v) => new Intl.NumberFormat('en-IN').format(v)} /></div>
           </div>
           <div className="text-sm text-red-600 flex items-center gap-1.5 mt-6 font-medium relative z-10 bg-red-50 w-fit px-3 py-1.5 rounded-lg border border-red-100">
             <AlertTriangle className="w-4 h-4" /> {t('exec.critical_exposure', 'Critical exposure detected')}
           </div>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10">
             <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{t('exec.compliance_stance', 'Compliance Stance')}</div>
             <div className="text-2xl font-bold text-red-600 tracking-tight">{data.complianceStance}</div>
           </div>
           <div className="text-sm text-slate-500 mt-6 relative z-10">{t('exec.sla_violation', 'SLA violation risk due to active incidents.')}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-[400px] flex flex-col relative overflow-hidden lg:col-span-2">
          <div className="mb-6 relative z-10">
            <h3 className="text-base font-semibold text-slate-900">{t('exec.risk_posture', 'Risk Posture Trend')}</h3>
            <div className="text-sm text-slate-500">{t('exec.monitoring_24h', '24-hour continuous monitoring.')}</div>
          </div>
          <div className="flex-1 min-h-0 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickMargin={10} domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#ffffff', stroke: '#3b82f6', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attack Vectors Pie Chart */}
        {data.attackVectors && (
          <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-[400px] flex flex-col relative overflow-hidden">
            <div className="mb-2 relative z-10 text-center">
              <h3 className="text-base font-semibold text-slate-900">{t('exec.primary_vectors', 'Primary Attack Vectors')}</h3>
              <div className="text-sm text-slate-500">{t('exec.dist_threats', 'Distribution of threats')}</div>
            </div>
            <div className="flex-1 min-h-0 relative z-10 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.attackVectors}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.attackVectors.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {data.attackVectors.map((v: any, i: number) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5] }}></div>
                  <span className="truncate">{v.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Exposure Trend */}
        {data.financialExposureTrend && (
          <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-[300px] flex flex-col relative overflow-hidden lg:col-span-2">
            <div className="mb-6 relative z-10">
              <h3 className="text-base font-semibold text-slate-900">{t('exec.exposure_trend', 'Financial Exposure Trend')}</h3>
              <div className="text-sm text-slate-500">{t('exec.value_at_risk_7d', 'Value at risk over the last 7 days')}</div>
            </div>
            <div className="flex-1 min-h-0 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.financialExposureTrend} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorExposure" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickMargin={10} 
                    axisLine={false} 
                    tickLine={false} 
                    tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}${t('exec.lakhs', 'L')}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${(value / 100000).toFixed(2)} ${t('exec.lakhs', 'Lakhs')}`, t('exec.exposure', 'Exposure')]}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="exposure" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorExposure)" 
                    strokeWidth={3}
                    activeDot={{ r: 6, fill: '#ffffff', stroke: '#ef4444', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Basic Metrics Column */}
        <div className="flex flex-col gap-4">
          {[
            { label: t('exec.events_hr', 'Events / Hour'), val: data.eventsPerHour, icon: Activity },
            { label: t('exec.latency', 'Latency'), val: data.latency, icon: PlayCircle },
            { label: t('exec.fp_reduction', 'FP Reduction'), val: data.falsePositivesReduction, icon: TrendingUp },
            { label: t('exec.accuracy', 'Accuracy'), val: data.accuracy, icon: ShieldCheck }
          ].map((m, i) => (
            <motion.div key={m.label} variants={item} className="flex-1 bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{m.label}</div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{m.val}</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                 <m.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Predictive Risk Heatmap */}
      {data.predictiveRiskHeatmap && (
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6 relative z-10">
            <h3 className="text-base font-semibold text-slate-900">{t('exec.predictive_heatmap', 'Predictive Risk Heatmap')}</h3>
            <div className="text-sm text-slate-500">{t('exec.ai_forecast', 'AI-forecasted threat probabilities for the next 72 hours.')}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {data.predictiveRiskHeatmap.map((risk: any, i: number) => {
              const getBgColor = (score: number) => {
                if (score >= 75) return 'bg-red-50 border-red-100';
                if (score >= 50) return 'bg-orange-50 border-orange-100';
                if (score >= 25) return 'bg-yellow-50 border-yellow-100';
                return 'bg-emerald-50 border-emerald-100';
              };
              const getTextColor = (score: number) => {
                if (score >= 75) return 'text-red-700';
                if (score >= 50) return 'text-orange-700';
                if (score >= 25) return 'text-yellow-700';
                return 'text-emerald-700';
              };
              
              return (
                <div key={i} className={`p-4 rounded-xl border ${getBgColor(risk.predicted)} flex flex-col justify-between transition-colors`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-semibold text-slate-800">{risk.category}</span>
                    {risk.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-red-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider font-medium opacity-80">{t('exec.predicted_risk', 'Predicted Risk')}</div>
                    <div className={`text-3xl font-bold tracking-tight ${getTextColor(risk.predicted)}`}><AnimatedNumber value={risk.predicted} />%</div>
                    <div className="text-xs text-slate-500 mt-2 font-medium">{t('exec.current', 'Current:')} {risk.current}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      </div>
    </motion.div>
  );
}
