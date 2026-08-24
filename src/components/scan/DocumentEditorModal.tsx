import React, { useState } from 'react';
import { RefreshCw, RotateCw, Crop, ArrowRight, Check, ArrowLeft, Eye } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Cancel</span>
        </button>

        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Eye className="w-5 h-5 text-cyan-400" />
          <span>Document Preview & Crop</span>
        </div>

        <button
          onClick={() => onContinue(imageSrc, rotation)}
          className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#00a896] hover:bg-teal-600 transition-colors flex items-center gap-2 cursor-pointer shadow-md"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* CANVAS / PREVIEW AREA */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden relative">
        <div className="relative max-w-lg w-full aspect-[3/4] flex items-center justify-center bg-slate-900/50 rounded-2xl border border-slate-800 p-4 shadow-2xl overflow-hidden">
          {/* CROP OVERLAY GUIDE */}
          {cropActive && (
            <div className="absolute inset-6 border-2 border-dashed border-cyan-400 z-20 pointer-events-none rounded-lg flex flex-col justify-between p-2">
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded self-start font-mono">
                Auto-Crop Active
              </span>
              <div className="w-4 h-4 border-r-2 border-b-2 border-cyan-400 self-end" />
            </div>
          )}

          {/* IMAGE DISPLAY WITH ROTATION */}
          <div
            className="transition-transform duration-300 ease-out max-h-full max-w-full flex items-center justify-center"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Document Preview"
                className="max-h-[60vh] object-contain rounded-lg shadow-xl border border-slate-700"
              />
            ) : (
              <div className="w-full h-80 bg-white text-slate-800 p-6 rounded-lg font-mono text-xs overflow-hidden">
                <div className="font-bold text-sm text-[#00a896] mb-2">SAMPLE MEDICAL REPORT PREVIEW</div>
                <div className="space-y-2 text-slate-600">
                  <p>Patient Name: Lalith Patel</p>
                  <p>Hospital: Apollo Healthcare Center</p>
                  <p>Date: 23 Aug 2026</p>
                  <p>Test: Complete Blood Count & Electrolytes</p>
                  <div className="border-t border-slate-300 my-2 pt-2">
                    <p className="font-bold text-slate-800">Result Summary: Normal</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER TOOLBAR */}
      <div className="px-6 py-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-center gap-4 sm:gap-6">
        <button
          onClick={onRetake}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retake</span>
        </button>

        <button
          onClick={handleRotate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-xs font-bold cursor-pointer"
        >
          <RotateCw className="w-4 h-4 text-cyan-400" />
          <span>Rotate (90°)</span>
        </button>

        <button
          onClick={() => setCropActive(!cropActive)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors text-xs font-bold cursor-pointer ${
            cropActive
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
          }`}
        >
          <Crop className="w-4 h-4" />
          <span>{cropActive ? 'Cropping Active' : 'Auto Crop'}</span>
        </button>

        <button
          onClick={() => onContinue(imageSrc, rotation)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 text-white font-extrabold text-xs transition-all shadow-lg cursor-pointer"
        >
          <span>Continue to Details</span>
          <Check className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
