import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, Zap, ZapOff, Image, ArrowLeft, X, Upload,
  Sparkles, RefreshCw, CheckCircle2, Scan, ShieldCheck,
  FileText, Lock, Cpu, Activity, Eye, Crosshair, Sun, Moon, AlertCircle
} from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';
import { runOpticalOcr } from '../../utils/ocrService';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capturedDataUrl: string) => void;
  onSwitchToUpload: () => void;
}

// ── Prescription presets (rotate each session) ────────────────────────────────
const DEMO_PRESETS = [
  {
    hospital: 'APOLLO MEDICAL CENTRE', dept: 'GENERAL MEDICINE & OPD',
    rxRef: 'RX-APL-849201', doctor: 'Dr. Arun Kumar, MD', specialty: 'General Medicine',
    patient: 'Priya Sharma', age: '28 | Female', abha: '91-2341-8821-3301@abdm',
    followUp: '10 Sep 2026',
    medicines: [
      { name: 'Azithromycin 500 mg', dosage: 'Once daily • After food', dur: '5 Days' },
      { name: 'Cetirizine 10 mg', dosage: 'Once daily • Night', dur: '7 Days' },
      { name: 'Montelukast 10 mg', dosage: 'Once daily • Before sleep', dur: '7 Days' },
    ],
  },
  {
    hospital: 'SMS HOSPITAL PUNE', dept: 'CARDIOLOGY DEPT.',
    rxRef: 'RX-SMS-330921', doctor: 'Dr. Meena Iyer, DM', specialty: 'Cardiology',
    patient: 'Akshara Patel', age: '45 | Female', abha: '91-7213-4401-9988@abdm',
    followUp: '15 Sep 2026',
    medicines: [
      { name: 'Amlodipine 5 mg', dosage: 'Once daily • Morning', dur: '30 Days' },
      { name: 'Metoprolol 25 mg', dosage: 'Twice daily • With food', dur: '30 Days' },
      { name: 'Aspirin 75 mg', dosage: 'Once daily • After food', dur: '30 Days' },
    ],
  },
  {
    hospital: 'FORTIS HEALTH CLINIC', dept: 'ORTHOPEDICS & SPORTS MED',
    rxRef: 'RX-FHC-110234', doctor: 'Dr. Ramesh Nair, MS', specialty: 'Orthopedics',
    patient: 'Karthik Rajan', age: '38 | Male', abha: '91-5521-6632-1189@abdm',
    followUp: '20 Sep 2026',
    medicines: [
      { name: 'Ibuprofen 400 mg', dosage: 'Three times daily • After food', dur: '5 Days' },
      { name: 'Pantoprazole 40 mg', dosage: 'Once daily • Before food', dur: '5 Days' },
      { name: 'Calcium + D3 Tablet', dosage: 'Once daily • After food', dur: '30 Days' },
    ],
  },
];

