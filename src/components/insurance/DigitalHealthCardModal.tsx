import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, QrCode, Download, Share2, Copy, Check, MessageSquare, Mail, Smartphone, Users } from 'lucide-react';
import { ABDMQRCodeSVG } from '../common/ABDMQRCodeSVG';
import type { InsurancePolicy } from './insuranceData';

interface DigitalHealthCardModalProps {
  policy: InsurancePolicy | null;
  isOpen: boolean;
  onClose: () => void;
  onShareCard?: () => void;
}

export const DigitalHealthCardModal: React.FC<DigitalHealthCardModalProps> = ({
  policy,
  isOpen,
  onClose,
  onShareCard: _onShareCard,
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastFeedback, setToastFeedback] = useState<string | null>(null);

  if (!isOpen || !policy) return null;

  const qrData = `ABDM-INSURANCE-PASS|${policy.memberId}|${policy.policyNumber}|${policy.policyHolder}|${policy.providerName}|EXPIRES:${policy.expiryDate}`;

  const shareText = `Digital Health Card - ${policy.providerName}
Plan: ${policy.planName}
Member: ${policy.policyHolder}
Member ID: ${policy.memberId}
Policy No: ${policy.policyNumber}
Valid Till: ${policy.expiryDate}
Cashless Verification Active via MediCare Portal.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setToastFeedback('✓ Policy pass copied to clipboard');
    setTimeout(() => {
      setCopied(false);
      setToastFeedback(null);
    }, 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Digital Health Card: ${policy.planName}`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Health Card - ${policy.planName}`,
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopy();
    }
  };

  const handleShareFamily = () => {
    setToastFeedback('✓ Shared with Family Connected Members');
    setTimeout(() => setToastFeedback(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-slate-900 dark:text-white">
        
        {/* TOAST FEEDBACK */}
        <AnimatePresence>
          {toastFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 left-6 right-6 z-30 bg-[#00a896] text-white text-xs font-extrabold py-2 px-3.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{toastFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-[#00a896]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Digital Health Card
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cashless Admission Verification Pass</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowShareOptions(false);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DIGITAL CARD GRAPHIC CONTAINER */}
        <div
          className="p-5 sm:p-6 rounded-3xl space-y-4 shadow-xl relative overflow-hidden text-xs text-white"
          style={{
            background: 'linear-gradient(135deg, #092038 0%, #00695c 50%, #004d40 100%)',
            border: '1.5px solid rgba(20,184,166,.4)'
          }}
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-teal-300 shrink-0" />
              <div>
                <h4 className="font-extrabold text-white text-base leading-tight">{policy.providerName}</h4>
                <span className="text-[10px] text-teal-200 font-mono">{policy.planName}</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono shrink-0">
              Cashless Active
            </span>
          </div>

          <div className="space-y-1.5 font-mono pt-2 border-t border-teal-600/40 text-[11px]">
            <div className="flex justify-between">
              <span className="text-teal-200/80 font-sans">Member Name:</span>
              <strong className="text-white font-sans">{policy.policyHolder}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-200/80 font-sans">Member ID:</span>
              <strong className="text-cyan-200">{policy.memberId}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-200/80 font-sans">Policy Number:</span>
              <strong className="text-white">{policy.policyNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-teal-200/80 font-sans">Valid Until:</span>
              <strong className="text-emerald-300">{policy.expiryDate}</strong>
            </div>
          </div>

          {/* REAL SVG QR CODE */}
          <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 max-w-[135px] mx-auto shadow-md">
            <ABDMQRCodeSVG
              value={qrData}
              size={105}
              showCenterLogo={true}
              className="text-slate-950"
            />
            <span className="text-[8px] font-extrabold text-slate-800 font-mono tracking-wider">
              SCAN AT HOSPITAL
            </span>
          </div>
        </div>

        {/* INTERACTIVE SHARE DRAWER / SHEET */}
        <AnimatePresence>
          {showShareOptions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-2.5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">
                  Share Card Via:
                </span>
                <button
                  onClick={() => setShowShareOptions(false)}
                  className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Hide Options
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsApp}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="truncate">WhatsApp</span>
                </button>

                {/* Email */}
                <button
                  onClick={handleEmail}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-sky-500/40 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">Email</span>
                </button>

                {/* Copy Text */}
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500/40 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-teal-500/10 text-[#00a896] flex items-center justify-center">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <span className="truncate">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                {/* Family Share */}
                <button
                  onClick={handleShareFamily}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-500/40 flex flex-col items-center gap-1 cursor-pointer transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="truncate">Family</span>
                </button>
              </div>

              {/* Native System Share Trigger */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  onClick={handleNativeShare}
                  className="w-full py-1.5 px-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 font-extrabold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open System Share Menu</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* PRIMARY ACTIONS */}
        <div className="pt-1 flex justify-between gap-3 font-bold text-xs">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className={`flex-1 py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs ${
              showShareOptions
                ? 'bg-teal-500/15 text-[#00a896] border-teal-500/30'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Share2 className="w-4 h-4 text-[#00a896]" />
            <span>{showShareOptions ? 'Close Share' : 'Share Card'}</span>
          </button>

          <button
            onClick={() => {
              const link = document.createElement('a');
              link.download = `${policy.memberId}_HealthCard.png`;
              link.href = 'data:text/plain;charset=utf-8,DemoDigitalHealthCard';
              link.click();
              setToastFeedback('✓ Card downloaded successfully');
              setTimeout(() => setToastFeedback(null), 2500);
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download Card</span>
          </button>
        </div>
      </div>
    </div>
  );
};
