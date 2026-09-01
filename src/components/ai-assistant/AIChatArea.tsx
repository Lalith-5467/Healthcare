import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Bookmark,
  AlertTriangle,
  Mic,
  Paperclip,
  Settings,
  History,
  Bot,
  Sparkles,
  Check
} from 'lucide-react';
import type { ChatMessage } from './aiAssistantData';

interface AIChatAreaProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (query: string) => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenDoctorPrep: () => void;
  onOpenTermExplainer: () => void;
  onCopyMessage: (text: string) => void;
  onSaveToNotes: (msg: ChatMessage) => void;
  onFeedback: (msgId: string, isHelpful: boolean) => void;
  onRegenerate: () => void;
  onNavigateSOS: () => void;
  onNavigateHospitals: () => void;
}

export const AIChatArea: React.FC<AIChatAreaProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onOpenHistory,
  onOpenSettings,
  onOpenDoctorPrep,
  onOpenTermExplainer,
  onCopyMessage,
  onSaveToNotes,
  onFeedback,
  onRegenerate,
  onNavigateSOS,
  onNavigateHospitals,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl h-[650px] flex flex-col justify-between shadow-xl relative overflow-hidden text-xs font-sans text-slate-900 dark:text-white">
      
      {/* CHAT HEADER BAR */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <span>AI Health Companion</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            </h4>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">Verified ABDM AI Guidance • Safe & Private</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
            title="Chat History"
          >
            <History className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
            title="Chat Settings"
          >
            <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          /* WELCOME SCREEN */
          <div className="py-6 space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-teal-500/10 dark:bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner text-[#00a896]">
              👋
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Hi, I'm your AI Health Assistant 👋</h3>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed font-medium">
                I can help you understand your symptoms, explain medical terms, prepare questions for your doctor, and navigate your medicines and health records.
              </p>
            </div>

            {/* QUICK PROMPT CHIPS */}
            <div className="space-y-2.5 max-w-lg mx-auto text-left font-mono">
              <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-400 uppercase tracking-wider block text-center font-sans">
                Try asking me:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] font-sans">
                <button
                  onClick={() => onSendMessage('I have a mild headache, what should I do?')}
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-slate-200 text-left transition-all cursor-pointer shadow-xs hover:border-[#00a896]"
                >
                  💡 <strong className="font-bold">Headache Relief:</strong> "I have a mild headache, what should I do?"
                </button>
                <button
                  onClick={onOpenTermExplainer}
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-cyan-300 text-left transition-all cursor-pointer shadow-xs hover:border-[#00a896]"
                >
                  📖 <strong className="font-bold">Medical Terms:</strong> "Explain Hypertension / Blood Pressure"
                </button>
                <button
                  onClick={onOpenDoctorPrep}
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-purple-300 text-left transition-all cursor-pointer shadow-xs hover:border-[#00a896]"
                >
                  📝 <strong className="font-bold">Doctor Visit Prep:</strong> "Prepare questions for my doctor"
                </button>
                <button
                  onClick={() => onSendMessage('Tell me about my active medicines')}
                  className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-800 dark:text-emerald-300 text-left transition-all cursor-pointer shadow-xs hover:border-[#00a896]"
                >
                  💊 <strong className="font-bold">My Medicines:</strong> "Tell me about my active medicines"
                </button>
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 text-sm font-bold shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                {/* EMERGENCY BANNER CARD IF DETECTED */}
                {msg.isEmergencyAlert && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/90 border-2 border-rose-500 space-y-2 text-rose-900 dark:text-rose-200 text-xs font-mono shadow-md">
                    <div className="flex items-center gap-2 font-bold text-rose-600 dark:text-rose-300">
                      <AlertTriangle className="w-4 h-4 animate-bounce text-rose-600" />
                      <span>Potential Emergency Detected</span>
                    </div>
                    <p className="text-[11px] font-sans font-medium">
                      If you are experiencing severe chest pain, heavy bleeding, or difficulty breathing, please seek immediate emergency medical care.
                    </p>
                    <div className="flex gap-2 pt-1 font-bold font-sans">
                      <button
                        onClick={onNavigateSOS}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-sm"
                      >
                        Open SOS & Emergency
                      </button>
                      <button
                        onClick={onNavigateHospitals}
                        className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-cyan-300 border border-slate-300 dark:border-slate-700 cursor-pointer"
                      >
                        Find Hospitals
                      </button>
                    </div>
                  </div>
                )}

                {/* BUBBLE CONTENT */}
                <div className={`p-4 rounded-2xl border ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-[#00a896] to-teal-600 text-white border-teal-500/40 rounded-tr-none font-bold shadow-md'
                    : 'bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 rounded-tl-none leading-relaxed font-medium shadow-xs'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span className="text-[9px] opacity-70 block text-right mt-1.5 font-mono">{msg.timestamp}</span>
                </div>

                {/* AI ACTION BUTTONS */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600 dark:text-slate-400 pt-0.5">
                    <button onClick={() => onCopyMessage(msg.content)} className="hover:text-[#00a896] dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer font-bold">
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>

                    <button onClick={() => onSaveToNotes(msg)} className="hover:text-purple-600 dark:hover:text-purple-300 flex items-center gap-1 cursor-pointer font-bold">
                      <Bookmark className="w-3 h-3" />
                      <span>{msg.savedToNotes ? '✓ Saved' : 'Save Note'}</span>
                    </button>

                    <button onClick={() => onFeedback(msg.id, true)} className="hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer">
                      <ThumbsUp className={`w-3 h-3 ${msg.isHelpful === true ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-500' : ''}`} />
                    </button>

                    <button onClick={() => onFeedback(msg.id, false)} className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer">
                      <ThumbsDown className={`w-3 h-3 ${msg.isHelpful === false ? 'text-rose-600 dark:text-rose-400 fill-rose-500' : ''}`} />
                    </button>

                    <button onClick={onRegenerate} className="hover:text-amber-600 dark:hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold">
                      <RotateCcw className="w-3 h-3" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                )}

                {/* SUGGESTED FOLLOW-UP CHIPS */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5 font-sans">
                    {msg.suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => onSendMessage(q)}
                        className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 text-[11px] font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-white text-xs font-bold shrink-0 shadow-xs">
                  <User className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
                </div>
              )}
            </div>
          ))
        )}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="flex gap-3 items-center text-slate-600 dark:text-slate-400 font-mono text-xs">
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 font-bold">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00a896] animate-ping" />
              <span className="w-2 h-2 rounded-full bg-[#00a896] animate-ping delay-100" />
              <span className="w-2 h-2 rounded-full bg-[#00a896] animate-ping delay-200" />
              <span className="text-[11px] text-slate-600 dark:text-slate-400 ml-1 font-bold">AI Assistant is analyzing health data...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT CONTAINER */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 shrink-0 space-y-2">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about your health, symptoms, medicines..."
            className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#00a896] font-sans font-medium text-xs shadow-inner"
          />

          <button
            type="button"
            onClick={() => alert('Voice input feature enabled in browser mic mode')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#00a896] dark:hover:text-white cursor-pointer transition-colors shadow-xs"
            title="Voice Input"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => alert('Medical Record document analyzer selected')}
            className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-[#00a896] dark:hover:text-white cursor-pointer transition-colors shadow-xs"
            title="Attach Medical Document"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono font-medium">
          ABDM Verified AI Companion. For medical emergencies, call 108 or use SOS.
        </p>
      </div>
    </div>
  );
};
