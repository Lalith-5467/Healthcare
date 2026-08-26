import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Zap, ZapOff, Image, ArrowLeft, ShieldAlert, Upload, Sparkles, RefreshCw } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capturedDataUrl: string) => void;
  onSwitchToUpload: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  onSwitchToUpload,
}) => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [flashOn, setFlashOn] = useState(false);
  const [capturingState, setCapturingState] = useState<'idle' | 'scanning' | 'detected' | 'processing' | 'ready'>('idle');
  const [, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Request real camera stream if granted
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionState('granted');
    } catch (err) {
      console.warn('Camera access unavailable or denied:', err);
      setCameraError('Camera access unavailable or denied by browser.');
      setPermissionState('denied');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturingState('idle');
      setPermissionState('prompt');
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // CAPTURE SIMULATION SEQUENCE
  const handleTriggerCapture = () => {
    if (capturingState !== 'idle') return;

    setCapturingState('scanning');

    setTimeout(() => {
      setCapturingState('detected');
    }, 600);

    setTimeout(() => {
      setCapturingState('processing');
    }, 1200);

    setTimeout(() => {
      setCapturingState('ready');
      generateScannedCanvas();
    }, 1800);
  };

  // GENERATE DYNAMIC HIGH RES CANVAS IMAGE
  const generateScannedCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      onCapture('data:image/png;base64,placeholder');
      return;
    }

    // Clean white document background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 1000);

    // Outer subtle border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, 760, 960);

    // Header logo area
    ctx.fillStyle = '#00a896';
    ctx.fillRect(50, 50, 60, 60);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'extrabold 32px sans-serif';
    ctx.fillText('✚', 65, 92);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('APOLLO HEALTHCARE SERVICES', 130, 80);

    ctx.fillStyle = '#00a896';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('CLINICAL PATHOLOGY LABORATORY REPORT', 130, 102);

    // Divider
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(50, 130, 700, 2);

    // Patient info banner
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(50, 150, 700, 80);

    ctx.fillStyle = '#334155';
    ctx.font = '16px sans-serif';
    ctx.fillText('Patient Name: Lalith Patel', 70, 185);
    ctx.fillText('Age / Gender: 34 Y / Male', 70, 210);

    ctx.fillText('Report ID: LAB-2026-9481', 450, 185);
    ctx.fillText('Date: 23 Aug 2026', 450, 210);

    // Title
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('COMPLETE BLOOD COUNT (CBC)', 50, 275);

    // Table Header
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(50, 295, 700, 35);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('TEST DESCRIPTION', 70, 318);
    ctx.fillText('RESULT VALUE', 350, 318);
    ctx.fillText('REFERENCE INTERVAL', 520, 318);

    // Table Rows
    const rows = [
      { name: 'Hemoglobin (Hb)', result: '14.2 g/dL', range: '13.0 - 17.0 g/dL' },
      { name: 'Total WBC Count', result: '7,200 /µL', range: '4,000 - 11,000 /µL' },
      { name: 'Platelet Count', result: '245,000 /µL', range: '150,000 - 450,000 /µL' },
      { name: 'RBC Count', result: '4.8 M/µL', range: '4.5 - 5.5 M/µL' },
      { name: 'Packed Cell Volume (PCV)', result: '43.5 %', range: '40 - 50 %' },
      { name: 'Mean Corpuscular Volume (MCV)', result: '88.2 fL', range: '80 - 100 fL' }
    ];

    rows.forEach((r, idx) => {
      const y = 390 + idx * 55;
      if (idx % 2 === 1) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(50, y - 35, 700, 45);
      }
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText(r.name, 70, y);
      ctx.fillStyle = '#00a896';
      ctx.fillText(r.result, 350, y);
      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.fillText(r.range, 520, y);
    });

    // Doctor signature stamp
    ctx.fillStyle = '#00a896';
    ctx.fillRect(500, 850, 220, 2);
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('Dr. Rajesh Kumar, MD', 500, 880);
    ctx.font = '15px sans-serif';
    ctx.fillText('Senior Pathologist', 500, 905);
    ctx.fillText('Reg No: MCI-84920', 500, 925);

    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 dark:bg-slate-950 flex flex-col justify-between overflow-hidden animate-in fade-in duration-200 font-sans">
      {/* 1. TOP CONTROL BAR */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer text-sm font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="text-base font-extrabold text-white tracking-wide">
            Medical Document Scanner
          </span>
        </div>

        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2.5 rounded-full transition-colors cursor-pointer ${
            flashOn ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="Toggle Flash Simulation"
        >
          {flashOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
        </button>
      </div>

      {/* 2. MAIN PREVIEW AREA WITH CORNER BRACKETS AND SCANNING BEAM */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* CAMERA PERMISSION INITIAL PROMPT MODAL */}
        {permissionState === 'prompt' && (
          <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Camera Access Required</h3>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  Camera access is needed to scan your medical document directly from your device.
                </p>
              </div>
              <div className="space-y-3 pt-2">
                <button
                  onClick={startCamera}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  <span>Allow Camera & Start</span>
                </button>
                <button
                  onClick={() => {
                    setPermissionState('denied');
                  }}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer text-sm"
                >
                  Use Interactive Demo Scanner
                </button>
                <button
                  onClick={onSwitchToUpload}
                  className="w-full py-2.5 px-4 text-xs font-medium text-cyan-400 hover:underline cursor-pointer"
                >
                  Switch to Upload File instead
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DENIED / UNAVAILABLE STATE BANNER */}
        {permissionState === 'denied' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-lg backdrop-blur-md">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Camera permission unavailable. Using high-fidelity demo scanner.</span>
          </div>
        )}

        {/* FLASH SIMULATION OVERLAY */}
        {flashOn && (
          <div className="absolute inset-0 z-10 bg-amber-200/10 pointer-events-none transition-opacity" />
        )}

        {/* LIVE CAMERA VIDEO STREAM */}
        {permissionState === 'granted' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          /* MOCK DOCUMENT PREVIEW SIMULATION */
          <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-xl shadow-2xl p-6 overflow-hidden select-none opacity-90 border-4 border-slate-700">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">APOLLO HEALTHCARE</h4>
                <p className="text-[10px] font-bold text-teal-600">CLINICAL PATHOLOGY LABORATORY</p>
              </div>
              <div className="text-right text-[9px] text-slate-500">
                <div>REF: LAB-2026-9481</div>
                <div>DATE: 23 Aug 2026</div>
              </div>
            </div>

            {/* Content Mock */}
            <div className="mt-4 space-y-3">
              <div className="bg-slate-100 p-2.5 rounded text-slate-800 text-[11px] font-semibold flex justify-between">
                <span>Patient: Lalith Patel</span>
                <span>Age: 34 | Male</span>
              </div>

              <div className="text-xs font-extrabold text-slate-900 underline mt-2">COMPLETE BLOOD COUNT (CBC)</div>

              <table className="w-full text-[10px] text-left text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 text-slate-900 font-bold">
                    <th className="py-1">Test Name</th>
                    <th className="py-1">Result</th>
                    <th className="py-1">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-1 font-medium">Hemoglobin</td>
                    <td className="py-1 font-bold text-teal-700">14.2 g/dL</td>
                    <td className="py-1 text-slate-500">13.0 - 17.0</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">WBC Count</td>
                    <td className="py-1 font-bold text-teal-700">7,200 /µL</td>
                    <td className="py-1 text-slate-500">4,000 - 11,000</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Platelets</td>
                    <td className="py-1 font-bold text-teal-700">245,000 /µL</td>
                    <td className="py-1 text-slate-500">150,000 - 450k</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">RBC Count</td>
                    <td className="py-1 font-bold text-teal-700">4.8 M/µL</td>
                    <td className="py-1 text-slate-500">4.5 - 5.5</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-6 border-t border-slate-200 text-right text-[10px] text-slate-600 font-bold">
                Dr. Rajesh Kumar, MD <br />
                <span className="font-normal text-slate-400">Chief Pathologist</span>
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENT SCANNER FRAME WITH 4 CORNER BRACKETS */}
        <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4] border-2 border-cyan-400/40 rounded-2xl pointer-events-none flex flex-col justify-between p-3 shadow-[0_0_50px_rgba(0,168,150,0.15)]">
          {/* TOP LEFT BRACKET */}
          <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-cyan-400 rounded-tl-xl" />
          {/* TOP RIGHT BRACKET */}
          <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-cyan-400 rounded-tr-xl" />
          {/* BOTTOM LEFT BRACKET */}
          <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-cyan-400 rounded-bl-xl" />
          {/* BOTTOM RIGHT BRACKET */}
          <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-cyan-400 rounded-br-xl" />

          {/* ANIMATED VERTICAL SCANNING BEAM */}
          <motion.div
            animate={{
              y: [0, 420, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#00a896] z-10"
          />

          {/* FRAME STATUS BADGE */}
          <div className="self-center mt-4 bg-slate-900/80 border border-slate-700/80 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 shadow-lg text-center">
            {capturingState === 'idle' && 'Position the document inside the frame.'}
            {capturingState === 'scanning' && 'Scanning document surface...'}
            {capturingState === 'detected' && '✓ Document detected! Alignment verified.'}
            {capturingState === 'processing' && 'Enhancing clarity & text recognition...'}
            {capturingState === 'ready' && '✓ Document scan complete!'}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ACTION CONTROLS */}
      <div className="relative z-20 px-6 py-6 bg-slate-900/95 border-t border-slate-800 backdrop-blur-md flex items-center justify-between gap-4 max-w-2xl mx-auto w-full">
        {/* GALLERY BUTTON */}
        <button
          onClick={onSwitchToUpload}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors">
            <Image className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold">Gallery</span>
        </button>

        {/* MAIN CAPTURE BUTTON */}
        <button
          onClick={handleTriggerCapture}
          disabled={capturingState !== 'idle'}
          className={`relative group p-1 rounded-full transition-all cursor-pointer ${
            capturingState !== 'idle' ? 'opacity-80 cursor-wait' : 'hover:scale-105 active:scale-95'
          }`}
          aria-label="Capture Document"
        >
          <div className="w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center p-1 bg-slate-900 shadow-[0_0_25px_rgba(0,168,150,0.4)]">
            <div className="w-full h-full rounded-full bg-[#00a896] hover:bg-[#00897b] flex items-center justify-center text-white shadow-inner">
              {capturingState === 'idle' ? (
                <Camera className="w-8 h-8" />
              ) : (
                <RefreshCw className="w-8 h-8 animate-spin" />
              )}
            </div>
          </div>
        </button>

        {/* UPLOAD SWITCH BUTTON */}
        <button
          onClick={onSwitchToUpload}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <div className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 transition-colors">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-semibold">Upload</span>
        </button>
      </div>
    </div>
  );
};
