import React from 'react';
import { X, ShieldCheck, QrCode, Download, Share2, Check } from 'lucide-react';
import type { InsurancePolicy } from './insuranceData';

interface DigitalHealthCardModalProps {
  policy: InsurancePolicy | null;
  isOpen: boolean;
  onClose: () => void;
  onShareCard: () => void;
}

export const DigitalHealthCardModal: React.FC<DigitalHealthCardModalProps> = ({
  policy,
  isOpen,
  onClose,
  onShareCard,
}) => {
  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Digital Health Card</h3>
              <p className="text-xs text-slate-400">Cashless Admission Verification Card</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DIGITAL CARD GRAPHIC CONTAINER */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border-2 border-purple-500/40 space-y-4 shadow-2xl relative overflow-hidden text-xs">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              <div>
                <h4 className="font-extrabold text-white text-base">{policy.providerName}</h4>
                <span className="text-[10px] text-purple-300 font-mono">{policy.planName}</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Cashless Active
            </span>
          </div>

          <div className="space-y-1 font-mono pt-2 border-t border-slate-800">
            <div className="flex justify-between"><span className="text-slate-400">Member Name:</span><strong className="text-white font-sans">{policy.policyHolder}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Member ID:</span><strong className="text-cyan-300">{policy.memberId}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Policy Number:</span><strong className="text-purple-300">{policy.policyNumber}</strong></div>
            <div className="flex justify-between"><span className="text-slate-400">Valid Until:</span><strong className="text-teal-300">{policy.expiryDate}</strong></div>
          </div>

          {/* DEMO QR CODE */}
          <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1 max-w-[140px] mx-auto shadow-lg">
            <div className="w-24 h-24 bg-slate-900 rounded-lg p-2 flex flex-col justify-between">
              <div className="flex justify-between">
                <div className="w-5 h-5 bg-white rounded" />
                <div className="w-5 h-5 bg-white rounded" />
              </div>
              <div className="flex justify-between">
                <div className="w-5 h-5 bg-white rounded" />
                <div className="w-3 h-3 bg-purple-400 rounded" />
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-900 font-mono">DEMO QR CODE</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="pt-2 flex justify-between gap-3 font-bold text-xs">
          <button
            onClick={onShareCard}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share Card</span>
          </button>

          <button
            onClick={() => {
              const link = document.createElement('a');
              link.download = `${policy.memberId}_HealthCard.png`;
              link.href = 'data:text/plain;charset=utf-8,DemoDigitalHealthCard';
              link.click();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
