import React, { useState } from 'react';
import { X, Share2, Check, MessageCircle, Mail, Send } from 'lucide-react';
import type { HospitalItem } from './hospitalsData';

interface HospitalShareFamilyModalProps {
  hospital: HospitalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmShare: (hospName: string, memberName: string) => void;
}

export const HospitalShareFamilyModal: React.FC<HospitalShareFamilyModalProps> = ({
  hospital,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !hospital) return null;

  const shareUrl = `${window.location.origin}/hospital/${hospital.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Share Hospital</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Send details to family or friends</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* COPY LINK SECTION */}
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
             <div className="font-mono">
               <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Hospital Target:</span>
               <strong className="text-slate-900 dark:text-white text-sm">{hospital.name}</strong>
             </div>
             
             <div className="space-y-1.5">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Share Link:</span>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-xl overflow-hidden">
                  <span className="text-slate-600 dark:text-slate-300 truncate flex-1 font-mono text-[11px]">{shareUrl}</span>
                </div>
             </div>
             
             <div className="space-y-2 pt-2">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Share via Apps:</span>
                <div className="flex items-center gap-3">
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${hospital.name}: ${shareUrl}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 border border-green-200 dark:border-green-500/20 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold">WhatsApp</span>
                  </a>
                  <a 
                    href={`mailto:?subject=${encodeURIComponent(`Hospital Recommendation: ${hospital.name}`)}&body=${encodeURIComponent(`I wanted to share this hospital with you:\n\n${hospital.name}\n${shareUrl}`)}`} 
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 rounded-xl transition-colors cursor-pointer"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Email</span>
                  </a>
                  <a 
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out ${hospital.name}`)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-500/20 border border-sky-200 dark:border-sky-500/20 rounded-xl transition-colors cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Telegram</span>
                  </a>
                </div>
             </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-6 rounded-xl font-extrabold text-xs text-slate-900 dark:text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-36"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
