import React, { useState } from 'react';
import { X, UserPlus, Check, ArrowRight, ArrowLeft, Sparkles, Send, CheckCircle2 } from 'lucide-react';
import type { FamilyMember, PendingRequest } from './familyData';

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvitation?: (newRequest: PendingRequest) => void;
  onSendInvite?: (newRequest: PendingRequest) => void;
}

export const AddFamilyMemberModal: React.FC<AddFamilyMemberModalProps> = ({
  isOpen,
  onClose,
  onSendInvitation,
  onSendInvite,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('Mother');
  const [age, setAge] = useState<string>('55');
  const [contact, setContact] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setSending(true);

    const newReq: PendingRequest = {
      id: `REQ-${Date.now().toString().slice(-4)}`,
      name: fullName,
      relationship,
      contact,
      type: 'Outgoing',
      timeAgo: 'Just now',
      status: 'Pending'
    };

    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);
      if (onSendInvitation) onSendInvitation(newReq);
      if (onSendInvite) onSendInvite(newReq);
    }, 1200);
  };

  const handleDone = () => {
    setSentSuccess(false);
    setStep(1);
    setFullName('');
    setContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Step {step} of 2</span>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {sentSuccess ? 'Invitation Sent' : step === 1 ? 'Add Family Member' : 'Send Invitation'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto text-emerald-500 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white">Invitation Sent Successfully</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Your family member <strong className="text-slate-900 dark:text-white">{fullName}</strong> ({relationship}) has been added to pending connections.
              </p>
            </div>
            <button
              onClick={handleDone}
              className="w-full py-3 px-4 rounded-xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 transition-all shadow-md cursor-pointer"
            >
              Done & View Pending Connections
            </button>
          </div>
        ) : (
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSend} className="space-y-4 text-xs">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">Relationship</label>
                    <select
                      value={relationship}
                      onChange={(e) => setRelationship(e.target.value as any)}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#00a896]"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Grandparent">Grandparent</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">Age (Optional)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 58"
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-[#00a896]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    disabled={!fullName}
                    className="py-3 px-6 rounded-xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>Continue to Invitation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    Email or Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. family@example.com or +91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:border-[#00a896]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                  <span>ℹ Invitation will be simulated for this frontend prototype.</span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !contact}
                    className="py-3 px-6 rounded-xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-[#00a896] to-cyan-500 hover:from-[#00897b] hover:to-cyan-600 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                  >
                    {sending ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>Sending Invitation...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Mock Invitation</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
