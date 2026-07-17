import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Lock, Cpu, ArrowRight } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-[#020205] text-slate-200 selection:bg-fuchsia-500/30 overflow-hidden relative">
      {/* Surreal Mesh Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-900/10 via-[#020205]/10 to-transparent" />
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-indigo-600/15 rounded-full blur-[120px] mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] bg-fuchsia-600/10 rounded-full blur-[100px] mix-blend-screen opacity-60 animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] bg-cyan-600/10 rounded-full blur-[140px] mix-blend-screen opacity-50 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="px-6 py-6 lg:px-12 flex justify-between items-center bg-transparent sticky top-0 z-50">
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="relative w-12 h-12 rounded-2xl bg-white/[0.05] backdrop-blur-[40px] flex items-center justify-center border border-white/10 shadow-[8px_0_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-fuchsia-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              <Shield className="w-5 h-5 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter text-white/90">
                Kavach<span className="text-fuchsia-400/90 font-light">X</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-medium">
                Decision Intelligence
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="group relative px-8 py-3 bg-white/[0.05] backdrop-blur-[40px] border border-white/10 rounded-2xl font-bold tracking-[0.2em] text-[10px] uppercase text-white/90 shadow-[8px_0_30px_-10px_rgba(0,0,0,0.5)] hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(217,70,239,0.2)] transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <span className="relative flex items-center gap-3">
              Start Demo <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/10 backdrop-blur-[40px] text-[10px] tracking-[0.2em] uppercase font-bold text-white/50 mb-12 animate-fade-in-up">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-fuchsia-500"></span>
            </span>
            Created by Greybox Labs
          </div>

          <h1 className="text-6xl md:text-8xl font-light tracking-tighter mb-8 max-w-5xl mx-auto leading-tight animate-fade-in-up text-white/90" style={{ animationDelay: '0.1s' }}>
            Next-Generation{' '}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-indigo-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              Security Operations
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white/50 max-w-3xl font-light mx-auto mb-16 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            KavachX is an elite decision intelligence platform built for modern financial institutions. 
            Defend against multi-vector threats, quantum risks, and insider attacks in real-time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <FeatureCard 
              icon={<Activity className="w-6 h-6 text-cyan-400" />}
              title="Real-time SOC"
              description="Unified SIEM & UEBA correlation with predictive risk modeling."
            />
            <FeatureCard 
              icon={<Brain className="w-6 h-6 text-purple-400" />}
              title="AI Copilot"
              description="Automated incident analysis and playbook execution via Gemini."
            />
            <FeatureCard 
              icon={<Lock className="w-6 h-6 text-emerald-400" />}
              title="Quantum Readiness"
              description="Post-quantum cryptography posture and risk tracking."
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-white/30 text-[10px] tracking-[0.2em] uppercase font-light border-t border-white/[0.05] bg-transparent relative z-10">
          <p>© {new Date().getFullYear()} Greybox Labs. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-500 text-left overflow-hidden backdrop-blur-[40px] shadow-[8px_0_30px_-10px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6 border border-white/10 shadow-inner group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
          {icon}
        </div>
        <h3 className="text-xl font-light text-white/90 mb-3">{title}</h3>
        <p className="text-white/50 leading-relaxed font-light text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}

// Re-usable brain icon (not present in lucide import above)
function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}
