import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-[#030712] text-slate-300 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      {/* Immersive Cyber Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#030712]/5 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015] mix-blend-overlay" />
      </div>

      <Sidebar />
      <main className="flex-1 overflow-auto relative z-10 scrollbar-hide">
        <div className="mx-auto max-w-7xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
