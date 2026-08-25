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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
      
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
            <div className="flex items-center gap-3">
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#00a896] font-mono">
                  {member.relationship} • {member.status}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{member.name}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="space-y-6 py-6 flex-1 overflow-y-auto text-xs scrollbar-thin">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Connected Since:</span>
                <span className="font-mono font-bold text-slate-900">{member.connectedSince}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2.5">
                <span className="text-slate-500 font-medium">Last Active:</span>
                <span className="font-bold text-[#00a896]">{member.lastActivity}</span>
              </div>
              {member.email && (
                <div className="flex justify-between items-center border-t border-slate-200 pt-2.5">
                  <span className="text-slate-500 font-medium">Email:</span>
                  <span className="font-semibold text-slate-700">{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex justify-between items-center border-t border-slate-200 pt-2.5">
                  <span className="text-slate-500 font-medium">Phone:</span>
                  <span className="font-mono text-[#00a896] font-bold">{member.phone}</span>
                </div>
              )}
            </div>

            {/* SHARED INFORMATION BREAKDOWN */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-[10px] text-slate-500 uppercase tracking-wider">
                Shared Information Overview
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Appointments</span>
                  <strong className="font-mono text-cyan-600">3 shared</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Reminders</span>
                  <strong className="font-mono text-teal-600">2 shared</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Pharmacy</span>
                  <strong className="font-mono text-amber-600">1 shared</strong>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Medical Records</span>
                  <strong className="font-mono text-purple-600">0 shared</strong>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="pt-4 border-t border-slate-100 space-y-2 shrink-0 mt-auto">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(member);
                }}
                className="py-2.5 px-3 rounded-xl font-extrabold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#00a896]" />
                <span>Send Message</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenPermissions(member);
                }}
                className="py-2.5 px-3 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
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
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-rose-500 text-[11px] font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 hover:border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Connection</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
