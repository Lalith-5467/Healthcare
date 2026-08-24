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
  History
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl h-[650px] flex flex-col justify-between shadow-xl relative overflow-hidden text-xs">
      {/* CHAT HEADER BAR */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-base">
            🤖
          </div>
          <div>
            <h4 className="font-extrabold text-white text-sm">AI Health Companion</h4>
            <span className="text-[10px] text-slate-400 font-mono">Demo Mode • Safe General Guidance</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Chat History"
          >
            <History className="w-4 h-4 text-cyan-400" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            title="Chat Settings"
          >
            <Settings className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
        {messages.length === 0 ? (
          /* WELCOME SCREEN */
          <div className="py-6 space-y-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-3xl mx-auto shadow-inner">
              👋
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-extrabold text-white">Hi, I'm your AI Health Assistant 👋</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                I can help you understand your health information, prepare questions for your doctor, explain medical terms, and navigate your patient portal.
              </p>
            </div>

            {/* QUICK PROMPT CHIPS */}
            <div className="space-y-2 max-w-lg mx-auto text-left font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center font-sans">
                Try asking me:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={() => onSendMessage('I have a mild headache, what should I do?')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-200 text-left transition-colors cursor-pointer"
                >
                  💡 "I have a mild headache, what should I do?"
                </button>
                <button
                  onClick={onOpenTermExplainer}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-cyan-300 text-left transition-colors cursor-pointer"
                >
                  📖 "Explain a Medical Term (e.g. Hypertension)"
                </button>
                <button
                  onClick={onOpenDoctorPrep}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-purple-300 text-left transition-colors cursor-pointer"
                >
                  📝 "Prepare questions for doctor visit"
                </button>
                <button
                  onClick={() => onSendMessage('Tell me about my active medicines')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-emerald-300 text-left transition-colors cursor-pointer"
                >
                  💊 "Tell me about my active medicines"
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
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-sm font-bold shrink-0">
                  🤖
                </div>
              )}

              <div className={`space-y-2 max-w-[85%] sm:max-w-[75%] ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}>
                {/* EMERGENCY BANNER CARD IF DETECTED */}
                {msg.isEmergencyAlert && (
                  <div className="p-3 rounded-2xl bg-rose-950/80 border-2 border-rose-500 space-y-2 text-rose-200 text-xs font-mono">
                    <div className="flex items-center gap-2 font-bold text-rose-300">
                      <AlertTriangle className="w-4 h-4 animate-bounce" />
                      <span>Potential Emergency Detected</span>
                    </div>
                    <p className="text-[11px] font-sans">
                      If you are experiencing severe pain, heavy bleeding, or difficulty breathing, please seek immediate emergency care.
                    </p>
                    <div className="flex gap-2 pt-1 font-bold font-sans">
                      <button
                        onClick={onNavigateSOS}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white cursor-pointer shadow"
                      >
                        Open SOS & Emergency
                      </button>
                      <button
                        onClick={onNavigateHospitals}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 cursor-pointer"
                      >
                        Find Hospitals
                      </button>
                    </div>
                  </div>
                )}

                {/* BUBBLE CONTENT */}
                <div className={`p-4 rounded-2xl border ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white border-purple-500/40 rounded-tr-none font-medium'
                    : 'bg-slate-950 text-slate-200 border-slate-800 rounded-tl-none leading-relaxed'
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                  <span className="text-[9px] opacity-60 block text-right mt-1 font-mono">{msg.timestamp}</span>
                </div>

                {/* AI ACTION BUTTONS */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 pt-1">
                    <button onClick={() => onCopyMessage(msg.content)} className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer">
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>

                    <button onClick={() => onSaveToNotes(msg)} className="hover:text-purple-300 flex items-center gap-1 cursor-pointer">
                      <Bookmark className="w-3 h-3" />
                      <span>{msg.savedToNotes ? '✓ Saved' : 'Save Note'}</span>
                    </button>

                    <button onClick={() => onFeedback(msg.id, true)} className="hover:text-emerald-400 cursor-pointer">
                      <ThumbsUp className={`w-3 h-3 ${msg.isHelpful === true ? 'text-emerald-400 fill-emerald-400' : ''}`} />
                    </button>

                    <button onClick={() => onFeedback(msg.id, false)} className="hover:text-rose-400 cursor-pointer">
                      <ThumbsDown className={`w-3 h-3 ${msg.isHelpful === false ? 'text-rose-400 fill-rose-400' : ''}`} />
                    </button>

                    <button onClick={onRegenerate} className="hover:text-amber-300 flex items-center gap-1 cursor-pointer">
                      <RotateCcw className="w-3 h-3" />
                      <span>Regenerate</span>
                    </button>
                  </div>
                )}

                {/* SUGGESTED FOLLOW-UP CHIPS */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1 font-mono">
                    {msg.suggestedQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => onSendMessage(q)}
                        className="px-2.5 py-1 rounded-xl bg-slate-950 hover:bg-slate-800 text-purple-300 border border-slate-800 text-[10px] transition-colors cursor-pointer"
                      >
                        ⚡ {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          ))
        )}

        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="flex gap-3 items-center text-slate-400 font-mono text-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold">
              🤖
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping delay-100" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping delay-200" />
              <span className="text-[11px] text-slate-400 ml-1">AI Assistant is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT CONTAINER */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/80 shrink-0 space-y-2">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything about your health or symptoms..."
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-sans"
          />

          <button
            type="button"
            onClick={() => alert('Voice input is coming soon')}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Voice Input (Coming Soon)"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => alert('Document analysis is coming soon')}
            className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Attach Document (Coming Soon)"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center font-mono">
          AI-generated information is for educational purposes only. Not a medical diagnosis.
        </p>
      </div>
    </div>
  );
};
