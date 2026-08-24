import React, { useState } from 'react';
import { X, Send, User, Sparkles } from 'lucide-react';
import type { FamilyMember, FamilyChatMessage } from './familyData';
import { INITIAL_FAMILY_MESSAGES } from './familyData';

interface FamilyChatDrawerProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FamilyChatDrawer: React.FC<FamilyChatDrawerProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<FamilyChatMessage[]>(INITIAL_FAMILY_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [typing, setTyping] = useState(false);

  if (!isOpen || !member) return null;

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: FamilyChatMessage = {
      id: `MSG-${Date.now()}`,
      sender: 'Self',
      senderName: 'Samson L.',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate member reply after a short delay
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const replyMsg: FamilyChatMessage = {
        id: `MSG-${Date.now() + 1}`,
        sender: 'Member',
        senderName: `${member.name} (${member.relationship})`,
        text: `Got it! Thanks for keeping me updated. Take care!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      setMessages((prev) => [...prev, replyMsg]);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-10 h-10 rounded-xl object-cover border-2 border-teal-500/40"
            />
            <div>
              <h3 className="text-base font-extrabold text-white">{member.name}</h3>
              <span className="text-[10px] font-bold text-teal-400 font-mono">
                {member.relationship} • Connected
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHAT MESSAGES STREAM */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'Self' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-slate-400 mb-0.5">{msg.senderName} • {msg.timestamp}</span>
              <div
                className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  msg.sender === 'Self'
                    ? 'bg-[#00a896] text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="text-[11px] text-cyan-400 font-semibold animate-pulse flex items-center gap-1.5 pt-1">
              <span>{member.name} is typing...</span>
            </div>
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${member.name}...`}
            className="flex-1 px-3.5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="p-3 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
