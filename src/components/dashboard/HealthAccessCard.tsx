import React, { useState } from 'react';
import { QrCode, ShieldCheck, Share2, ExternalLink } from 'lucide-react';
import { QRModal } from './QRModal';

interface HealthAccessCardProps {
  abhaId?: string;
  userName?: string;
  onToast?: (msg: string) => void;
}

export const HealthAccessCard: React.FC<HealthAccessCardProps> = ({
  abhaId = '91-8472-9104-5821@abdm',
  userName = 'Samson L.',
  onToast
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(abhaId);
    if (onToast) onToast('Health ID copied to clipboard!');
  };

  return (
    <>
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0c182e] to-slate-900 border border-slate-800 text-white shadow-xl relative overflow-hidden flex flex-col justify-between group">
        {/* GLOW BACKGROUND EFFECT */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

        {/* HEADER */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                Health Access
              </h3>
              <span className="text-[11px] text-slate-400">ABDM Digital Vault</span>
            </div>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Verified</span>
          </span>
        </div>

        {/* CENTER CONTENT */}
        <div className="my-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold text-slate-300">
              Securely share your health information.
            </p>
            <p className="text-[11px] font-mono text-cyan-300 font-bold truncate">
              {abhaId}
            </p>
          </div>

          <div
            onClick={() => setModalOpen(true)}
            className="p-2.5 rounded-xl bg-white text-slate-900 shrink-0 shadow-md cursor-pointer hover:scale-105 transition-transform"
            title="Click to expand QR Code"
          >
            <QrCode className="w-8 h-8" />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="pt-2 flex items-center gap-3 relative z-10">
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View QR</span>
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <QRModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        abhaId={abhaId}
        userName={userName}
      />
    </>
  );
};
