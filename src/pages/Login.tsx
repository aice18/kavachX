import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@kavachx.bank');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.PROD ? 'https://kavachx-6wm9.onrender.com' : ''}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, { email, role: 'admin' });
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-3xl"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-white relative z-10"
      >
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-48 h-12 mb-3 flex items-center justify-center overflow-hidden shrink-0">
               <img src="/logo.png" alt="KavachX Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest leading-none mt-1.5">{t('sidebar.subtitle', 'Predict. Prioritize. Protect.')}</span>
          </div>
          <p className="text-slate-500 text-sm">{t('login.subtitle', 'Sign in to Command Center')}</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            className="bg-red-50 text-red-700 p-3 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 block shrink-0"></span>
            {error}
          </motion.div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1.5">{t('login.email', 'Work Email')}</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              placeholder="admin@kavachx.com"
              required
            />
          </div>
          <div>
            <label className="block text-slate-700 text-sm font-semibold mb-1.5">{t('login.password', 'Password')}</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div> {t('login.signing_in', 'Signing in...')}</>
            ) : (
              t('login.submit', 'Sign In')
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-slate-400 text-xs bg-slate-50 py-2 rounded-lg border border-slate-100">
            {t('login.demo_mode', 'Demo login: admin@kavachx.bank / password123')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
