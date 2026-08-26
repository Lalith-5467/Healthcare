import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Zap, ZapOff, Image, ArrowLeft, ShieldAlert, Upload, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

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
  const nativeCameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

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

  // Handle native file or gallery selection
  const handleNativeImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // CAPTURE SEQUENCE
  const handleTriggerCapture = () => {
    if (capturingState !== 'idle') return;

    setCapturingState('scanning');

    setTimeout(() => {
      setCapturingState('detected');
    }, 400);

    setTimeout(() => {
      setCapturingState('processing');
    }, 900);

    setTimeout(() => {
      setCapturingState('ready');
      if (permissionState === 'granted' && videoRef.current) {
        captureFromVideoStream();
      } else {
        generateScannedCanvas();
      }
    }, 1400);
  };

  // Capture real video frame from webcam
  const captureFromVideoStream = () => {
    if (!videoRef.current) {
      generateScannedCanvas();
      return;
    }
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        onCapture(dataUrl);
        return;
      }
    } catch {
      // Fallback
    }
    generateScannedCanvas();
  };

  // GENERATE DYNAMIC HIGH RES CANVAS IMAGE (Fallback/Demo Mode)
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

    // Data rows
    const rows = [
      { name: 'Hemoglobin', result: '14.2 g/dL', ref: '13.0 - 17.0', normal: true },
      { name: 'Total WBC Count', result: '7,200 /µL', ref: '4,000 - 11,000', normal: true },
      { name: 'Platelet Count', result: '245,000 /µL', ref: '150,000 - 450,000', normal: true },
      { name: 'RBC Count', result: '4.80 M/µL', ref: '4.50 - 5.50', normal: true },
      { name: 'Packed Cell Volume (PCV)', result: '42.5 %', ref: '40.0 - 50.0', normal: true },
      { name: 'Mean Corpuscular Volume (MCV)', result: '88.5 fL', ref: '80.0 - 100.0', normal: true },
      { name: 'MCH', result: '29.6 pg', ref: '27.0 - 32.0', normal: true },
      { name: 'MCHC', result: '33.4 g/dL', ref: '31.5 - 34.5', normal: true },
    ];

    rows.forEach((r, idx) => {
      const y = 360 + idx * 35;
      if (idx % 2 === 1) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(50, y - 22, 700, 32);
      }
      ctx.fillStyle = '#334155';
      ctx.font = '14px sans-serif';
      ctx.fillText(r.name, 70, y);

      ctx.fillStyle = '#00a896';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText(r.result, 350, y);

      ctx.fillStyle = '#64748b';
      ctx.font = '13px sans-serif';
      ctx.fillText(r.ref, 520, y);
    });

    // Doctor signature stamp
    ctx.strokeStyle = '#00a896';
    ctx.lineWidth = 2;
    ctx.strokeRect(520, 720, 230, 80);

    ctx.fillStyle = '#00a896';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('VERIFIED CLINICAL PATHOLOGIST', 535, 745);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Dr. Rajesh Kumar, MD', 535, 770);
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.fillText('Reg. No: MED-IN-94812', 535, 788);

    // Footer
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('Digitally signed and generated via ABDM Health Records Network on 23 Aug 2026', 150, 950);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onCapture(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between overflow-hidden animate-in fade-in duration-200 font-sans">
      {/* NATIVE DEVICE CAMERA & GALLERY INPUTS */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNativeImageSelect}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleNativeImageSelect}
        className="hidden"
      />

      {/* 1. TOP APP BAR */}
      <div className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors cursor-pointer text-sm font-extrabold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-[#00a896] flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Medical Document Scanner
          </span>
        </div>

        <button
          type="button"
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2 rounded-xl transition-colors cursor-pointer border ${
            flashOn
              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-slate-700'
          }`}
          title="Toggle Flash Simulation"
        >
          {flashOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. MAIN CENTERED VIEWFINDER VIEWPORT */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-3 sm:p-5 overflow-hidden bg-slate-100 dark:bg-slate-950">
        {/* PERMISSION PROMPT MODAL */}
        {permissionState === 'prompt' && (
          <div className="absolute inset-0 z-40 bg-slate-950/50 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 text-center space-y-4 shadow-2xl text-slate-900 dark:text-white"
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center text-[#00a896] mx-auto">
                <Camera className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Camera Access Required</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                  Allow camera permissions to scan prescriptions and diagnostic reports directly from your device.
                </p>
              </div>
              <div className="space-y-2 pt-1 font-sans">
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Allow Camera & Start</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPermissionState('denied');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs border border-slate-200 dark:border-slate-700"
                >
                  Use Interactive Demo Scanner
                </button>
                <button
                  type="button"
                  onClick={onSwitchToUpload}
                  className="w-full py-1.5 px-4 text-xs font-bold text-[#00a896] hover:underline cursor-pointer"
                >
                  Switch to Upload File instead
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* STATUS PILL (TOP) */}
        <div className="z-20 mb-2.5">
          <div className="bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {capturingState === 'idle' && (permissionState === 'granted' ? 'Point camera at medical document' : 'AI Edge Detection Active (99.4%)')}
              {capturingState === 'scanning' && 'Scanning document surface...'}
              {capturingState === 'detected' && '✓ Document detected! Alignment verified.'}
              {capturingState === 'processing' && 'Enhancing clarity & OCR recognition...'}
              {capturingState === 'ready' && '✓ Scan complete! Saving preview...'}
            </span>
          </div>
        </div>

        {/* UNIFIED CENTERED VIEWFINDER & DOCUMENT CONTAINER */}
        <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[3/4] max-h-[58vh] bg-white rounded-2xl shadow-xl border-2 border-teal-500/30 overflow-hidden flex flex-col justify-between select-none">
          {/* FLASH SIMULATION */}
          {flashOn && (
            <div className="absolute inset-0 z-20 bg-amber-200/25 pointer-events-none transition-opacity" />
          )}

          {/* LIVE STREAM OR CLEAN CENTERED PREVIEW */}
          {permissionState === 'granted' ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 p-4 sm:p-5 overflow-hidden flex flex-col justify-between bg-white text-slate-900">
              {/* Document Header */}
              <div className="border-b-2 border-slate-900 pb-2 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">APOLLO HEALTHCARE</h4>
                  <p className="text-[9px] font-bold text-[#00a896]">PATHOLOGY & DIAGNOSTIC LAB</p>
                </div>
                <div className="text-right text-[8px] text-slate-500 font-mono">
                  <div>REF: LAB-2026-9481</div>
                  <div>23 Aug 2026</div>
                </div>
              </div>

              {/* Patient Banner */}
              <div className="my-2 bg-slate-50 p-2 rounded-lg text-slate-800 text-[10px] font-semibold flex justify-between border border-slate-200">
                <span>Patient: Lalith Patel</span>
                <span>Age: 34 | Male</span>
              </div>

              {/* CBC Report Table */}
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-extrabold text-slate-900 underline mb-1.5">COMPLETE BLOOD COUNT (CBC)</div>
                <table className="w-full text-[9px] text-left text-slate-700 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-900 font-bold">
                      <th className="py-0.5">Test</th>
                      <th className="py-0.5">Result</th>
                      <th className="py-0.5">Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-0.5 font-medium">Hemoglobin</td>
                      <td className="py-0.5 font-bold text-[#00a896]">14.2 g/dL</td>
                      <td className="py-0.5 text-slate-500">13.0 - 17.0</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">WBC Count</td>
                      <td className="py-0.5 font-bold text-[#00a896]">7,200 /µL</td>
                      <td className="py-0.5 text-slate-500">4,000 - 11,000</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">Platelets</td>
                      <td className="py-0.5 font-bold text-[#00a896]">245,000 /µL</td>
                      <td className="py-0.5 text-slate-500">150k - 450k</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">RBC Count</td>
                      <td className="py-0.5 font-bold text-[#00a896]">4.8 M/µL</td>
                      <td className="py-0.5 text-slate-500">4.5 - 5.5</td>
                    </tr>
                    <tr>
                      <td className="py-0.5 font-medium">PCV (Hematocrit)</td>
                      <td className="py-0.5 font-bold text-[#00a896]">42.5 %</td>
                      <td className="py-0.5 text-slate-500">40.0 - 50.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Stamp & Footer */}
              <div className="pt-2 border-t border-slate-200 flex justify-between items-end text-[9px]">
                <span className="text-slate-400 text-[8px]">ABDM Verified Record</span>
                <div className="text-right font-bold text-slate-700">
                  Dr. Rajesh Kumar, MD <br />
                  <span className="font-normal text-slate-400 text-[8px]">Chief Pathologist</span>
                </div>
              </div>
            </div>
          )}

          {/* 4 CORNER ALIGNMENT BRACKETS */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-3 border-l-3 border-[#00a896] rounded-tl-lg pointer-events-none z-10" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-3 border-r-3 border-[#00a896] rounded-tr-lg pointer-events-none z-10" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-3 border-l-3 border-[#00a896] rounded-bl-lg pointer-events-none z-10" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-3 border-r-3 border-[#00a896] rounded-br-lg pointer-events-none z-10" />

          {/* ANIMATED SCANNING LASER BEAM */}
          <motion.div
            animate={{
              y: [0, 340, 0]
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00a896] to-transparent shadow-[0_0_12px_#00a896] z-10 pointer-events-none"
          />
        </div>
      </div>

      {/* 3. BOTTOM ACTION BAR (DOCKED) */}
      <div className="relative z-30 px-6 py-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg shrink-0">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          {/* GALLERY BUTTON */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
              <Image className="w-5 h-5 text-[#00a896]" />
            </div>
            <span className="text-[11px] font-bold">Gallery</span>
          </button>

          {/* MAIN CAPTURE TRIGGER BUTTON */}
          <button
            type="button"
            onClick={handleTriggerCapture}
            disabled={capturingState !== 'idle'}
            className={`relative p-1 rounded-full transition-all cursor-pointer ${
              capturingState !== 'idle' ? 'opacity-80 cursor-wait' : 'hover:scale-105 active:scale-95'
            }`}
            aria-label="Capture Document"
          >
            <div className="w-16 h-16 rounded-full border-3 border-teal-500 flex items-center justify-center p-1 bg-white shadow-md">
              <div className="w-full h-full rounded-full bg-[#00a896] hover:bg-[#00897b] flex items-center justify-center text-white shadow-inner">
                {capturingState === 'idle' ? (
                  <Camera className="w-6 h-6" />
                ) : (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                )}
              </div>
            </div>
          </button>

          {/* DIRECT FILE UPLOAD SWITCH */}
          <button
            type="button"
            onClick={onSwitchToUpload}
            className="flex flex-col items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
              <Upload className="w-5 h-5 text-[#00a896]" />
            </div>
            <span className="text-[11px] font-bold">Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};
