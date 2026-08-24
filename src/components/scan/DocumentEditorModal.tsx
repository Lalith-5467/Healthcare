import React, { useState } from 'react';
import { RefreshCw, RotateCw, Crop, ArrowRight, ArrowLeft, Eye } from 'lucide-react';

interface DocumentEditorModalProps {
  isOpen: boolean;
  imageSrc: string;
  onRetake: () => void;
  onContinue: (editedImageSrc: string, rotationDeg: number) => void;
  onClose: () => void;
}

export const DocumentEditorModal: React.FC<DocumentEditorModalProps> = ({
  isOpen,
  imageSrc,
  onRetake,
  onContinue,
  onClose,
}) => {
  const [rotation, setRotation] = useState(0);
  const [cropActive, setCropActive] = useState(false);

  if (!isOpen) return null;

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-200 font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-sm font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
          <Eye className="w-5 h-5 text-[#00a896] dark:text-cyan-400" />
          <span>Document Preview & Crop</span>
        </div>

        <button
          onClick={() => onContinue(imageSrc, rotation)}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#00a896] hover:bg-[#00897b] transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CANVAS / PREVIEW AREA */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="relative max-w-lg w-full aspect-[3/4] flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xl overflow-hidden">
          {/* CROP OVERLAY GUIDE */}
          {cropActive && (
            <div className="absolute inset-6 border-2 border-dashed border-cyan-400 z-20 pointer-events-none rounded-lg flex flex-col justify-between p-2">
              <span className="text-[10px] bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded self-start font-mono font-bold">
                Auto-Crop Box
              </span>
            </div>
          )}

          {/* RENDER IMAGE WITH CSS ROTATION */}
          <img
            src={imageSrc}
            alt="Scanned Document Preview"
            style={{ transform: `rotate(${rotation}deg)` }}
            className="max-h-full max-w-full object-contain rounded shadow-lg transition-transform duration-300"
          />
        </div>
      </div>

      {/* FOOTER TOOLBAR */}
      <div className="bg-white dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 p-4 font-sans">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3 text-xs">
          <button
            onClick={onRetake}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 text-rose-500" />
            <span>Retake</span>
          </button>

          <button
            onClick={handleRotate}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RotateCw className="w-4 h-4 text-[#00a896] dark:text-cyan-400" />
            <span>Rotate 90°</span>
          </button>

          <button
            onClick={() => setCropActive(!cropActive)}
            className={`px-4 py-2.5 rounded-xl font-bold border flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors ${
              cropActive
                ? 'bg-[#00a896] text-white border-teal-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
            }`}
          >
            <Crop className="w-4 h-4" />
            <span>{cropActive ? 'Cropping' : 'Auto-Crop'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
