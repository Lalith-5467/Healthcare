import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Camera, Upload, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface QRScannerViewProps {
  onScanSuccess: (patientId: string) => void;
}

export const QRScannerView: React.FC<QRScannerViewProps> = ({ onScanSuccess }) => {
  const { records } = useDoctorWorkflow();
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [scannedPatient, setScannedPatient] = useState<any>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDemoScan = () => {
    setIsScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      setIsScanning(false);
      setIsCameraActive(false);
      setScannedPatient(records[0]); // Abinesh Kumar
    }, 1500);
  };

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDemoScan();
    }
  };

  const handleProceed = () => {
    if (scannedPatient) {
      onScanSuccess(scannedPatient.id);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          Scan Patient QR
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Instantly access the patient's connected health record securely.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!scannedPatient ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative"
          >
            {/* Security Indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800/50">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secure Access</span>
            </div>

            {/* Scanner Area */}
            <div className="aspect-square sm:aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
              {/* Fake camera feed background */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 via-slate-900 to-black"></div>
              
              {/* Target Frame */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                {/* Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-500 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-500 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-500 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-500 rounded-br-xl"></div>
                
                {/* Scanning Laser */}
                {(isScanning || isCameraActive) && (
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute left-0 w-full h-1 bg-teal-400 shadow-[0_0_15px_3px_rgba(45,212,191,0.5)] z-10 rounded-full"
                  />
                )}

                <div className="absolute inset-0 flex items-center justify-center">
                  <Scan className={`w-16 h-16 ${isCameraActive ? 'text-teal-400' : 'text-white/20'} ${(isScanning || isCameraActive) ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 mb-6">
                Position the QR code inside the frame to scan
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleStartCamera}
                  disabled={isScanning || isCameraActive}
                  className={`flex-1 py-3 font-black rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${isCameraActive ? 'bg-teal-500/10 text-teal-600 border border-teal-500/30' : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  <Camera className="w-5 h-5" /> {isCameraActive ? 'Camera Active' : 'Start Camera'}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Upload className="w-5 h-5" /> Upload Image
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3">DEVELOPMENT / DEMO</p>
                <button 
                  onClick={handleDemoScan}
                  disabled={isScanning}
                  className="px-6 py-2 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 text-teal-600 dark:text-teal-400 font-black rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {isScanning ? 'Scanning...' : 'Use Demo Patient (Abinesh Kumar)'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-emerald-200 dark:border-emerald-800/50 shadow-xl shadow-emerald-500/5 overflow-hidden"
          >
            <div className="bg-emerald-500 text-white p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black">Patient Identified</h2>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center text-3xl font-black text-slate-500 dark:text-slate-400">
                  {scannedPatient.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{scannedPatient.name}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-sm">{scannedPatient.patientId}</span>
                    <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-lg text-sm">{scannedPatient.age}</span>
                    <span className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold rounded-lg text-sm">{scannedPatient.bloodGroup}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Known Allergies</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{scannedPatient.allergies.join(', ') || 'None'}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Last Visit</p>
                  <p className="text-sm font-black text-slate-900 dark:text-white">Aug 20, 2026</p>
                </div>
              </div>

              <button 
                onClick={handleProceed}
                className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 dark:text-white font-black rounded-xl transition-all shadow-lg shadow-teal-500/20 text-lg"
              >
                View Full Patient Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
