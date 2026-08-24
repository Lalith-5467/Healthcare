import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import type { MedicalRecordItem } from '../records/recordsData';
import { INITIAL_RECORDS } from '../records/recordsData';
import { ScannerModal } from './ScannerModal';
import { DocumentEditorModal } from './DocumentEditorModal';
import { DocumentInfoForm } from './DocumentInfoForm';
import { MultiScanModal } from './MultiScanModal';
import { CancelConfirmModal } from './CancelConfirmModal';
import { RecentUploadsSection } from './RecentUploadsSection';
import { ScanTipsSection } from './ScanTipsSection';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  abhaId: string;
  bloodGroup: string;
  age: number;
}

interface ScanViewProps {
  user?: UserProfile;
  onNavigate: (page: string) => void;
}

export const ScanView: React.FC<ScanViewProps> = ({
  user: _user,
  onNavigate,
}) => {
  // WORKFLOW STEPS: 'idle' | 'uploading' | 'editing' | 'info' | 'success'
  const [flowStep, setFlowStep] = useState<'idle' | 'uploading' | 'editing' | 'info' | 'success'>('idle');

  // MODAL STATES
  const [scannerOpen, setScannerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [multiScanOpen, setMultiScanOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // UPLOAD & FILE STATES
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('Uploading document...');
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // SAVING & RECORDS STATE
  const [isSaving, setIsSaving] = useState(false);
  const [savedRecordTitle, setSavedRecordTitle] = useState('CBC Blood Test Report');
  const [records, setRecords] = useState<MedicalRecordItem[]>(INITIAL_RECORDS);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load records from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_medical_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Helper to persist records
  const updateRecords = (newRecords: MedicalRecordItem[]) => {
    setRecords(newRecords);
    localStorage.setItem('user_medical_records', JSON.stringify(newRecords));
  };

  // FILE VALIDATION HANDLER
  const validateAndProcessFile = (file: File) => {
    setFileError(null);

    // Validate file extension
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isAllowed = allowedTypes.includes(file.type) || ['pdf', 'jpg', 'jpeg', 'png'].includes(extension || '');

    if (!isAllowed) {
      setFileError('Unsupported file type. Please upload a PDF, JPG, or PNG document.');
      return;
    }

    // Validate size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setFileError('File size exceeds 10 MB limit.');
      return;
    }

    // Start progress simulation
    setSelectedFile(file);
    setFlowStep('uploading');
    setUploadProgress(15);
    setUploadStatusText('Uploading document...');

    // Read image as Data URL if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setCapturedImage(null);
    }

    // Progress simulation
    setTimeout(() => setUploadProgress(45), 200);
    setTimeout(() => setUploadProgress(75), 450);
    setTimeout(() => {
      setUploadProgress(100);
      setUploadStatusText('Processing & Optimizing...');
    }, 700);

    setTimeout(() => {
      setFlowStep('editing');
      setEditorOpen(true);
    }, 1100);
  };

  // FILE DRAG & DROP HANDLERS
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // CAMERA SCANNER CAPTURE HANDLER
  const handleCameraCapture = (dataUrl: string) => {
    setScannerOpen(false);
    setCapturedImage(dataUrl);
    setSelectedFile(null);
    setFlowStep('editing');
    setEditorOpen(true);
  };

  // EDITOR CONTINUE HANDLER
  const handleEditorContinue = (editedSrc: string) => {
    setEditorOpen(false);
    if (editedSrc) setCapturedImage(editedSrc);
    setFlowStep('info');
  };

  // SAVE SINGLE RECORD TO LOCAL STORAGE & STATE
  const handleSaveDocument = (formData: Partial<MedicalRecordItem>) => {
    setIsSaving(true);

    const newRecord: MedicalRecordItem = {
      id: `REC-${Date.now().toString().slice(-6)}`,
      title: formData.title || 'CBC Blood Test Report',
      type: formData.type || 'Lab Report',
      hospital: formData.hospital || 'Apollo Hospital',
      doctor: formData.doctor || 'Dr. Rajesh Kumar',
      date: formData.date || '23 Aug 2026',
      timestamp: Date.now(),
      status: 'Normal',
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.4 MB',
      fileName: selectedFile ? selectedFile.name : `${(formData.title || 'Scanned_Doc').replace(/\s+/g, '_')}.pdf`,
      isImportant: true,
      notes: formData.notes
    };

    setTimeout(() => {
      const updated = [newRecord, ...records];
      updateRecords(updated);
      setSavedRecordTitle(newRecord.title);
      setIsSaving(false);
      setFlowStep('success');
    }, 1000);
  };

  // BATCH SAVE FROM MULTI SCAN
  const handleSaveMultiBatch = (batchItems: Partial<MedicalRecordItem>[]) => {
    const newItems: MedicalRecordItem[] = batchItems.map((item, idx) => ({
      id: `REC-${(Date.now() + idx).toString().slice(-6)}`,
      title: item.title || `Scanned Document #${idx + 1}`,
      type: item.type || 'Lab Report',
      hospital: item.hospital || 'Apollo Hospital',
      doctor: item.doctor || 'Dr. Rajesh Kumar',
      date: item.date || '23 Aug 2026',
      timestamp: Date.now() - idx * 1000,
      status: 'Normal',
      fileSize: item.fileSize || '1.8 MB',
      fileName: item.fileName || `Doc_Batch_${idx + 1}.pdf`,
      isImportant: true,
      notes: item.notes
    }));

    const updated = [...newItems, ...records];
    updateRecords(updated);
    setSavedRecordTitle(`${newItems.length} Batch Documents`);
    setFlowStep('success');
  };

  // RESET SCAN FLOW
  const handleResetFlow = () => {
    setSelectedFile(null);
    setCapturedImage(null);
    setFileError(null);
    setUploadProgress(0);
    setFlowStep('idle');
  };

  // BACK / CANCEL HANDLER
  const handleBackPrompt = () => {
    if (flowStep !== 'idle' && flowStep !== 'success') {
      setCancelModalOpen(true);
    } else {
      handleResetFlow();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Scan & Upload Health Records"
        subtitle="Digitize physical prescriptions, lab reports and diagnostic scans into your ABDM Vault."
        badgeText="Smart Digitizer"
        badgeIcon={<Camera className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Upload className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
              <span>Upload Document</span>
            </button>

            <button
              onClick={() => setScannerOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Document</span>
            </button>
          </div>
        }
      />

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 2. MAIN EXPERIENCE CONTROLS & SUCCESS STATE */}
      {flowStep === 'success' ? (
        /* SUCCESS SCREEN */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-white">Document Saved Successfully</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Your medical document <strong className="text-cyan-300">"{savedRecordTitle}"</strong> has been added to your Medical Records database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('records')}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Medical Records</span>
            </button>

            <button
              onClick={handleResetFlow}
              className="w-full sm:w-auto py-3 px-5 rounded-xl font-bold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              <span>Scan Another Document</span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Go to Dashboard</span>
            </button>
          </div>
        </motion.div>
      ) : flowStep === 'info' ? (
        /* DOCUMENT INFORMATION FORM */
        <DocumentInfoForm
          imageSrc={capturedImage}
          fileName={selectedFile?.name || 'Scanned_Document_Aug2026.pdf'}
          fileSize={selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '2.4 MB'}
          onBack={handleBackPrompt}
          onSave={handleSaveDocument}
          isSaving={isSaving}
        />
      ) : (
        /* WORKSPACE: SCAN OR UPLOAD DRAG-AND-DROP OPTIONS */
        <div className="space-y-8">
          {/* TWO PRIMARY CHOICE CARDS (DESKTOP: SIDE-BY-SIDE, MOBILE: STACKED) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SCAN CARD */}
            <div
              onClick={() => setScannerOpen(true)}
              className="group bg-gradient-to-br from-slate-900/90 to-slate-900/50 hover:to-teal-950/40 border border-slate-800 hover:border-teal-500/50 rounded-3xl p-8 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors" />

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#00a896]/15 border border-teal-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                    Scan Document
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Use your device camera to scan physical paper reports, prescriptions, or discharge sheets.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#00a896] group-hover:bg-teal-600 transition-colors shadow-md">
                  <Camera className="w-4 h-4" />
                  <span>Start Scan</span>
                </span>
              </div>
            </div>

            {/* UPLOAD CARD */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group bg-gradient-to-br from-slate-900/90 to-slate-900/50 hover:to-purple-950/40 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-8 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors" />

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-purple-300 transition-colors">
                    Upload File
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Select existing digital files from your phone or computer.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 group-hover:bg-purple-600 transition-colors shadow-md">
                  <Upload className="w-4 h-4" />
                  <span>Browse Files</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">PDF, JPG, PNG</span>
              </div>
            </div>
          </div>

          {/* LARGE DRAG & DROP UPLOAD AREA */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
              dragOver
                ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                : fileError
                ? 'border-rose-500/50 bg-rose-950/20'
                : 'border-slate-800 hover:border-teal-500/40 bg-slate-900/60 hover:bg-slate-900/90'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* FILE UPLOAD PROGRESS OVERLAY */}
            {flowStep === 'uploading' ? (
              <div className="max-w-md mx-auto space-y-4 py-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-cyan-400 mx-auto animate-pulse">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">{uploadStatusText}</h4>
                  <p className="text-xs text-slate-400 mt-1">{selectedFile?.name}</p>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#00a896] to-cyan-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400 font-bold">
                  <span>{uploadProgress}%</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            ) : (
              /* DEFAULT DRAG DROP PROMPT */
              <div className="max-w-md mx-auto space-y-4">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto transition-transform ${
                    dragOver ? 'scale-110 bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Upload className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">Drop your medical document here</h3>
                  <p className="text-xs text-slate-400 mt-1">or browse files from your device</p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-400">
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">PDF</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">JPG</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">JPEG</span>
                  <span className="bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">PNG</span>
                  <span>• Max 10 MB</span>
                </div>

                {/* FILE VALIDATION ERROR BANNER */}
                {fileError && (
                  <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. RECENT UPLOADS & SCAN TIPS */}
      <RecentUploadsSection
        records={records}
        onNavigateRecords={() => onNavigate('records')}
        onStartScan={() => setScannerOpen(true)}
        onStartUpload={() => fileInputRef.current?.click()}
      />

      <ScanTipsSection />

      {/* MODALS */}
      <ScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onCapture={handleCameraCapture}
        onSwitchToUpload={() => {
          setScannerOpen(false);
          fileInputRef.current?.click();
        }}
      />

      <DocumentEditorModal
        isOpen={editorOpen}
        imageSrc={capturedImage || ''}
        onRetake={() => {
          setEditorOpen(false);
          setScannerOpen(true);
        }}
        onContinue={handleEditorContinue}
        onClose={() => {
          setEditorOpen(false);
          handleResetFlow();
        }}
      />

      <MultiScanModal
        isOpen={multiScanOpen}
        onClose={() => setMultiScanOpen(false)}
        onSaveBatch={handleSaveMultiBatch}
      />

      <CancelConfirmModal
        isOpen={cancelModalOpen}
        onContinue={() => setCancelModalOpen(false)}
        onDiscard={() => {
          setCancelModalOpen(false);
          handleResetFlow();
        }}
      />
    </div>
  );
};
