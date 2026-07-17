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
    <aside className="w-[280px] bg-[#0B0D11] border-r border-[#1C1F26] flex flex-col z-20 relative">
      <div className="p-8 flex items-center space-x-4 border-b border-[#1C1F26]">
        <div className="h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold tracking-tighter text-white">Kavach<span className="text-blue-500 font-normal">X</span></span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium mt-1">Resilience</span>
        </div>
      </div>
      
      <nav className="flex-1 px-5 py-8 space-y-2 relative z-10">
        <div className="px-3 mb-6 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">Dashboards</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => clsx(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium relative group",
              isActive 
                ? "text-white bg-[#1A1D24]" 
                : "text-white/50 hover:text-white/80 hover:bg-[#1A1D24]"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-500 rounded-r-md" />}
                <div className="flex items-center space-x-3.5 z-10 relative">
                  <link.icon className={clsx("h-4 w-4", isActive ? "text-blue-500" : "text-white/40 group-hover:text-white/80")} />
                  <span className={clsx("tracking-wide", isActive ? "font-medium" : "font-normal")}>{link.label}</span>
                  {(link as any).experimental && (
                     <span className="ml-2 text-[9px] uppercase tracking-widest text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">Exp</span>
                  )}
                </div>
                {link.badge && link.badge > 0 ? (
                  <span className="z-10 relative bg-red-500 text-white py-0.5 px-2.5 rounded-full text-[10px] font-bold">
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
    <div className="p-6 border-t border-[#1C1F26] bg-[#0B0D11]">
      <div className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-[#1A1D24] transition-all duration-200 group cursor-pointer">
        <div className="h-10 w-10 rounded-full bg-[#1C1F26] flex items-center justify-center text-sm font-medium text-white/80 shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white/90 font-medium text-sm truncate group-hover:text-white transition-colors">{name}</p>
          <p className="text-white/50 text-[10px] truncate uppercase tracking-[0.1em] font-normal mt-0.5">{role}</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" title="Online" />
      </div>
    </div>
  );
}
