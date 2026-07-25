import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role: string) => {
    login('mock-token', { email: 'demo@kavachx.ai', role });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Kavach<span className="text-indigo-500">X</span> Demo Portal
          </h1>
          <p className="text-slate-400 text-lg">Select your role to access the platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* L1 Analyst */}
          <div 
            onClick={() => handleLogin('l1_analyst')}
            className="group cursor-pointer bg-slate-800 border border-slate-700 hover:border-indigo-500 p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]"
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">L1 SOC Analyst</h3>
            <p className="text-slate-400 mb-6">Read-only access. View dashboards, query Copilot, and investigate alerts.</p>
            <ul className="text-sm text-slate-500 space-y-2 font-medium">
              <li className="flex items-center gap-2">✅ View Threat Graph</li>
              <li className="flex items-center gap-2">✅ Chat with Copilot</li>
              <li className="flex items-center gap-2">❌ Execute Playbooks (Disabled)</li>
              <li className="flex items-center gap-2">❌ PQC Migration (Disabled)</li>
            </ul>
          </div>

          {/* L3 Lead SOC */}
          <div 
            onClick={() => handleLogin('l3_lead')}
            className="group cursor-pointer bg-slate-800 border border-slate-700 hover:border-red-500 p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1 rounded-bl-xl border-l border-b border-red-500/20">
              GOD MODE
            </div>
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">L3 Lead / CISO</h3>
            <p className="text-slate-400 mb-6">Full execution access. Trigger autonomous defenses and migrate cryptography.</p>
            <ul className="text-sm text-slate-500 space-y-2 font-medium">
              <li className="flex items-center gap-2">✅ View Threat Graph</li>
              <li className="flex items-center gap-2">✅ Chat with Copilot</li>
              <li className="flex items-center gap-2 text-red-400">⚡ Execute Playbooks (Active)</li>
              <li className="flex items-center gap-2 text-indigo-400">⚡ PQC Migration (Active)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
