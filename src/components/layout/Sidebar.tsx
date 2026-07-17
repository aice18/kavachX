import { NavLink } from 'react-router-dom';
import { Shield, Activity, Target, Zap, Server, FlaskConical, Bot, Network } from 'lucide-react';
import { clsx } from 'clsx';
import { useKavachWebSocket } from '../../lib/websocket';

export function Sidebar() {
  const { activeIncidents } = useKavachWebSocket();
  const criticalCount = activeIncidents.filter(i => i.severity === 'critical').length;

  const links = [
    { to: "/dashboard/executive", icon: Shield, label: "Command Center" },
    { to: "/dashboard/soc", icon: Activity, label: "SOC Console", badge: criticalCount },
    { to: "/dashboard/pipeline", icon: Network, label: "Data Pipeline" },
    { to: "/dashboard/forecast", icon: Target, label: "Risk Analytics" },
    { to: "/dashboard/simulator", icon: FlaskConical, label: "What-If Simulator", experimental: true },
    { to: "/dashboard/copilot", icon: Bot, label: "AI Copilot" },
    { to: "/dashboard/quantum", icon: Server, label: "Cryptography Assets" },
  ];

  return (
    <aside className="w-72 border-r border-indigo-500/10 bg-[#020617]/80 backdrop-blur-xl flex flex-col z-20 shadow-[4px_0_24px_-10px_rgba(79,70,229,0.15)] relative">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-50 pointer-events-none" />
      <div className="p-6 flex items-center space-x-3 border-b border-indigo-500/10 relative z-10">
        <div className="h-9 w-9 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-400/30">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-white">Kavach<span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">X</span></span>
          <span className="text-[10px] uppercase tracking-widest text-cyan-500/70 font-medium mt-0.5">Resilience Platform</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 relative z-10">
        <div className="px-3 mb-4 text-[10px] font-bold uppercase tracking-widest text-indigo-400/50">Dashboards</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => clsx(
              "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium relative group overflow-hidden",
              isActive 
                ? "text-cyan-300 bg-indigo-500/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_0_20px_-5px_rgba(34,211,238,0.2)] border border-cyan-500/20" 
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
                <div className="flex items-center space-x-3 z-10 relative">
                  <link.icon className={clsx("h-5 w-5", isActive ? "text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" : "opacity-80 group-hover:text-indigo-400 transition-colors")} />
                  <span className={clsx("tracking-wide", isActive && "font-semibold")}>{link.label}</span>
                  {(link as any).experimental && (
                    <span className="ml-2 text-[8px] uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">Exp</span>
                  )}
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="z-10 relative bg-red-500/20 text-red-400 py-0.5 px-2 rounded-md text-xs font-bold border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse">
                    {link.badge}
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <SidebarUser />
    </aside>
  );
}

function SidebarUser() {
  const raw = sessionStorage.getItem('kavachx_soc_user');
  const user = raw ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : null;
  const name: string = user?.name || 'SOC Analyst';
  const role: string = user?.role || 'Viewer';
  const initials = name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="p-4 border-t border-indigo-500/10 bg-[#020617]/50 relative z-10">
      <div className="flex items-center space-x-3 p-2 rounded-lg border border-transparent hover:border-indigo-500/20 hover:bg-indigo-500/10 transition-colors group">
        <div className="h-9 w-9 rounded-md bg-indigo-950 flex items-center justify-center text-sm font-bold text-indigo-300 border border-indigo-500/30 group-hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 font-medium text-sm truncate group-hover:text-white transition-colors">{name}</p>
          <p className="text-cyan-500/70 text-xs truncate uppercase tracking-wider font-semibold">{role}</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)] shrink-0" title="Online" />
      </div>
    </div>
  );
}
