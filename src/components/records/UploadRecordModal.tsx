import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle2, FilePlus, Scan } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: (newRecord: Partial<MedicalRecordItem>) => void;
  onAddRecord?: (newRecord: MedicalRecordItem) => void;
  onNavigateScan: () => void;
}

export const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  onAddRecord,
  onNavigateScan
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MedicalRecordItem['type']>('Lab Report');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  const [doctor, setDoctor] = useState('Dr. Rajesh Kumar');
  const [hospital, setHospital] = useState('Apollo Hospital');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "));
      setStep(2);
    }
  };

  const handleSimulateDrop = () => {
    setFileName('CBC_Blood_Panel_Aug2026.pdf');
    setFileSize('2.4 MB');
    setTitle('Complete Blood Count (CBC) Panel');
    setType('Lab Report');
    setStep(2);
  };

  const handleStartUpload = () => {
    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const rec: MedicalRecordItem = {
              id: `REC-${Date.now().toString().slice(-6)}`,
              title: title || 'Medical Record Document',
              type: type || 'Lab Report',
              date: date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              timestamp: Date.now(),
              doctor: doctor || 'Dr. Arun Kumar',
              hospital: hospital || 'Apollo Hospital',
              status: 'Normal',
              fileName: fileName || 'document.pdf',
              fileSize: fileSize || '2.4 MB',
              notes: notes || undefined
            };
            if (onAddRecord) onAddRecord(rec);
            if (onUploadComplete) onUploadComplete(rec);
            onClose();
          }, 300);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-white space-y-5 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 text-[#00a896] dark:text-cyan-300 border border-teal-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Upload Medical Record</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Step {step} of 2 • Secure ABDM Document Vault</p>
            </div>
          </div>

          {isUploading ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto animate-bounce text-[#00a896] dark:text-cyan-300">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Uploading Document...</h4>

              {/* PROGRESS BAR */}
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden max-w-xs mx-auto">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-[#00a896] to-cyan-400 rounded-full transition-all duration-200"
                />
              </div>
              <span className="text-xs font-black text-[#00a896] dark:text-cyan-300">{progress}%</span>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4 text-xs">
              {/* DRAG AND DROP ZONE */}
              <div
                onClick={handleSimulateDrop}
                className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-[#00a896] bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-center space-y-3 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 group-hover:text-[#00a896] group-hover:bg-teal-500/10 flex items-center justify-center mx-auto transition-all">
                  <FilePlus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Drag & drop your medical document here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">or <span className="text-[#00a896] underline font-bold">Browse files</span> from your computer</p>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                  Supported Formats: PDF, JPG, PNG (Max 25MB)
                </p>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload-input"
                />
              </div>

              {/* OR SCAN OPTION */}
              <div className="flex items-center gap-3 pt-2">
                <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">OR</span>
                <span className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              </div>

              <button
                type="button"
                onClick={() => { onClose(); onNavigateScan(); }}
                className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#00a896] dark:text-cyan-300 font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Use Camera to Scan Physical Document</span>
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleStartUpload(); }} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-200 truncate">{fileName} ({fileSize})</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#00a896] dark:text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CBC Blood Test Report"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Discharge">Discharge</option>
                    <option value="Vaccination">Vaccination</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Attending Doctor</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Apollo Hospital"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional diagnostic details..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Save Record</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
