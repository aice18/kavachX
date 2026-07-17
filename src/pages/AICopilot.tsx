import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Activity, AlertTriangle, GitPullRequest, Loader2, Brain, ChevronDown, PlayCircle, CheckCircle2 } from 'lucide-react';
import { askCopilot } from '../lib/api';
import { useKavachWebSocket } from '../lib/websocket';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const SUGGESTED_PROMPTS = [
  { label: 'Blast Radius', icon: GitPullRequest, color: 'indigo', text: 'What is the full blast radius of the active incident on EMP_8492? Which systems are reachable from this entity?' },
  { label: 'RTGS Risk',  icon: AlertTriangle, color: 'amber',  text: 'Explain the RTGS transfer risk in the current incident. What RBI guidelines apply and what is the containment window?' },
  { label: 'Correlation', icon: Activity,     color: 'cyan',   text: 'Correlate the VPN anomaly with the database export. Is this a coordinated insider attack or opportunistic?' },
  { label: 'PQC Risk',   icon: Brain,         color: 'purple', text: 'Which of our cryptographic assets are most vulnerable to Harvest-Now-Decrypt-Later attacks and what is the migration priority?' },
];

export function AICopilot() {
  const { activeIncidents } = useKavachWebSocket();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'I am the KavachX Decision Intelligence Copilot — powered by Gemini AI with full access to your live incident data, entity graph, and threat forecasts.\n\nI can help you with threat investigation, blast radius analysis, RBI compliance guidance, and post-quantum cryptography risk assessment.\n\nSelect an active incident from the dropdown to give me context, then ask anything.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-select first active incident
  useEffect(() => {
    if (activeIncidents.length > 0 && !selectedIncidentId) {
      setSelectedIncidentId(activeIncidents[0].incident_id);
    }
  }, [activeIncidents]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await askCopilot(selectedIncidentId, question);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer || 'I was unable to generate a response. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ AI engine temporarily unavailable. Check your GEMINI_API_KEY configuration.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIncident = activeIncidents.find(i => i.incident_id === selectedIncidentId);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-in fade-in duration-500 relative z-10">
      <header className="mb-4 relative z-10 shrink-0">
        <h1 className="text-4xl font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Decision Intelligence Copilot</h1>
        <p className="text-cyan-500/70 mt-2 text-sm uppercase tracking-widest font-semibold flex items-center">
          <Bot className="h-4 w-4 mr-2" /> Powered by Gemini AI · Context-aware SOC analyst
        </p>
      </header>

      {/* Incident Context Selector */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center space-x-3 bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-xl p-4">
          <div className="h-8 w-8 bg-indigo-500/20 border border-indigo-500/30 rounded-lg flex items-center justify-center shrink-0">
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Active Incident Context</p>
            {activeIncidents.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium">No active incidents — copilot will use general domain knowledge</p>
            ) : (
              <div className="relative">
                <select
                  value={selectedIncidentId || ''}
                  onChange={e => setSelectedIncidentId(e.target.value || null)}
                  className="w-full bg-[#0f172a] border border-indigo-500/30 rounded-lg px-3 py-2 text-cyan-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none pr-8"
                >
                  <option value="">No incident context (general query)</option>
                  {activeIncidents.map((inc: any) => (
                    <option key={inc.incident_id} value={inc.incident_id}>
                      [{inc.severity.toUpperCase()}] {inc.entity_id} — Risk Score: {inc.risk_score}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
              </div>
            )}
          </div>
          {selectedIncident && (
            <div className="shrink-0 hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-red-400/70 font-bold">Risk Score</span>
              <span className="text-2xl font-mono text-red-400 font-bold drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">{selectedIncident.risk_score}</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-[#020617]/60 backdrop-blur-lg border border-indigo-500/20 rounded-2xl flex flex-col shadow-[0_4px_30px_-5px_rgba(79,70,229,0.15)] relative overflow-hidden min-h-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#020617]/0 to-transparent pointer-events-none" />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 relative z-10">
          {messages.map((msg) => {
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
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-lg ${
                    msg.role === 'user'
                      ? 'bg-indigo-600/80 border border-indigo-400/50 shadow-[0_0_15px_rgba(79,70,229,0.3)] ml-3'
                      : 'bg-[#0f172a] border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)] mr-3'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="h-4 w-4 text-indigo-100" />
                      : <Bot className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
                    }
                  </div>
                  <div className="flex flex-col">
                    {content && (
                      <div className={`p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-sm'
                          : 'bg-[#0f172a]/90 border border-slate-700/50 text-slate-300 rounded-tl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed tracking-wide whitespace-pre-wrap">{content}</p>
                        <div className={`text-[10px] mt-2 font-mono uppercase tracking-wider ${msg.role === 'user' ? 'text-indigo-400/70 text-right' : 'text-slate-600'}`}>
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                    {actionMatch && <ActionBlock actionType={actionMatch} />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[85%]">
                <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-[#0f172a] border border-cyan-500/30 flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Bot className="h-4 w-4 text-cyan-400 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-[#0f172a]/90 border border-slate-700/50 rounded-tl-sm flex items-center space-x-3">
                  <Loader2 className="h-4 w-4 text-cyan-400 animate-spin" />
                  <span className="text-slate-400 text-sm font-medium">Gemini AI analyzing incident context...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-6 pb-2 pt-3 relative z-10 border-t border-indigo-500/10">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map(({ label, icon: Icon, color, text }) => (
              <button
                key={label}
                onClick={() => setInput(text)}
                className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center border ${
                  color === 'indigo' ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                  : color === 'amber' ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : color === 'purple' ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                }`}
              >
                <Icon className="w-3 h-3 mr-1.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-5 pt-3 relative z-10">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask about threat forecasts, graph correlations, RBI compliance, PQC migration..."
              className="w-full bg-[#020617]/80 border border-indigo-500/30 rounded-xl py-4 pl-5 pr-14 text-sm text-cyan-50 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all shadow-inner group-hover:border-indigo-400/50 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(79,70,229,0.4)]"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
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
    <div className="mt-3 p-4 bg-[#0f172a] border border-slate-700/50 rounded-xl flex items-center justify-between w-full max-w-sm shadow-lg shadow-black/20">
      <div className="flex flex-col mr-4">
        <span className="text-sm font-semibold text-slate-200">{getLabel()}</span>
        <span className="text-[10px] text-slate-500 font-mono mt-1">Automated Playbook Action</span>
      </div>
      {state === 'pending' && (
        <button onClick={execute} className="flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold text-white transition-colors shrink-0 shadow-md shadow-indigo-500/20">
          <PlayCircle className="w-4 h-4" />
          <span>Approve</span>
        </button>
      )}
      {state === 'executing' && (
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-medium px-4 py-2 shrink-0">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Executing...</span>
        </div>
      )}
      {state === 'done' && (
        <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-medium px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed</span>
        </div>
      )}
    </div>
  );
}
