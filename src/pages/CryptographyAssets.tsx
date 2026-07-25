import React, { useState, useEffect } from 'react';
import { Server, ShieldCheck, AlertCircle, Fingerprint, Lock, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useAuth } from '../AuthContext';

const GaugeChart = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1000;
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setAnimatedScore(Math.floor(start + (end - start) * easeOutQuart));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [score]);

  const data = [
    { name: 'Score', value: animatedScore },
    { name: 'Remaining', value: 100 - animatedScore }
  ];

  let scoreColor = '#10b981'; // emerald-500
  if (animatedScore < 50) scoreColor = '#ef4444'; // red-500
  else if (animatedScore < 80) scoreColor = '#f59e0b'; // amber-500

  return (
    <div className="relative w-48 h-28 flex items-end justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius={65}
            outerRadius={85}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={scoreColor} />
            <Cell fill="#f1f5f9" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 right-0 text-center flex flex-col items-center">
        <span className="text-3xl font-black" style={{ color: scoreColor }}>{animatedScore}</span>
      </div>
    </div>
  );
};

export default function CryptographyAssets() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isL1 = user?.role === 'l1_analyst';
  
  // Dynamic State for PQC Migration
  const [overallScore, setOverallScore] = useState(82);
  const [hndlExposure, setHndlExposure] = useState(45.2);
  const [isMigratingApi, setIsMigratingApi] = useState(false);
  const [assets, setAssets] = useState([
    { id: 'api', name: t('crypto.a1_name', 'Core Banking API Gateway'), algo: 'RSA', size: '2048-bit', target: 'ML-KEM-768', status: t('crypto.at_risk', 'At Risk') },
    { id: 'mobile', name: t('crypto.a2_name', 'Mobile App Authentication'), algo: 'ECDSA', size: 'P-256', target: 'ML-DSA-65', status: t('crypto.migrating', 'Migrating') },
    { id: 'swift', name: t('crypto.a3_name', 'Interbank SWIFT Node'), algo: t('crypto.a3_algo', 'Hybrid (RSA + Kyber)'), size: 'Various', target: 'FIPS 203', status: t('crypto.ready', 'Ready') },
    { id: 'vault', name: t('crypto.a4_name', 'Customer Document Vault'), algo: 'AES-GCM', size: '256-bit', target: t('crypto.a4_target', 'Quantum Safe'), status: t('crypto.ready', 'Ready') },
  ]);

  const handleMigrate = () => {
    setIsMigratingApi(true);
    
    // Simulate migration pipeline
    setTimeout(() => {
      setAssets(prev => prev.map(a => 
        a.id === 'api' ? { ...a, algo: 'Hybrid (RSA + ML-KEM)', status: 'Migrating' } : a
      ));
    }, 1500);

    setTimeout(() => {
      setAssets(prev => prev.map(a => 
        a.id === 'api' ? { ...a, status: 'Ready' } : a
      ));
      setOverallScore(95);
      setHndlExposure(12.4);
      setIsMigratingApi(false);
    }, 4000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{t('crypto.title', 'Quantum Readiness Scanner')}</h1>
          <p className="text-slate-500 mt-1">{t('crypto.subtitle', 'Continuous assessment of cryptographic assets against post-quantum threats.')}</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2 text-center">{t('crypto.overall_score', 'Overall Score')}</span>
            <GaugeChart score={overallScore} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
            {t('crypto.fips_compliance', 'NIST FIPS Compliance Status')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'FIPS 203', name: t('crypto.ml_kem', 'ML-KEM'), desc: t('crypto.ml_kem_desc', 'Key Encapsulation'), status: t('crypto.compliant', 'Compliant'), color: 'emerald' },
              { id: 'FIPS 204', name: t('crypto.ml_dsa', 'ML-DSA'), desc: t('crypto.ml_dsa_desc', 'Digital Signatures'), status: t('crypto.partial', 'Partial'), color: 'amber' },
              { id: 'FIPS 205', name: t('crypto.slh_dsa', 'SLH-DSA'), desc: t('crypto.slh_dsa_desc', 'Stateless Signatures'), status: t('crypto.at_risk', 'At Risk'), color: 'red' },
            ].map((std) => (
              <div key={std.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-900">{std.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded bg-${std.color}-100 text-${std.color}-700 uppercase tracking-wider`}>
                    {std.status}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-700">{std.name}</div>
                <div className="text-xs text-slate-500">{std.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              {t('crypto.hndl_exposure', 'HNDL Exposure')}
            </h3>
            <p className="text-sm text-slate-300 opacity-90 mb-4">
              {t('crypto.hndl_desc', 'Estimated financial exposure to "Harvest Now, Decrypt Later" attacks on recorded TLS traffic.')}
            </p>
          </div>
          <div>
            <div className="text-3xl font-black mb-1">₹{hndlExposure.toFixed(1)} Lakh</div>
            <div className="text-sm text-emerald-400 font-medium">
              {overallScore === 95 ? 'Reduced by 92% after ML-KEM migration' : 'Reduced by 85% since Q2 migration'}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-500" />
            {t('crypto.inventory', 'Active Cryptographic Inventory')}
          </h3>
          <button 
            title="Scans all active cryptographic assets for Post-Quantum Cryptography vulnerabilities and readiness."
            className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors cursor-help">
            {t('crypto.run_scan', 'PQC Scan')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">{t('crypto.th_asset', 'Asset / System')}</th>
                <th className="px-6 py-4">{t('crypto.th_algo', 'Current Algorithm')}</th>
                <th className="px-6 py-4">{t('crypto.th_size', 'Key Size')}</th>
                <th className="px-6 py-4">{t('crypto.th_target', 'Target (PQC)')}</th>
                <th className="px-6 py-4">{t('crypto.th_readiness', 'Readiness')}</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assets.map((asset, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{asset.name}</td>
                  <td className="px-6 py-4 text-slate-600">
                    <span className={asset.id === 'api' && isMigratingApi ? 'animate-pulse text-indigo-600 font-bold' : ''}>
                      {asset.algo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{asset.size}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{asset.target}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${asset.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 
                        asset.status === 'Migrating' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {asset.status === 'Ready' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {asset.status === 'Migrating' && <TrendingUp className="w-3.5 h-3.5" />}
                      {asset.status === 'At Risk' && <AlertCircle className="w-3.5 h-3.5" />}
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {asset.id === 'api' && asset.status === 'At Risk' && (
                      <button 
                        onClick={handleMigrate}
                        disabled={isMigratingApi || isL1}
                        title={isL1 ? "L1 Analysts do not have migration privileges" : "Migrate to ML-KEM"}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm
                          ${isL1 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50'
                          }`}
                      >
                        {isMigratingApi ? 'Migrating...' : (isL1 ? '🔒 Locked (L1)' : 'Migrate to ML-KEM')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
