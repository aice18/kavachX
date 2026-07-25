import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, Sparkles, TerminalSquare, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function AICopilot() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'KavachX AI Copilot initialized. I can explain alerts, suggest containment strategies, or generate compliance reports. How can I assist?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages([{ role: 'ai', content: t('copilot.welcome', 'KavachX AI Copilot initialized. I can explain alerts, suggest containment strategies, or generate compliance reports. How can I assist?') }]);
  }, [t]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    
    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    const languageContext = i18n.language === 'hi' ? 'कृपया हिंदी में उत्तर दें (Reply in Hindi)' : i18n.language === 'mr' ? 'कृपया मराठीत उत्तर द्या (Reply in Marathi)' : '';
    
    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage + (languageContext ? `\n\n${languageContext}` : ''),
          history: messages 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: t('copilot.error', 'An error occurred while communicating with the AI. Please try again.') }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Chat Panel */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full relative"
      >
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shadow-inner">
             <Bot className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 tracking-tight">{t('copilot.title', 'Security Copilot')}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span> {t('copilot.status', 'Online & ready')}
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 relative">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex gap-4 relative z-10 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === 'ai' ? 'bg-white border border-slate-200 text-blue-600' : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white'
                }`}>
                  {msg.role === 'ai' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div className={`px-5 py-3.5 rounded-2xl max-w-[85%] text-sm shadow-sm ${
                  msg.role === 'ai' 
                    ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-none' 
                    : 'bg-slate-900 text-white rounded-tr-none'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {isTyping && (
               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex gap-4 relative z-10"
               >
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm">
                     <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-sm flex items-center gap-1.5">
                     <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.span>
                     <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.span>
                     <motion.span animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.span>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('copilot.placeholder', 'Ask a question or describe an issue...')} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400 shadow-inner"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping} 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>

      {/* Simulator Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden relative group hover:shadow-md transition-shadow"
      >
         <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>
         <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 tracking-tight">
             <div className="p-1 bg-white rounded border border-slate-200 shadow-sm"><TerminalSquare className="w-4 h-4 text-slate-600" /></div>
             {t('copilot.simulator', 'Scenario Simulator')}
           </h3>
         </div>
         <div className="p-6 space-y-8 flex-1 overflow-y-auto relative z-10">
            
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('copilot.target_asset', 'Target Asset')}: <span className="text-slate-700">ATM_143</span></div>
               <div className="bg-red-50 p-5 rounded-xl border border-red-100 shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-semibold text-red-800">{t('copilot.projected_loss', 'Projected Loss Exposure')}</span>
                     <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md border border-red-200 shadow-sm">{t('copilot.critical', 'CRITICAL')}</span>
                  </div>
                  <div className="text-3xl font-bold text-red-700 tracking-tight">₹5,25,02,126</div>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4">
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{t('copilot.blast_radius', 'Blast Radius')}</div>
                  <div className="text-xl font-bold text-slate-900">12,500 <span className="text-sm font-medium text-slate-400">{t('copilot.users', 'users')}</span></div>
               </div>
               <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wide">{t('copilot.est_recovery', 'Est. Recovery')}</div>
                  <div className="text-xl font-bold text-slate-900">12 <span className="text-sm font-medium text-slate-400">{t('copilot.hrs', 'hrs')}</span></div>
               </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t('copilot.recommended_actions', 'Recommended Actions')}</div>
               <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-sm shadow-sm group-hover:border-blue-300 transition-colors">
                     <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                     <span className="font-semibold text-blue-900">{t('copilot.isolate', 'Isolate VLAN 40')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                     <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0"></div>
                     <span className="font-medium text-slate-700">{t('copilot.failover', 'Initiate failover to DR-Site-B')}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
                     <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0"></div>
                     <span className="font-medium text-slate-700">{t('copilot.suspend_routing', 'Suspend internal routing')}</span>
                  </div>
               </div>
            </motion.div>

         </div>
         <div className="p-4 bg-slate-50/50 border-t border-slate-100 shrink-0">
            <button onClick={() => navigate('/what-if')} className="w-full bg-slate-900 text-white py-3.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 flex items-center justify-center gap-2 group/btn">
               {t('copilot.run_sim_btn', 'Run Simulation')}
               <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
         </div>
      </motion.div>

    </div>
  );
}
