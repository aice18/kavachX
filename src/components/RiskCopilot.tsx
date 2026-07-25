import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, Brain, ShieldAlert, Target, Info, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../AuthContext';

const KAVACH_CONTEXT = `
KavachX is an advanced Predictive Cybersecurity Platform designed to proactively defend against modern threats.
Core modules include:
1. Executive Command Center: High-level overview for C-suite (requires l3_soc role).
2. SOC Console: Real-time security operations, incident tracking, and alerts.
3. Fraud Management: Financial fraud detection, UPI/RTGS anomaly tracking.
4. Threat Forecast (Risk Analysis): Multi-domain alert correlation and generative AI mitigation.
5. Cryptography Assets: Quantum-safe cryptographic inventory and risk assessment.

Key capabilities:
- Predictive threat intelligence.
- Automated playbook execution for incident mitigation.
- Multi-agent AI correlation (e.g., combining Identity, Database, and Transaction alerts into a single incident like INC-9942).
`;

export default function RiskCopilot({ incidentId = "TXN-8842-991", contextData }: { incidentId?: string, contextData?: any }) {
  const { user } = useAuth();
  const isL1 = user?.role === 'l1_analyst';
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: 'Welcome to KavachX Risk Analysis Copilot. I have full context of the platform, including our SOC, Fraud Management, and Cryptography modules. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, contextIncidentId: incidentId })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply || data.error }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + err.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecutePlaybook = async () => {
    setIsExecuting(true);
    setMessages(prev => [...prev, { role: 'user', text: "EXECUTE MITIGATION PLAYBOOK" }]);
    
    try {
      const res = await fetch('/api/copilot/execute-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.message || data.error }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Error: ' + err.message }]);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-indigo-500/30 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none"></div>

      <div className="bg-slate-900/80 p-4 border-b border-white/10 flex justify-between items-center relative z-10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/50">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">KavachX AI Assistant</h3>
            <p className="text-indigo-300/70 text-[10px] uppercase tracking-wider font-bold">Platform Context Active</p>
          </div>
        </div>
        <div className="flex gap-2">
          {incidentId && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
              <Target className="w-3 h-3" />
              {incidentId}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={i} 
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-300" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm shadow-md ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-800/80 backdrop-blur-sm text-slate-200 border border-slate-700/50 rounded-tl-none leading-relaxed'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-indigo-300" />
              </div>
              <div className="p-4 bg-slate-800/80 backdrop-blur-sm rounded-2xl rounded-tl-none border border-slate-700/50 flex items-center gap-3 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> 
                <span>Analyzing platform telemetry...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900/90 border-t border-white/10 relative z-10 backdrop-blur-lg">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
           <button onClick={() => handleSend("What is the KavachX platform?")} className="text-xs shrink-0 bg-slate-800 hover:bg-slate-700 text-indigo-200 px-3 py-1.5 rounded-full border border-slate-700 transition-all hover:border-indigo-500/50 flex items-center gap-1">
             <Info className="w-3 h-3" /> What is KavachX?
           </button>
           <button onClick={() => handleSend("Explain the fraud management capabilities.")} className="text-xs shrink-0 bg-slate-800 hover:bg-slate-700 text-indigo-200 px-3 py-1.5 rounded-full border border-slate-700 transition-all hover:border-indigo-500/50 flex items-center gap-1">
             <Activity className="w-3 h-3" /> Fraud Management
           </button>
           <button onClick={() => handleSend("Tell me about Cryptography Assets and Quantum Risk.")} className="text-xs shrink-0 bg-slate-800 hover:bg-slate-700 text-indigo-200 px-3 py-1.5 rounded-full border border-slate-700 transition-all hover:border-indigo-500/50 flex items-center gap-1">
             <ShieldCheck className="w-3 h-3" /> Cryptography Assets
           </button>
           <button 
              onClick={handleExecutePlaybook}
              disabled={isExecuting || isL1}
              title={isL1 ? "L1 Analysts do not have execution privileges" : "Execute Playbook"}
              className={`text-xs shrink-0 font-bold px-4 py-1.5 rounded-full transition-all ml-auto flex items-center gap-2
                ${isL1 
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-50' 
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                }`}
           >
             <ShieldAlert className="w-3 h-3" />
             {isExecuting ? 'EXECUTING...' : (isL1 ? '🔒 LOCKED (L1)' : 'AUTO-MITIGATE')}
           </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur group-hover:blur-md transition-all opacity-50"></div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the KavachX platform..."
            className="w-full relative bg-slate-900/90 border border-slate-700 rounded-xl py-3.5 pl-4 pr-12 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
      `}</style>
    </div>
  );
}
