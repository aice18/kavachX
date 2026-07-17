import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, User, PlayCircle, CheckCircle2 } from 'lucide-react';
import { askCopilot } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function Copilot({ incidentId }: { incidentId: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'I have full context on this incident. Ask me anything — blast radius, containment steps, RBI notification obligations, or projected attack vectors.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);
    try {
      const res = await askCopilot(incidentId, question);
      setMessages(prev => [...prev, { role: 'assistant', content: res.answer || 'Unable to generate response.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ AI engine unavailable. Check GEMINI_API_KEY.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0d121c] border border-slate-800/60 rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ height: 360 }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800/60 bg-[#151b2b]/50 flex items-center space-x-3 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <Bot className="h-4 w-4 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">AI Copilot</p>
          <p className="text-[10px] uppercase tracking-widest text-cyan-500/60 font-bold">Gemini AI · Incident Context Loaded</p>
        </div>
        <div className="ml-auto flex items-center space-x-1.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-transparent to-black/10">
        {messages.map((msg, i) => {
          let content = msg.content;
          let actionMatch = null;
          
          if (msg.role === 'assistant') {
            const match = content.match(/\[ACTION:([A-Z_]+)\]/);
            if (match) {
              actionMatch = match[1];
              content = content.replace(match[0], '').trim();
            }
          }

          return (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600/80 border border-indigo-400/50 ml-2' : 'bg-[#0f172a] border border-cyan-500/30 mr-2'}`}>
                  {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-indigo-100" /> : <Bot className="h-3.5 w-3.5 text-cyan-400" />}
                </div>
                <div className="flex flex-col">
                  {content && (
                    <div className={`p-3 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-sm' : 'bg-[#0f172a]/80 border border-slate-700/50 text-slate-300 rounded-tl-sm'}`}>
                      {content}
                    </div>
                  )}
                  {actionMatch && <ActionBlock actionType={actionMatch} />}
                </div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-[#0f172a]/80 border border-slate-700/50">
              <Loader2 className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
              <span className="text-xs text-slate-400">Gemini AI analyzing...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-800/60 shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            placeholder="Ask about this incident..."
            className="w-full bg-[#020617]/80 border border-indigo-500/30 rounded-lg py-2.5 pl-4 pr-10 text-xs text-cyan-50 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function ActionBlock({ actionType }: { actionType: string }) {
  const [state, setState] = useState<'pending' | 'executing' | 'done'>('pending');

  const execute = () => {
    setState('executing');
    setTimeout(() => {
      setState('done');
    }, 2000);
  };

  const getLabel = () => {
    switch (actionType) {
      case 'ISOLATE_IP': return 'Isolate Suspicious IP';
      case 'QUARANTINE_ASSET': return 'Quarantine Affected Asset';
      case 'GENERATE_REPORT': return 'Generate Compliance Report';
      default: return `Execute Action: ${actionType}`;
    }
  };

  return (
    <div className="mt-2 p-3 bg-[#0f172a] border border-slate-700/50 rounded-lg flex items-center justify-between w-full max-w-[280px]">
      <div className="flex flex-col mr-4">
        <span className="text-xs font-semibold text-slate-200">{getLabel()}</span>
        <span className="text-[10px] text-slate-500 font-mono mt-0.5">Automated Playbook Action</span>
      </div>
      {state === 'pending' && (
        <button onClick={execute} className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md text-xs font-bold text-white transition-colors shrink-0">
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Approve</span>
        </button>
      )}
      {state === 'executing' && (
        <div className="flex items-center space-x-1 text-cyan-400 text-xs font-medium px-3 py-1.5 shrink-0">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Executing...</span>
        </div>
      )}
      {state === 'done' && (
        <div className="flex items-center space-x-1 text-emerald-400 text-xs font-medium px-3 py-1.5 bg-emerald-500/10 rounded-md border border-emerald-500/20 shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}