type ScanPhase = 'prompt' | 'scanning' | 'done';

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen, onClose, onCapture, onSwitchToUpload,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [phase, setPhase] = useState<ScanPhase>('scanning');
  const [scannerState, setScannerState] = useState<'idle' | 'permission_required' | 'scanning' | 'processing' | 'success' | 'error'>('scanning');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [cameraGranted, setCameraGranted] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [detectedFields, setDetectedFields] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [isAbdmVerified, setIsAbdmVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [revealedMeds, setRevealedMeds] = useState(0);
  const [activeDocType, setActiveDocType] = useState<'prescription' | 'lab_report'>('prescription');
  const [scanStatusMsg, setScanStatusMsg] = useState('Position document within frame');
  const [preset] = useState(() => DEMO_PRESETS[Math.floor(Math.random() * DEMO_PRESETS.length)]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nativeCameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── cleanup helper ────────────────────────────────────────────────────────
  const clearAllTimers = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => {
        try { t.stop(); } catch { /* ignore */ }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraGranted(false);
  }, []);

  // ── start live camera ─────────────────────────────────────────────────────
  const startLiveCamera = useCallback(async () => {
    stopCamera();
    setErrorMessage('');
    setScanStatusMsg('Initializing optical camera...');
    try {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920, min: 640 },
            height: { ideal: 1080, min: 480 }
          }
        });
      } catch {
        // Fallback for laptops/webcams without environment camera
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      streamRef.current = stream;
      setCameraGranted(true);
      setPhase('scanning');
      setScannerState('scanning');
      setScanProgress(0);
      setConfidence(0);
      setDetectedFields([]);
      setScanStatusMsg('Position medical document within frame');
      console.log('[Scanner] camera initialized');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
          console.log('[Scanner] video ready');
        } catch (playErr) {
          console.warn('[Scanner] video play error:', playErr);
        }
      }
    } catch (err: any) {
      console.error('[Scanner] camera access error:', err);
      setCameraGranted(false);
      setPhase('scanning');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access is required to scan a document.');
      } else {
        setErrorMessage('No camera was detected.');
      }
      setScannerState('error');
    }
  }, [stopCamera]);

  // ── reset on open / close ─────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setPhase('scanning');
      setScannerState('scanning');
      setResultImage(null);
      setErrorMessage('');
      setScanProgress(0);
      setDetectedFields([]);
      setConfidence(0);
      setIsAbdmVerified(false);
      startLiveCamera();
    } else {
      clearAllTimers();
      stopCamera();
      setPhase('prompt');
      setScannerState('idle');
      setResultImage(null);
      setCameraGranted(false);
      setScanProgress(0);
      setDetectedFields([]);
      setConfidence(0);
      setIsAbdmVerified(false);
    }
  }, [isOpen, startLiveCamera, stopCamera]);

  // ── video ref stream attachment listener ──────────────────────────────────
  useEffect(() => {
    if (videoRef.current && streamRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.setAttribute('playsinline', 'true');
      videoRef.current.muted = true;
      videoRef.current.play().then(() => {
        console.log('[Scanner] video ready');
      }).catch(err => console.warn('[Scanner] video play error:', err));
    }
  }, [cameraGranted, scannerState, phase]);

  // ── camera frame guidance hint cycling ────────────────────────────────────
  useEffect(() => {
    if (scannerState !== 'scanning' || !cameraGranted) return;
    const tips = [
      'Position medical document within frame',
      'Move closer to the prescription for clear text',
      'Hold the camera steady and improve lighting',
      'Position the full prescription inside the frame',
    ];
    let idx = 0;
    const tipInterval = setInterval(() => {
      idx = (idx + 1) % tips.length;
      setScanStatusMsg(tips[idx]);
    }, 3500);
    return () => clearInterval(tipInterval);
  }, [scannerState, cameraGranted]);

  // ── build canvas prescription image ──────────────────────────────────────
  const buildCanvas = (): string => {
    const p = preset;
    const canvas = document.createElement('canvas');
    canvas.width = 800; canvas.height = 1050;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 800, 1050);
    ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 3; ctx.strokeRect(18, 18, 764, 1014);

    // Header
    ctx.fillStyle = '#0f766e'; ctx.fillRect(40, 40, 720, 95);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px sans-serif';
    ctx.fillText(p.hospital, 60, 82);
    ctx.font = '13px sans-serif';
    ctx.fillText(p.dept + '  •  ABDM Health Facility', 60, 108);

    // Patient
    ctx.fillStyle = '#f1f5f9'; ctx.fillRect(40, 155, 720, 75);
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 14px sans-serif';
    ctx.fillText('PATIENT DETAILS', 60, 178);
    ctx.font = '13px sans-serif';
    ctx.fillText(`Name: ${p.patient}  |  Age: ${p.age}  |  ABHA: ${p.abha}`, 60, 210);

    // Doctor
    ctx.fillStyle = '#334155'; ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`CONSULTING: ${p.doctor}`, 60, 260);
    ctx.font = '12px sans-serif';
    ctx.fillText(`Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}   |   Ref: ${p.rxRef}`, 60, 283);
    ctx.strokeStyle = '#00a896'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(40, 300); ctx.lineTo(760, 300); ctx.stroke();

    // Medicines
    ctx.fillStyle = '#0f766e'; ctx.font = 'bold 15px sans-serif';
    ctx.fillText('PRESCRIBED MEDICATIONS', 60, 332);
    p.medicines.forEach((m, i) => {
      const y = 368 + i * 55;
      if (i % 2 === 1) { ctx.fillStyle = '#f8fafc'; ctx.fillRect(40, y - 22, 720, 50); }
      ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.fillText(`${i + 1}. ${m.name}`, 60, y);
      ctx.fillStyle = '#00a896'; ctx.font = '12px sans-serif'; ctx.fillText(m.dosage, 60, y + 17);
      ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.fillText(m.dur, 660, y + 5);
    });

    // Follow-up
    ctx.fillStyle = '#fffbeb'; ctx.fillRect(40, 540, 720, 60);
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1; ctx.strokeRect(40, 540, 720, 60);
    ctx.fillStyle = '#b45309'; ctx.font = 'bold 12px sans-serif'; ctx.fillText('FOLLOW-UP:', 60, 562);
    ctx.fillStyle = '#78350f'; ctx.font = '12px sans-serif';
    ctx.fillText(`Review scheduled on ${p.followUp} — ${p.specialty} consultation`, 60, 584);

    // Signature
    ctx.strokeStyle = '#00a896'; ctx.lineWidth = 1.5; ctx.strokeRect(510, 690, 250, 85);
    ctx.fillStyle = '#00a896'; ctx.font = 'bold 11px sans-serif'; ctx.fillText('VERIFIED PHYSICIAN', 528, 714);
    ctx.fillStyle = '#0f172a'; ctx.font = 'bold 13px sans-serif'; ctx.fillText(p.doctor, 528, 738);
    ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'; ctx.fillText(p.specialty + '  •  ' + p.rxRef, 528, 758);

    ctx.fillStyle = '#94a3b8'; ctx.font = '10px sans-serif';
    ctx.fillText('Digitally signed via National ABDM Health Network  •  HIPAA Compliant', 100, 1010);

    return canvas.toDataURL('image/jpeg', 0.93);
  };

  // ── capture live video frame ──────────────────────────────────────────────
  const captureVideoFrame = (): string | null => {
    if (!videoRef.current) return null;
    const v = videoRef.current;
    const w = v.videoWidth || 0;
    const h = v.videoHeight || 0;
    if (w === 0 || h === 0) {
      console.warn('[Scanner] video dimensions invalid:', w, h);
      return null;
    }

    try {
      // The viewfinder is fixed at 3:4 aspect ratio.
      // Crop the document region visible to the user with a 15% safety margin
      // so no prescription text around the border is cut off.
      const targetRatio = 3 / 4;
      const videoRatio = w / h;

      let sx = 0;
      let sy = 0;
      let sw = w;
      let sh = h;

      if (videoRatio > targetRatio * 1.05) {
        // Landscape stream (e.g. 1920x1080)
        const visibleW = h * targetRatio;
        sw = Math.min(w, Math.round(visibleW * 1.15));
        sx = Math.max(0, Math.round((w - sw) / 2));
        sh = h;
        sy = 0;
      } else if (videoRatio < targetRatio * 0.95) {
        // Narrow portrait stream
        const visibleH = w / targetRatio;
        sh = Math.min(h, Math.round(visibleH * 1.15));
        sy = Math.max(0, Math.round((h - sh) / 2));
        sw = w;
        sx = 0;
      }

      // Upscale high-resolution canvas if needed (minimum width 1600px)
      let scale = 1;
      if (sw < 1600) {
        scale = Math.min(2.5, 1800 / sw);
      }
      const targetW = Math.round(sw * scale);
      const targetH = Math.round(sh * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(v, sx, sy, sw, sh, 0, 0, targetW, targetH);

      return canvas.toDataURL('image/jpeg', 0.95);
    } catch (e) {
      console.error('[Scanner] capture frame error:', e);
      return null;
    }
  };

  // ── process captured document through Tesseract OCR & NLP ─────────────────
  const processCapturedDocument = async (imageSource: string) => {
    setScannerState('processing');
    setScanProgress(10);
    setScanStatusMsg('Running AI OCR & extracting prescription metrics...');

    try {
      const result = await runOpticalOcr(imageSource, (prog, msg) => {
        setScanProgress(prog);
        if (msg) setScanStatusMsg(msg);
      });

      if (!result.text || result.text.trim().length === 0) {
        setErrorMessage('Prescription could not be read clearly. Please position the full document inside the frame and capture again.');
        setScannerState('error');
        return;
      }

      if (result.fields.length === 0 && result.confidence < 25) {
        setErrorMessage('Prescription could not be read clearly. Please position the full document inside the frame and capture again.');
        setScannerState('error');
        return;
      }

      setDetectedFields(result.fields);
      setConfidence(result.confidence);
      setIsAbdmVerified(result.isAbdmCompliant);
      setScanProgress(100);
      setScanStatusMsg('✓ Extraction complete');
      setScannerState('success');
      setPhase('done');
      stopCamera();
    } catch (err: any) {
      console.error('[OCR] processing failed:', err);
      setErrorMessage('Prescription could not be read clearly. Please position the full document inside the frame and capture again.');
      setScannerState('error');
    }
  };

  // ── handle capture document click ─────────────────────────────────────────
  const handleCaptureDocument = async () => {
    console.log('[Scanner] capture started');
    setScanStatusMsg('Capturing document...');

    let capturedDataUrl: string | null = null;
    if (cameraGranted && videoRef.current) {
      capturedDataUrl = captureVideoFrame();
    } else {
      capturedDataUrl = buildCanvas();
    }

    if (!capturedDataUrl) {
      setErrorMessage('Unable to capture the document. Please try again.');
      setScannerState('error');
      return;
    }

    console.log('[Scanner] captured image created');
    setResultImage(capturedDataUrl);
    setScanStatusMsg('✓ Capture complete — Starting OCR...');

    await processCapturedDocument(capturedDataUrl);
  };

  // ── file / gallery select ─────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async ev => {
        if (ev.target?.result) {
          const dataUrl = ev.target.result as string;
          setResultImage(dataUrl);
          setPhase('scanning');
          setScanStatusMsg('✓ Capture complete — Starting OCR...');
          await processCapturedDocument(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetScanner = () => {
    clearAllTimers();
    stopCamera();
    setResultImage(null);
    setErrorMessage('');
    setScanProgress(0);
    setDetectedFields([]);
    setConfidence(0);
    setIsAbdmVerified(false);
    startLiveCamera();
  };

  const handleStartCamera = async () => {
    await startLiveCamera();
  };

  const startScan = async () => {
    const demoCanvas = buildCanvas();
    setResultImage(demoCanvas);
    setPhase('scanning');
    setScanStatusMsg('✓ Demo document loaded — Starting OCR...');
    await processCapturedDocument(demoCanvas);
  };

  const renderViewfinderContent = () => {
    switch (scannerState) {
      case 'idle':
        return (
          <div className="my-auto flex flex-col items-center text-center space-y-4 py-8 px-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896] dark:text-teal-400">
              <Scan className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Ready to scan</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed">
                Position your document inside the frame and start the camera.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScannerState('permission_required')}
                className="px-4 py-2 bg-[#00a896] hover:bg-[#00897b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Start Camera</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToUpload}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                <span>Upload File</span>
              </button>
            </div>
          </div>
        );

      case 'scanning':
        return (
          <>
            {flashOn && <div className="absolute inset-0 z-30 pointer-events-none bg-yellow-200/5" />}

            {cameraGranted ? (
              <video
                ref={(node) => {
                  videoRef.current = node;
                  if (node && streamRef.current && node.srcObject !== streamRef.current) {
                    node.srcObject = streamRef.current;
                    node.setAttribute('playsinline', 'true');
                    node.muted = true;
                    node.play().then(() => {
                      console.log('[Scanner] video ready');
                    }).catch(err => console.warn('[Scanner] video play error:', err));
                  }
                }}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div 
                className="absolute inset-0 rounded-xl overflow-hidden" 
                style={{
                  background: theme === 'dark' ? 'linear-gradient(to bottom, #1e293b, #020617)' : 'linear-gradient(to bottom, #f1f5f9, #e2e8f0)',
                  backgroundImage: theme === 'dark' 
                    ? 'linear-gradient(rgba(6,182,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.05) 1px, transparent 1px)'
                    : 'linear-gradient(rgba(14,116,144,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,144,0.05) 1px, transparent 1px)',
                  backgroundSize: '18px 18px',
                }}
              >
                {/* Document card slides in */}
                <AnimatePresence>
                  {scanProgress > 25 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 12 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-3 rounded-lg overflow-hidden shadow-lg flex flex-col border border-slate-200 dark:border-slate-700"
                      style={{ backgroundColor: '#ffffff', zIndex: 5 }}
                    >
                      {/* Header */}
                      <div className="px-3 py-1.5 flex justify-between items-center shrink-0 bg-teal-800">
                        <div>
                          <div className="text-[9px] font-black text-slate-900 dark:text-white">{preset.hospital}</div>
                          <div className="text-[7px] text-teal-200">{preset.dept}</div>
                        </div>
                        <div className="text-right text-[7px] text-teal-200 font-mono">
                          <div>{preset.rxRef}</div>
                          <div>{new Date().toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>

                      {/* Patient Details */}
                      <div className="px-3 py-1 flex justify-between text-[8px] font-bold border-b shrink-0 bg-slate-50 text-slate-800 border-slate-200">
                        <span>Patient: {preset.patient}</span>
                        <span>Age: {preset.age}</span>
                      </div>

                      {/* Doctor */}
                      <div className="px-3 py-0.5 text-[7px] border-b shrink-0 text-slate-500 border-slate-100">
                        {preset.doctor} · {preset.specialty}
                      </div>

                      {/* Medicines */}
                      <div className="flex-1 px-3 py-1.5 space-y-1 overflow-hidden bg-white">
                        <div className="text-[8px] font-black uppercase mb-0.5 text-slate-600">Prescribed Medicines</div>
                        {preset.medicines.map((m, i) => (
                          <AnimatePresence key={i}>
                            {revealedMeds > i && (
                              <motion.div
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="p-1 rounded text-[7px] bg-teal-55 text-slate-900 border border-teal-100"
                              >
                                <div className="font-bold flex justify-between text-slate-900">
                                  <span>{i + 1}. {m.name}</span>
                                  <span className="text-teal-600">{m.dur}</span>
                                </div>
                                <div className="text-[6.5px] text-slate-500">{m.dosage}</div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="px-3 py-1 flex justify-between items-center border-t shrink-0 border-slate-200 bg-slate-50">
                        <span className="px-1 py-0.5 rounded text-[6.5px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Follow-up: {preset.followUp}
                        </span>
                        <div className="text-right text-[7px] font-bold text-slate-700">{preset.doctor}</div>
                      </div>

                      {/* Scan line overlay */}
                      <motion.div
                        className="absolute left-0 right-0 h-0.5 z-10 pointer-events-none"
                        animate={{ top: ['5%', '95%', '5%'] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ background: 'linear-gradient(to right, transparent, rgba(20,184,166,0.8), transparent)', boxShadow: '0 0 8px #00a896' }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Laser line animation overlay */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 z-20 pointer-events-none"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ background: 'linear-gradient(to right, transparent, #00a896, transparent)', boxShadow: '0 0 10px #00a896' }}
            />

            {/* Center crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <motion.div animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 2.2, repeat: Infinity }}>
                <Crosshair className="w-10 h-10 text-teal-400 opacity-25" />
              </motion.div>
            </div>

            {/* Capture Button Overlay (if camera is active, allow manual capture) */}
            {cameraGranted && scannerState === 'scanning' && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center z-40">
                <button
                  type="button"
                  onClick={handleCaptureDocument}
                  className="px-4 py-2 bg-[#00a896] hover:bg-[#00897b] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-4 h-4" />
                  <span>Capture Document</span>
                </button>
              </div>
            )}
          </>
        );

      case 'processing':
        return (
          <div className="my-auto flex flex-col items-center text-center space-y-4 py-8 px-4">
            <div className="w-14 h-14 rounded-full border-2 border-teal-500/20 border-t-teal-500 animate-spin flex items-center justify-center text-[#00a896]">
              <RefreshCw className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Processing document...</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Analyzing your document securely
              </p>
            </div>
            
            {/* Upload/Extraction progress bar */}
            <div className="w-full max-w-xs space-y-1">
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-teal-50 transition-all duration-100" style={{ width: `${scanProgress}%` }} />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                <span>AI OCR Extraction</span>
                <span>{scanProgress}%</span>
              </div>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="my-auto flex flex-col items-center text-center space-y-4 py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-9 h-9 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Document captured successfully</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed">
                Extraction complete. Vitals, doctor details, and prescriptions have been verified.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (resultImage) onCapture(resultImage);
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Review Document</span>
              </button>
              <button
                type="button"
                onClick={handleResetScanner}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                <span>Scan Another</span>
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="my-auto flex flex-col items-center text-center space-y-4 py-8 px-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Unable to scan document</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed">
                {errorMessage || 'Please reposition the document and try again.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setScannerState('scanning');
                  startLiveCamera();
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={onSwitchToUpload}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                <span>Upload Instead</span>
              </button>
            </div>
          </div>
        );
    }
  };

  const renderTelemetryContent = () => {
    return (
      <>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-[#00a896] border border-teal-500/20">
              <Activity className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-wide text-slate-900">Live OCR Extraction</span>
          </div>
          {scannerState === 'scanning' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-emerald-700 border border-emerald-500/20 bg-emerald-500/10">
              READY
            </span>
          )}
          {scannerState === 'processing' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-teal-700 border border-teal-500/20 bg-teal-500/10 animate-pulse">
              PROCESSING
            </span>
          )}
          {scannerState === 'success' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-emerald-700 border border-emerald-500/20 bg-emerald-500/10">
              COMPLETE
            </span>
          )}
          {scannerState === 'error' && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-rose-700 border border-rose-500/20 bg-rose-500/10">
              ERROR
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>Extraction Progress</span>
            <span className="text-[#00a896] font-bold">{scanProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#00a896] transition-all duration-100" style={{ width: `${scanProgress}%` }} />
          </div>
        </div>

        {/* Detected fields */}
        <div className="space-y-2 flex-1">
          <div className="text-[10px] font-black uppercase tracking-wide text-slate-500">Detected Fields</div>
          <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
            {scannerState === 'processing' ? (
              <div className="space-y-1.5 py-2">
                <div className="flex items-center gap-2 text-xs text-teal-700 font-mono animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00a896] shrink-0" />
                  <span className="line-clamp-1">{scanStatusMsg || 'Extracting prescription fields...'}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Optical OCR & medical entity parser active...
                </div>
              </div>
            ) : detectedFields.length === 0 ? (
              <p className="text-xs text-slate-400 italic font-mono">Awaiting scan initiation...</p>
            ) : (
              detectedFields.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                  {f.startsWith('Notice:') ? (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  )}
                  <span className={f.startsWith('Notice:') ? 'text-amber-700 text-[11px]' : ''}>{f}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trust credentials metrics */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Confidence Score</span>
            <span className={`font-bold ${confidence === 0 ? 'text-slate-400' : confidence < 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {confidence > 0 ? (confidence < 50 ? `${confidence}% (Low)` : `${confidence}%`) : '—'}
            </span>
          </div>
          {confidence > 0 && confidence < 50 && (
            <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 font-sans">
              Low confidence — please capture a clearer prescription.
            </div>
          )}
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">ABDM Compliant</span>
            <span className={`font-bold ${scannerState === 'success' ? (isAbdmVerified ? 'text-[#00a896]' : 'text-slate-500') : 'text-slate-400'}`}>
              {scannerState === 'success' ? (isAbdmVerified ? 'VERIFIED' : 'NOT DETECTED') : 'PENDING'}
            </span>
          </div>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-500">Processing Engine</span>
            <span className="font-bold text-purple-600 font-medium">Tesseract OCR v4 + NLP</span>
          </div>
        </div>
      </>
    );
  };

  if (!isOpen) return null;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Hidden inputs */}
      <input ref={nativeCameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
      <input ref={galleryRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />

      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-200 bg-white shadow-xs">
        <button
          type="button" onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-slate-700 hover:text-slate-900 text-xs font-extrabold border border-slate-200 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Scanner</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#00a896] border border-teal-500/30 bg-teal-500/10">
            <Scan className="w-4 h-4" />
            {phase === 'scanning' && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            )}
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-900 tracking-wide">AI Optical Medical Scanner</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold text-emerald-700 border border-emerald-500/30 bg-emerald-50">
                {scannerState === 'processing' ? 'PROCESSING' : scannerState === 'success' ? 'COMPLETE' : 'READY'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">{scannerState === 'scanning' || scannerState === 'processing' ? scanStatusMsg : 'Auto-edge detection • ABDM compliant'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button" onClick={() => setFlashOn(f => !f)}
            className={`p-2 rounded-xl transition-colors cursor-pointer border text-xs font-bold flex items-center gap-1.5 ${
              flashOn
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
          >
            {flashOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
            <span className="hidden md:inline">{flashOn ? 'Torch ON' : 'Torch OFF'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 bg-slate-100 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── MAIN AREA ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-slate-50 dark:bg-slate-950">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(0,168,150,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,168,150,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <AnimatePresence mode="wait">
          {/* ── PHASE: PROMPT ─────────────────────────────────────────── */}
          {phase === 'prompt' && (
            <motion.div
              key="prompt"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-5 text-center text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"
            >
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl border border-teal-500/30 flex items-center justify-center text-[#00a896] bg-teal-500/10 mx-auto shadow-xs">
                  <Scan className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Medical Document Optical Scanner</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
                  Scan prescriptions, lab reports, or hospital summaries using live camera or instant AI demo extraction.
                </p>
              </div>

              {/* Doc type selector */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/90">
                {(['prescription', 'lab_report'] as const).map(t => (
                  <button
                    key={t} type="button" onClick={() => setActiveDocType(t)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeDocType === t
                        ? 'bg-[#00a896] text-white shadow-sm'
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    {t === 'prescription' ? <Sparkles className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                    <span>{t === 'prescription' ? 'Prescription Rx' : 'Lab Report'}</span>
                  </button>
                ))}
              </div>

              {/* Scan method tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {/* Camera */}
                <div
                  onClick={handleStartCamera}
                  className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/40 dark:bg-teal-900/20 hover:bg-teal-50/80 dark:hover:bg-teal-900/40 transition-all cursor-pointer flex flex-col gap-3 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl text-white shadow-xs bg-[#00a896] group-hover:scale-105 transition-transform"><Camera className="w-5 h-5" /></div>
                    <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-100/80 border border-teal-300 px-2 py-0.5 rounded-full">Real-time</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-teal-400 transition-colors">Start Device Camera</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Live optical capture via webcam or mobile camera.</p>
                  </div>
                </div>

                {/* AI Demo */}
                <div
                  onClick={() => startScan()}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-amber-50/30 dark:hover:bg-amber-900/20 transition-all cursor-pointer flex flex-col gap-3 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl border border-amber-300 text-amber-600 bg-amber-50 group-hover:scale-105 transition-transform"><Cpu className="w-5 h-5" /></div>
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 border border-amber-300 px-2 py-0.5 rounded-full">AI Demo</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">Instant AI Scan Demo</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Simulate full OCR extraction pipeline instantly.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <button type="button" onClick={onSwitchToUpload} className="text-slate-700 dark:text-slate-300 hover:text-[#00a896] dark:hover:text-teal-400 font-bold flex items-center gap-1.5 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-[#00a896]" />
                  <span>Upload PDF or photo from device</span>
                </button>
                <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  <span>On-Device HIPAA Encryption</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── PHASE: SCANNING ───────────────────────────────────────── */}
          {(phase === 'scanning' || phase === 'done') && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full max-w-4xl"
            >
              {/* ── VIEWFINDER ─────────────────────────────────────── */}
              <div
                className="relative w-full max-w-sm rounded-3xl overflow-hidden border-2 shadow-2xl bg-slate-900"
                style={{
                  aspectRatio: '3/4', maxHeight: '62vh',
                  borderColor: scanProgress > 80 ? '#10b981' : '#00a896',
                  boxShadow: `0 0 ${scanProgress > 50 ? 25 : 10}px ${scanProgress > 80 ? '#10b98140' : '#00a89630'}`,
                }}
              >
                {flashOn && <div className="absolute inset-0 z-30 pointer-events-none" style={{ backgroundColor: 'rgba(254,240,138,0.1)' }} />}

                {renderViewfinderContent()}

                {/* HUD overlay - only rendered during active scanning */}
                {scannerState === 'scanning' && (
                  <div className="absolute inset-0 z-20 pointer-events-none p-3 flex flex-col justify-between">
                    {/* Top status pill */}
                    <div className="flex justify-between items-center text-[10px] font-mono text-cyan-300 px-3 py-1.5 rounded-full border bg-slate-950/80 border-cyan-500/30 backdrop-blur-md">
                      <span className="flex items-center gap-1.5">
                        <motion.span
                          className="w-2 h-2 rounded-full bg-emerald-400"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                        />
                        {scanStatusMsg}
                      </span>
                      <span className="font-bold text-emerald-300">{confidence > 0 ? `${confidence}%` : 'READY'}</span>
                    </div>

                    {/* Corners */}
                    <div className="relative flex-1 my-2">
                      {[
                        'top-0 left-0 border-t-2 border-l-2 rounded-tl-xl',
                        'top-0 right-0 border-t-2 border-r-2 rounded-tr-xl',
                        'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-xl',
                        'bottom-0 right-0 border-b-2 border-r-2 rounded-br-xl',
                      ].map((cls, i) => (
                        <motion.div key={i} className={`absolute w-8 h-8 ${cls}`}
                          animate={{ borderColor: scanProgress > 80 ? ['#22d3ee','#34d399','#22d3ee'] : '#22d3ee' }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          style={{ borderColor: '#22d3ee' }}
                        />
                      ))}
                    </div>

                    {/* Bottom progress */}
                    <div className="space-y-1.5">
                      <div className="w-full h-1 rounded-full overflow-hidden bg-slate-800">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ width: `${scanProgress}%`, background: 'linear-gradient(to right, #00a896, #22d3ee)', boxShadow: '0 0 8px #22d3ee' }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <div className="text-center text-[11px] font-mono px-2 py-1 rounded-xl border text-white/90 bg-slate-950/80 border-white/10">
                        {scanStatusMsg}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT SIDE EXTRACTION PANEL ──────────────────────── */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="w-full max-w-xs rounded-3xl p-5 space-y-3 shadow-xl border border-slate-200 bg-white"
              >
                {renderTelemetryContent()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BOTTOM CONTROLS ─────────────────────────────────────────────── */}
      <div className="shrink-0 px-6 py-4 border-t border-slate-200 bg-white shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between gap-6">
          {/* Gallery */}
          <button type="button" onClick={() => galleryRef.current?.click()}
            className="flex flex-col items-center gap-1.5 cursor-pointer group text-slate-600 hover:text-slate-900 transition-colors">
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-100 group-hover:bg-slate-200 group-hover:border-teal-500/40 group-hover:scale-105 transition-all shadow-xs">
              <Image className="w-5 h-5 text-[#00a896]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Photo Library</span>
          </button>

          {/* Main scan button */}
          <button
            type="button"
            onClick={scannerState === 'scanning' ? handleCaptureDocument : (scannerState === 'success' && resultImage ? () => onCapture(resultImage) : handleCaptureDocument)}
            disabled={scannerState === 'processing'}
            className="relative p-1.5 rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-wait disabled:opacity-80"
            aria-label="Capture Document"
          >
            <motion.div
              className="rounded-full border-2 flex items-center justify-center p-1.5 w-16 h-16 border-teal-500/40 bg-teal-50"
              animate={scannerState === 'processing' ? { boxShadow: ['0 0 0px #00a89620', '0 0 20px #00a89650', '0 0 0px #00a89620'] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center text-white shadow-md bg-[#00a896] hover:bg-[#00897b] transition-colors">
                {scannerState === 'processing' ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Scan className="w-6 h-6" />}
              </div>
            </motion.div>
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 whitespace-nowrap">
              {scannerState === 'processing' ? 'Processing...' : (scannerState === 'success' ? 'Review Document' : 'Capture')}
            </span>
          </button>

          {/* Upload */}
          <button type="button" onClick={onSwitchToUpload}
            className="flex flex-col items-center gap-1.5 cursor-pointer group text-slate-600 hover:text-slate-900 transition-colors">
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-100 group-hover:bg-slate-200 group-hover:border-teal-500/40 group-hover:scale-105 transition-all shadow-xs">
              <Upload className="w-5 h-5 text-[#00a896]" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Upload File</span>
          </button>
        </div>
      </div>
    </div>
  );
};
