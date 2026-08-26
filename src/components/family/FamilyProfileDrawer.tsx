import React from 'react';
import { X, Shield, MessageSquare, Trash2 } from 'lucide-react';
import type { FamilyMember } from './familyData';

interface FamilyProfileDrawerProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: (member: FamilyMember) => void;
  onOpenPermissions: (member: FamilyMember) => void;
  onRemoveConnection: (memberId: string) => void;
}

export const FamilyProfileDrawer: React.FC<FamilyProfileDrawerProps> = ({
  member,
  isOpen,
  onClose,
  onOpenChat,
  onOpenPermissions,
  onRemoveConnection,
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-teal-500/40"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono">
                {member.relationship} • {member.status}
              </span>
              <h3 className="text-base font-extrabold text-white">{member.name}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs">
          <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Connected Since:</span>
              <span className="font-mono font-bold text-white">{member.connectedSince}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
              <span className="text-slate-400">Last Active:</span>
              <span className="font-bold text-teal-400">{member.lastActivity}</span>
            </div>
            {member.email && (
              <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-200">{member.email}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex justify-between items-center border-t border-slate-800 pt-2.5">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono text-cyan-300">{member.phone}</span>
              </div>
            )}
          </div>

          {/* SHARED INFORMATION BREAKDOWN */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider text-slate-400">
              Shared Information Overview
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Appointments</span>
                <strong className="font-mono text-cyan-400">3 shared</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Reminders</span>
                <strong className="font-mono text-teal-400">2 shared</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Pharmacy</span>
                <strong className="font-mono text-amber-400">1 shared</strong>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Medical Records</span>
                <strong className="font-mono text-purple-400">0 shared</strong>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenChat(member);
              }}
              className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Send Message</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPermissions(member);
              }}
              className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Manage Sharing</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onRemoveConnection(member.id);
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
