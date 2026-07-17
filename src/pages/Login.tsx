import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, User, KeyRound, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { login } from '../lib/auth';

const DEMO_CREDENTIALS = [
  { id: 'ADMIN_CISO_01', pass: 'kavachx2024', label: 'CISO Admin' },
  { id: 'SOC_ANALYST_01', pass: 'analyst2024', label: 'SOC Analyst' },
  { id: 'demo', pass: 'demo', label: 'Demo Access' },
];

export function Login() {
  const navigate = useNavigate();
  const [socId, setSocId] = useState('ADMIN_CISO_01');
  const [passphrase, setPassphrase] = useState('kavachx2024');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mfaStep, setMfaStep] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Simulate network latency
    setTimeout(() => {
      const result = login(socId.trim(), passphrase);
      if (result.success) {
        setMfaStep(true);
        // Short MFA simulation, then navigate
        setTimeout(() => navigate('/dashboard/executive'), 1200);
      } else {
        setError(result.error || 'Authentication failed.');
        setLoading(false);
      }
    }, 900);
  };

  const fillDemo = (id: string, pass: string) => {
    setSocId(id);
    setPassphrase(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#06090e] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/15 via-[#06090e]/0 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#06090e]/0 to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6 border border-indigo-400/30 relative">
            <div className="absolute inset-0 rounded-2xl bg-indigo-400/20 animate-pulse" />
            <Zap className="h-8 w-8 text-white relative z-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            Kavach<span className="text-indigo-400">X</span>
          </h1>
          <p className="text-slate-400 mt-2 font-medium tracking-wide text-sm uppercase text-center leading-relaxed">
            AI-Powered Cyber Threat Correlation<br />
            <span className="text-cyan-500/70">Banking Resilience Platform</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0b0f19]/90 backdrop-blur-md border border-slate-800/60 rounded-2xl p-8 shadow-2xl shadow-black/50">

          {mfaStep ? (
            <div className="flex flex-col items-center py-8 animate-in fade-in duration-300">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <p className="text-white font-bold text-lg tracking-wide">Identity Verified</p>
              <p className="text-emerald-400/80 text-sm mt-2 font-medium tracking-widest uppercase">Zero Trust MFA Passed</p>
              <div className="flex space-x-1 mt-6">
                {[0, 1, 2].map(i => (
                  <div key={i} className="h-1.5 w-8 bg-emerald-500 rounded-full" style={{ opacity: 1 - i * 0.3 }} />
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Error banner */}
              {error && (
                <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* SOC ID */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">SOC ID / Employee ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    required
                    value={socId}
                    onChange={e => setSocId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#151b2b]/70 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all font-mono text-sm"
                    placeholder="e.g. ADMIN_CISO_01"
                  />
                </div>
              </div>

              {/* Passphrase */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Secure Passphrase</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    required
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl bg-[#151b2b]/70 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 transition-all tracking-widest text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-indigo-500/50 rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-indigo-500/30 hover:shadow-xl mt-2"
              >
                {loading ? (
                  <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Authenticating via Zero Trust...</>
                ) : (
                  <><Lock className="h-4 w-4 mr-2" /> Secure SOC Login</>
                )}
              </button>
            </form>
          )}

          {/* Demo credentials */}
          {!mfaStep && (
            <div className="mt-6 pt-5 border-t border-slate-800/60">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 text-center">Quick Demo Access</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {DEMO_CREDENTIALS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => fillDemo(c.id, c.pass)}
                    className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600 flex items-center justify-center font-medium">
            <Shield className="h-4 w-4 mr-1.5 text-emerald-600/50" />
            Protected by KavachX Quantum-Safe Zero Trust Enclave
          </p>
        </div>
      </div>
    </div>
  );
}
