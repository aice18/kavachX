import { useEffect, useState } from 'react';
import { fetchQuantumAssets } from '../lib/api';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, ScanLine, Clock, TrendingUp, Lock } from 'lucide-react';

const NIST_STANDARDS: Record<string, { standard: string; urgency: 'critical' | 'high' | 'low' }> = {
  'RSA-2048': { standard: 'FIPS 203/204', urgency: 'critical' },
  'ECC':      { standard: 'FIPS 205',     urgency: 'high'     },
  'AES-256':  { standard: 'FIPS 197',     urgency: 'low'      },
};

const HARVEST_EXPOSURE_INR: Record<string, number> = {
  'RSA-2048': 85000000,
  'ECC':      42000000,
  'AES-256':  0,
};

export function Quantum() {
  const [assets, setAssets] = useState<any[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scannedRows, setScannedRows] = useState<Set<number>>(new Set());
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    fetchQuantumAssets().then(setAssets);
  }, []);

  const runScanner = () => {
    setScanning(true);
    setScanComplete(false);
    setScannedRows(new Set());
    assets.forEach((_, i) => {
      setTimeout(() => {
        setScannedRows(prev => new Set([...prev, i]));
        if (i === assets.length - 1) {
          setScanning(false);
          setScanComplete(true);
        }
      }, (i + 1) * 300);
    });
  };

  const vulnerableCount = assets.filter(a => a.vulnerable).length;
  const score = assets.length ? Math.round(((assets.length - vulnerableCount) / assets.length) * 100) : 100;
  const totalHarvestExposure = assets
    .filter(a => a.vulnerable)
    .reduce((sum, a) => sum + (HARVEST_EXPOSURE_INR[a.algorithm] || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Cryptography Posture</h1>
            <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center">
              <ShieldCheck className="h-4 w-4 mr-2" /> Post-Quantum Cryptography (PQC) Scanner · NIST FIPS 203/204/205
            </p>
          </div>
          <button
            onClick={runScanner}
            disabled={scanning}
            className="flex items-center space-x-2 px-5 py-3 bg-cyan-600/80 hover:bg-cyan-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] disabled:opacity-60"
          >
            <ScanLine className={`h-4 w-4 ${scanning ? 'animate-bounce' : ''}`} />
            <span>{scanning ? 'Scanning...' : scanComplete ? 'Re-Scan Assets' : 'Run PQC Scanner'}</span>
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* PQC Readiness */}
        <div className="bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">PQC Readiness</h2>
            <div className={`p-2 rounded-lg ${score < 50 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-mono tracking-tighter font-bold ${score < 50 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'text-emerald-500'}`}>{score}</span>
            <span className="text-slate-500 font-medium">/ 100</span>
          </div>
          <div className="mt-3 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${score < 50 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]'}`} style={{ width: `${score}%` }} />
          </div>
        </div>

        {/* Vulnerable Systems */}
        <div className="bg-[#020617]/60 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_30px_-5px_rgba(245,158,11,0.1)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Vulnerable Systems</h2>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-mono tracking-tighter text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">{vulnerableCount}</span>
            <span className="text-slate-500 font-medium">/ {assets.length} total</span>
          </div>
          <p className="text-amber-400/60 text-xs mt-3 font-semibold uppercase tracking-wider">At quantum-harvest risk</p>
        </div>

        {/* Harvest-Now-Decrypt-Later Exposure */}
        <div className="bg-[#020617]/60 backdrop-blur-lg border border-red-500/20 rounded-2xl p-6 relative overflow-hidden shadow-[0_4px_30px_-5px_rgba(239,68,68,0.1)] lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">HNDL Exposure Estimate</h2>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <Lock className="h-5 w-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-mono tracking-tighter text-red-400 font-bold drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]">
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalHarvestExposure)}
            </span>
          </div>
          <p className="text-red-400/60 text-xs mt-2 font-semibold uppercase tracking-wider">
            Data encrypted today could be decrypted retroactively when quantum computers mature (~2030)
          </p>
          <div className="mt-3 flex items-center space-x-3 text-[10px] text-amber-400 font-bold uppercase tracking-widest">
            <Clock className="h-3 w-3" />
            <span>Migration deadline: Q4 2025 (RBI advisory)</span>
          </div>
        </div>
      </div>

      {/* Scanner status banner */}
      {scanComplete && (
        <div className="flex items-center space-x-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0" />
          <p className="text-cyan-300 text-sm font-bold">PQC Scan complete — {vulnerableCount} of {assets.length} systems require migration. See recommendations below.</p>
        </div>
      )}

      {/* Asset Table */}
      <div className="bg-[#0d121c] border border-slate-800/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between bg-[#151b2b]/50">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center">
            <Cpu className="h-4 w-4 mr-2 text-indigo-400" /> Cryptographic Asset Inventory
          </h2>
          <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            <TrendingUp className="h-3 w-3" />
            <span>NIST FIPS 203/204/205 aligned</span>
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#151b2b]/80 border-b border-slate-800/60 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
            <tr>
              <th className="px-6 py-4">System ID</th>
              <th className="px-6 py-4">Asset Name</th>
              <th className="px-6 py-4">Current Cipher</th>
              <th className="px-6 py-4">NIST Target</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Recommended Migration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {assets.map((a, i) => {
              const isScanned = scannedRows.has(i);
              const nistInfo = NIST_STANDARDS[a.algorithm];
              return (
                <tr
                  key={i}
                  className={`transition-all duration-500 ${
                    scanning && isScanned
                      ? 'bg-cyan-500/5 border-l-2 border-l-cyan-400'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="px-6 py-4 font-mono text-slate-400 text-xs">{a.system_id}</td>
                  <td className="px-6 py-4 text-white font-medium text-sm">{a.name}</td>
                  <td className="px-6 py-4">
                    <span className={`font-mono text-xs px-2 py-1 rounded border font-bold ${
                      a.algorithm === 'AES-256'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>{a.algorithm}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] text-slate-500 font-mono">{nistInfo?.standard || '—'}</span>
                  </td>
                  <td className="px-6 py-4">
                    {a.vulnerable ? (
                      <div className="flex flex-col space-y-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border bg-red-500/10 text-red-400 border-red-500/30 uppercase tracking-widest shadow-[0_0_8px_rgba(239,68,68,0.2)]">
                          <AlertTriangle className="h-3 w-3 mr-1" /> Vulnerable
                        </span>
                        <span className="text-[9px] text-red-500/70 font-bold uppercase tracking-wider">HNDL Risk • {nistInfo?.urgency === 'critical' ? '🔴' : '🟠'} {nistInfo?.urgency?.toUpperCase()}</span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 uppercase tracking-widest">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> PQC Safe
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs leading-relaxed max-w-xs">{a.recommendation}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
