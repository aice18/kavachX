import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex h-screen bg-[#13151A] text-slate-200 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto relative z-10 scrollbar-hide">
        <div className="mx-auto max-w-7xl p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
