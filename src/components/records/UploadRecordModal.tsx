import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Scan, FilePlus } from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface UploadRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecord: (newRecord: MedicalRecordItem) => void;
  onNavigateScan: () => void;
}

export const UploadRecordModal: React.FC<UploadRecordModalProps> = ({
  isOpen,
  onClose,
  onAddRecord,
  onNavigateScan
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [type, setType] = useState<MedicalRecordItem['type']>('Lab Report');
  const [title, setTitle] = useState('');
  const [doctor, setDoctor] = useState('');
  const [hospital, setHospital] = useState('');
  const [date, setDate] = useState('23 Aug 2026');
  const [notes, setNotes] = useState('');

  // Upload Progress simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      setStep(2);
    }
  };

  const handleSimulateDrop = () => {
    setFileName('CBC_Blood_Report_Aug2026.pdf');
    setFileSize('2.8 MB');
    setTitle('CBC Blood Test Report');
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
            onAddRecord({
              id: `REC-2026-${Math.floor(10000 + Math.random() * 90000)}`,
              title: title || 'New Health Document',
              type,
              hospital: hospital || 'Apollo Hospital',
              doctor: doctor || 'Dr. Rajesh Kumar',
              date: date || 'Today',
              timestamp: Date.now(),
              status: 'Normal',
              fileSize,
              fileName: fileName || 'Document.pdf',
              notes
            });
            setIsUploading(false);
            setStep(1);
            onClose();
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 180);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-white space-y-5 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00a896]/20 text-cyan-300 border border-teal-500/30">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Upload Medical Record</h3>
              <p className="text-xs text-slate-400">Step {step} of 2 • Secure ABDM Document Vault</p>
            </div>
          </div>

          {isUploading ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto animate-bounce text-cyan-300">
                <Upload className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-white">Uploading Document...</h4>

              {/* PROGRESS BAR */}
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden max-w-xs mx-auto">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-200"
                />
              </div>
              <span className="text-xs font-black text-cyan-300">{progress}%</span>
            </div>
          ) : step === 1 ? (
            <div className="space-y-4 text-xs">
              {/* DRAG AND DROP ZONE */}
              <div
                onClick={handleSimulateDrop}
                className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-[#00a896] bg-slate-900/50 hover:bg-slate-900 transition-all text-center space-y-3 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 flex items-center justify-center mx-auto transition-all">
                  <FilePlus className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-white">
                    Drag & drop your medical document here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">or <span className="text-[#00a896] underline font-bold">Browse files</span> from your computer</p>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
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
                <span className="h-px bg-slate-800 flex-1" />
                <span className="text-[10px] uppercase font-bold text-slate-500">OR</span>
                <span className="h-px bg-slate-800 flex-1" />
              </div>

              <button
                type="button"
                onClick={() => { onClose(); onNavigateScan(); }}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Scan className="w-4 h-4" />
                <span>Use Camera to Scan Physical Document</span>
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleStartUpload(); }} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <span className="font-bold text-slate-200 truncate">{fileName} ({fileSize})</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-cyan-400 font-bold hover:underline cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CBC Blood Test Report"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
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
                  <label className="block font-bold text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Attending Doctor</label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Hospital / Clinic</label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Apollo Hospital"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional diagnostic details..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-[#00a896]"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
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
