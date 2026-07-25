import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { LayoutDashboard, ShieldAlert, Bot, LogOut, Settings, Bell, Menu, Target, FlaskConical, Server, Activity } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useTranslation } from 'react-i18next';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: t('sidebar.executive', 'Executive Overview'), icon: LayoutDashboard, path: '/dashboard/executive' },
    { name: t('sidebar.soc', 'SOC Console'), icon: ShieldAlert, path: '/dashboard/soc' },
    { name: t('sidebar.copilot', 'AI Copilot'), icon: Bot, path: '/dashboard/copilot' },
    { name: t('sidebar.pipeline', 'Data Pipeline'), icon: Activity, path: '/dashboard/pipeline-demo', badge: 'DEMO' },
    { name: t('sidebar.risk', 'Risk Analytics'), icon: Target, path: '/dashboard/risk' },
    { name: t('sidebar.whatif', 'What-If Simulator'), icon: FlaskConical, path: '/dashboard/what-if', badge: 'EXP' },
    { name: t('sidebar.crypto', 'Cryptography Assets'), icon: Server, path: '/dashboard/crypto' },
  ];

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 shrink-0 whitespace-nowrap overflow-hidden relative"
      >
        <div className="h-16 border-b border-slate-100 flex items-center px-4 gap-3">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center overflow-hidden">
            <img src="/logo.png" alt="KavachX Logo" className="w-full h-full object-contain" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase">KavachX</h1>
                <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">{t('sidebar.subtitle', 'Predict. Prioritize. Protect.')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              title={!isSidebarOpen ? item.name : undefined}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 shadow-sm shadow-blue-100' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${!isSidebarOpen ? 'justify-center' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="overflow-hidden flex items-center gap-2"
                      >
                        {item.name}
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-blue-600 bg-blue-100 border border-blue-200 rounded shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className={`flex items-center gap-3 px-3 py-2 mb-2 bg-white rounded-lg border border-slate-200 shadow-sm ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-semibold text-blue-700 shadow-inner shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <div className="text-sm font-medium text-slate-900 truncate">{user?.email || 'admin@kavachx.com'}</div>
                <div className="text-xs text-slate-500 truncate">{t('sidebar.ciso_view', 'CISO View')}</div>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            title={!isSidebarOpen ? t('sidebar.signout', 'Sign Out') : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 ${!isSidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">{t('sidebar.signout', 'Sign Out')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <header className="sticky top-4 z-50 mx-4 md:mx-6 lg:mx-8 mb-4">
          <div className="h-14 border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-full transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <LanguageSwitcher />
              <button className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/60">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white/60"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors rounded-full hover:bg-white/60">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
