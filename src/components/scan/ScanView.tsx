import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../ui/PageHeader';
import {
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  FolderUp,
  FileCheck,
  Scan,
  Maximize2
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
import { PrescriptionScannerTab } from './PrescriptionScannerTab';

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
  user,
  onNavigate,
}) => {
  // MAIN MODE: 'prescription' | 'general'
  const [scanMode, setScanMode] = useState<'prescription' | 'general'>('prescription');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
    const isAllowed = allowedTypes.includes(file.type) || ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'doc'].includes(extension || '');

    if (!isAllowed) {
      setFileError('Unsupported file type. Please upload a PDF, JPG, PNG, or DOC document.');
      return;
    }

    // Validate size (max 25MB)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('File size exceeds 25 MB limit.');
      return;
    }

    setSelectedFile(file);
    setFlowStep('uploading');
    simulateUpload();
  };

  // SIMULATE FILE UPLOAD PROGRESS & AI OCR PIPELINE
  const simulateUpload = () => {
    setUploadProgress(0);
    setUploadStatusText('Uploading document to secure sandbox...');

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setUploadProgress(current);

      if (current === 40) {
        setUploadStatusText('Running AI OCR & extracting health metrics...');
      } else if (current === 80) {
        setUploadStatusText('Preparing record verification form...');
      } else if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setFlowStep('info');
        }, 350);
      }
    }, 220);
  };

  // DRAG & DROP HANDLERS
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  // CAMERA CAPTURE HANDLER
  const handleCameraCapture = (dataUrl: string) => {
    setScannerOpen(false);
    setCapturedImage(dataUrl);
    setSelectedFile(null);
    if (scanMode === 'prescription') {
      // Prescription mode: skip editor, go straight to AI extraction in PrescriptionScannerTab
      showToast('✓ Scan captured. Extracting prescription data...');
    } else {
      // General mode: open editor for crop/adjust
      setFlowStep('editing');
      setEditorOpen(true);
    }
  };

  // EDITOR CONTINUE HANDLER (general mode only)
  const handleEditorContinue = (editedSrc: string) => {
    setEditorOpen(false);
    const finalImage = editedSrc || capturedImage;
    if (finalImage) {
      setCapturedImage(finalImage);
    }
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
    }, 800);
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
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16 font-sans">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#00a896] text-white font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. PAGE HEADER */}
      <PageHeader
        title="Scan & Digitization Hub"
        subtitle="Extract prescriptions into actionable reminders & pharmacy workflows, or digitize diagnostic reports."
        badgeText="Smart Health Digitizer"
        badgeIcon={<Camera className="w-3.5 h-3.5" />}
        rightElement={
          <div className="flex items-center gap-2.5 self-stretch sm:self-auto font-sans">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Upload className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
              <span>Browse File</span>
            </button>

            <button
              onClick={() => setScannerOpen(true)}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Start Scan</span>
            </button>
          </div>
        }
      />

      {/* SCAN WORKFLOW MODE TABS */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={() => setScanMode('prescription')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            scanMode === 'prescription'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Prescription Scanner & Follow-up Workflow</span>
        </button>

        <button
          type="button"
          onClick={() => setScanMode('general')}
          className={`flex-1 py-3 px-4 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            scanMode === 'general'
              ? 'bg-[#00a896] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>General Document & Report Upload</span>
        </button>
      </div>

      {scanMode === 'prescription' ? (
        <PrescriptionScannerTab
          user={user}
          capturedImage={capturedImage}
          onClearCapturedImage={() => setCapturedImage(null)}
          onNavigate={onNavigate}
          onToast={showToast}
        />
      ) : (
        <div className="space-y-6">

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* 2. MAIN EXPERIENCE CONTROLS & SUCCESS STATE */}
      {flowStep === 'success' ? (
        /* SUCCESS SCREEN */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto space-y-5 shadow-2xl font-sans"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Document Saved Successfully</h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
              Your medical document <strong className="text-[#00a896] dark:text-cyan-300">"{savedRecordTitle}"</strong> has been encrypted and added to your Medical Records database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => onNavigate('records')}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>View Medical Records</span>
            </button>

            <button
              onClick={handleResetFlow}
              className="w-full sm:w-auto py-2.5 px-5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4 text-[#00a896]" />
              <span>Scan Another Document</span>
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
        /* UNIFIED WORKSPACE: STREAMLINED SIDE-BY-SIDE DIGITIZATION HUB */
        <div className="space-y-4 font-sans">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* LEFT CARD (5 COLUMNS): SMART CAMERA SCANNER */}
            <div
              onClick={() => setScannerOpen(true)}
              className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between space-y-5 relative overflow-hidden group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896] group-hover:scale-105 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/10 text-[#00a896] border border-teal-500/20 font-mono">
                    AI Edge Detection
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#00a896] transition-colors">
                    Camera Document Scanner
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                    Auto-align and scan physical prescriptions, lab bills, discharge sheets, and medical records in seconds.
                  </p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00a896] shrink-0" />
                    <span>Auto-border cropping & deskewing</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00a896] shrink-0" />
                    <span>Instant OCR text & vitals detection</span>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScannerOpen(true);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4" />
                  <span>Start Scan</span>
                </button>
              </div>
            </div>

            {/* RIGHT CARD (7 COLUMNS): UNIFIED DRAG & DROP UPLOAD DROPZONE */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-7 rounded-3xl border-2 border-dashed p-6 transition-all duration-300 cursor-pointer shadow-xs flex flex-col justify-between text-center relative overflow-hidden group ${
                dragOver
                  ? 'border-[#00a896] bg-teal-500/10 scale-[1.01]'
                  : fileError
                  ? 'border-rose-500/50 bg-rose-500/10'
                  : 'border-slate-300 dark:border-slate-800 hover:border-purple-500/40 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {/* UPLOADING PROGRESS OVERLAY */}
              {flowStep === 'uploading' ? (
                <div className="my-auto space-y-4 py-4 max-w-sm mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] mx-auto animate-pulse">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{uploadStatusText}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{selectedFile?.name}</p>
                  </div>

                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700">
                    <motion.div
                      className="h-full bg-[#00a896] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                    <span>{uploadProgress}%</span>
                    <span>Max 25MB</span>
                  </div>
                </div>
              ) : (
                /* DEFAULT DROPZONE CONTENT */
                <div className="my-auto space-y-3.5">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto transition-transform ${
                      dragOver
                        ? 'scale-110 bg-teal-500/20 text-[#00a896]'
                        : 'bg-purple-500/10 text-purple-600 border border-purple-500/20 group-hover:scale-105'
                    }`}
                  >
                    <Upload className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Drag & Drop Medical Files
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      or click to browse digital PDF reports, lab scans, or prescriptions
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 pt-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">PDF</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">JPG</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">PNG</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">DOCX</span>
                    <span>• Max 25 MB</span>
                  </div>

                  {fileError && (
                    <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-2xs border border-slate-200 dark:border-slate-700">
                      <FolderUp className="w-3.5 h-3.5" />
                      <span>Browse from Device</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

          {/* 3 SECURITY & OCR PILLARS BANNER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-[#00a896] flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <strong className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">Instant OCR Extraction</strong>
                <span className="text-[10px] text-slate-500 font-medium block truncate">Auto-extracts vitals & lab results</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <strong className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">256-Bit Vault Security</strong>
                <span className="text-[10px] text-slate-500 font-medium block truncate">ABDM HIPAA encrypted storage</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                <FileCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <strong className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">Auto Categorization</strong>
                <span className="text-[10px] text-slate-500 font-medium block truncate">Prescriptions, labs & health claims</span>
              </div>
            </div>
          </div>

          {/* 4. RECENT UPLOADS & SCAN TIPS (GENERAL MODE ONLY) */}
          <RecentUploadsSection
            records={records}
            onNavigateRecords={() => onNavigate('records')}
            onStartScan={() => setScannerOpen(true)}
            onStartUpload={() => fileInputRef.current?.click()}
          />

          <ScanTipsSection />
        </div>
      )}

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
