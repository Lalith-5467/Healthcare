import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  Building2,
  User,
  ArrowRight,
  RefreshCw,
  Clock,
  Pill,
  ShoppingBag,
  Bell,
  Eye,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  FileCheck2,
  ScanLine
} from 'lucide-react';
import type { StructuredPrescription, ExtractedMedicine } from '../../utils/prescriptionExtractor';
import {
  SAMPLE_PRESCRIPTION_PRESETS,
  extractPrescriptionData
} from '../../utils/prescriptionExtractor';
import {
  processPrescriptionConfirmation,
  getLatestWorkflowResult,
  updateReminderFollowUpStatus,
  getReminders,
} from '../../utils/healthWorkflowStorage';
import type { WorkflowConfirmationResult, ExtendedReminderItem } from '../../utils/healthWorkflowStorage';

interface PrescriptionScannerTabProps {
  user?: {
    name: string;
    email?: string;
    role?: string;
    abhaId?: string;
  };
  capturedImage?: string | null;
  onClearCapturedImage?: () => void;
  onNavigate: (module: string) => void;
  onToast: (message: string) => void;
}

export const PrescriptionScannerTab: React.FC<PrescriptionScannerTabProps> = ({
  user,
  capturedImage,
  onClearCapturedImage,
  onNavigate,
  onToast
}) => {
  // PROGRESSIVE STEPS: 1 = 'upload', 2 = 'scanning', 3 = 'review', 4 = 'success'
  const [step, setStep] = useState<'upload' | 'scanning' | 'review' | 'success'>('upload');

  // CUSTOM PATIENT NAME
  const [patientNameInput, setPatientNameInput] = useState<string>(user?.name || 'Ragul Kumar');
  const [isEditingPatientName, setIsEditingPatientName] = useState(false);

  // Sync patient name if user object updates
  useEffect(() => {
    if (user?.name) {
      setPatientNameInput(user.name);
    }
  }, [user?.name]);

  // FILE & IMAGE PREVIEW
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-arun-kumar');

  // SCANNING / OCR PROGRESS
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Initializing AI OCR Engine...');
  const [scanError, setScanError] = useState<string | null>(null);

  // EXTRACTED / EDITABLE PRESCRIPTION STATE
  const [prescriptionData, setPrescriptionData] = useState<StructuredPrescription | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<WorkflowConfirmationResult | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // LIVE LATEST WORKFLOW HUB STATE
  const [latestWorkflow, setLatestWorkflow] = useState<WorkflowConfirmationResult | null>(null);
  const [latestReminder, setLatestReminder] = useState<ExtendedReminderItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load latest workflow from localStorage on mount & listen to updates
  const syncLatestWorkflow = () => {
    const lw = getLatestWorkflowResult();
    setLatestWorkflow(lw);
    if (lw?.reminderItem) {
      const allReminders = getReminders();
      const current = allReminders.find((r) => r.id === lw.reminderItem?.id);
      if (current) {
        setLatestReminder(current);
      }
    }
  };

  useEffect(() => {
    syncLatestWorkflow();
    const handleUpdate = () => syncLatestWorkflow();
    window.addEventListener('health_workflow_updated', handleUpdate);
    return () => window.removeEventListener('health_workflow_updated', handleUpdate);
  }, []);

  // TRIGGER OCR SCANNING WITH DYNAMIC SOURCE
  const runExtractionWorkflow = async (overrideSource?: string | File | null) => {
    setStep('scanning');
    setScanProgress(10);
    setScanStatusText('Analyzing layout and optical characters...');
    setScanError(null);

    try {
      const targetSource = overrideSource || selectedFile || previewUrl || selectedPresetId;
      const targetPreset = (overrideSource || selectedFile) ? undefined : selectedPresetId;

      const extracted = await extractPrescriptionData(
        targetSource,
        targetPreset,
        (statusText, percent) => {
          setScanStatusText(statusText);
          setScanProgress(percent);
        },
        patientNameInput.trim() || user?.name || 'Patient'
      );

      setPrescriptionData(extracted);
      if (extracted.patientName) {
        setPatientNameInput(extracted.patientName);
      }
      setStep('review');
      onToast('✓ Prescription data extracted. Review details before confirmation.');
    } catch (err) {
      console.error(err);
      setScanError('Unable to parse document automatically. You can complete the fields manually.');
      setStep('review');
    }
  };

  // AUTO TRIGGER WHEN CAPTURED IMAGE IS PASSED FROM CAMERA / CROPPER
  useEffect(() => {
    if (capturedImage) {
      setPreviewUrl(capturedImage);
      setSelectedFile(null);
      setSelectedPresetId('');
      runExtractionWorkflow(capturedImage);
    }
  }, [capturedImage]);

  // FILE SELECTION HANDLER
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedPresetId('');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setScanError(null);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanError(null);
  };

  // TRIGGER OCR SCANNING
  const handleStartScan = () => {
    runExtractionWorkflow();
  };

  // EDIT HANDLERS FOR EXTRACTED MEDICINES
  const handleMedicineChange = (
    medId: string,
    field: keyof ExtractedMedicine,
    value: string | number
  ) => {
    if (!prescriptionData) return;
    setPrescriptionData({
      ...prescriptionData,
      medicines: prescriptionData.medicines.map((m) =>
        m.id === medId ? { ...m, [field]: value } : m
      )
    });
  };

  const handleAddMedicine = () => {
    if (!prescriptionData) return;
    const newMed: ExtractedMedicine = {
      id: `med-${Date.now()}`,
      name: 'New Medicine',
      dosage: '500 mg',
      frequency: 'Twice daily',
      duration: '5 days',
      quantity: 10,
      instructions: 'Take after meals',
      foodInstruction: 'After Food'
    };
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, newMed]
    });
  };

  const handleRemoveMedicine = (medId: string) => {
    if (!prescriptionData) return;
    setPrescriptionData({
      ...prescriptionData,
      medicines: prescriptionData.medicines.filter((m) => m.id !== medId)
    });
  };

  // CONFIRMATION LOADING PROGRESSION STATES
  const [confirmStatusText, setConfirmStatusText] = useState<string>('Confirm & Send to Pharmacy');

  // CONFIRM PRESCRIPTION -> DISPATCH AUTOMATION WORKFLOW
  const handleConfirmPrescription = async () => {
    if (!prescriptionData) {
      onToast('Please review and confirm your prescription before sending it to the pharmacy.');
      return;
    }
    setIsConfirming(true);
    setConfirmStatusText('Verifying prescription...');

    // Multi-stage visual loading sequence to ensure clear status feedback
    await new Promise((r) => setTimeout(r, 600));
    setConfirmStatusText('Sending prescription to pharmacy...');

    await new Promise((r) => setTimeout(r, 600));

    try {
      const result = processPrescriptionConfirmation(prescriptionData);
      setConfirmationResult(result);
      setLatestWorkflow(result);
      if (result.reminderItem) {
        setLatestReminder(result.reminderItem);
      }
      setConfirmStatusText('Prescription submitted successfully.');
      await new Promise((r) => setTimeout(r, 300));
      setIsConfirming(false);
      setStep('success');
      onToast('✓ Prescription Verified! Sent to pharmacy for processing.');
    } catch (err) {
      console.error(err);
      setIsConfirming(false);
      setConfirmStatusText('Confirm & Send to Pharmacy');
      onToast("Prescription was verified, but we couldn't create the pharmacy tracking request. Please try again.");
    }
  };

  // INLINE ACCEPT / DECLINE FOLLOW-UP ACTION
  const handleInlineFollowUpAction = (status: 'Accepted' | 'Declined') => {
    if (!latestReminder) return;
    updateReminderFollowUpStatus(latestReminder.id, status);
    setLatestReminder({ ...latestReminder, followUpStatus: status });
    onToast(status === 'Accepted' ? '✓ Doctor Follow-up Accepted & Added to Schedule!' : '✕ Follow-up Declined');
  };

  const handleReset = () => {
    setStep('upload');
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrescriptionData(null);
    setConfirmationResult(null);
    setScanProgress(0);
    onClearCapturedImage?.();
  };

  // STEP METADATA FOR PROGRESS STEPPER
  const STEPS_NAV = [
    { id: 'upload', title: '1. Select / Upload', icon: Upload },
    { id: 'scanning', title: '2. AI OCR Scan', icon: ScanLine },
    { id: 'review', title: '3. Review & Verify', icon: FileCheck2 },
    { id: 'success', title: '4. Health Automations', icon: Layers }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* ============================================================ */}
      {/* PROGRESS STEPPER BAR                                        */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
          {STEPS_NAV.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = step === s.id;
            const isPassed =
              (s.id === 'upload' && step !== 'upload') ||
              (s.id === 'scanning' && (step === 'review' || step === 'success')) ||
              (s.id === 'review' && step === 'success');

            return (
              <div key={s.id} className="flex items-center gap-2 flex-1 min-w-[140px]">
                <div
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl w-full transition-all text-xs font-extrabold ${
                    isCurrent
                      ? 'bg-[#00a896] text-white shadow-md shadow-teal-500/20'
                      : isPassed
                      ? 'bg-teal-500/10 text-[#00a896] dark:text-cyan-400 border border-teal-500/20'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-xl flex items-center justify-center shrink-0 ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : isPassed
                        ? 'bg-teal-500/20 text-[#00a896] dark:text-cyan-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}
                  >
                    {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate">{s.title}</span>
                </div>
                {idx < STEPS_NAV.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. STEP: UPLOAD & PRESET SELECTION VIEW                      */}
      {/* ============================================================ */}
      {step === 'upload' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* TARGET PATIENT NAME BAR */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400 flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block font-mono">
                  Target Patient Profile
                </span>
                {isEditingPatientName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={patientNameInput}
                      onChange={(e) => setPatientNameInput(e.target.value)}
                      className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-teal-500 text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Enter patient name"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsEditingPatientName(false)}
                      className="px-3 py-1 rounded-xl bg-[#00a896] text-white text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {patientNameInput || 'Ragul Kumar'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingPatientName(true)}
                      className="text-[11px] font-bold text-[#00a896] dark:text-cyan-400 hover:underline cursor-pointer"
                    >
                      (Change)
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-700 dark:text-cyan-300">
              <ShieldCheck className="w-4 h-4 text-[#00a896]" />
              <span>Extracted records & reminders will sync to this patient profile</span>
            </div>
          </div>

          {/* PRESCRIPTION SELECTION GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* PRIMARY: DRAG & DROP PHYSICAL PRESCRIPTION UPLOAD (7 COLS) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`lg:col-span-7 bg-white dark:bg-slate-900 border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer shadow-xl flex flex-col justify-between space-y-5 group ${
                selectedFile
                  ? 'border-[#00a896] bg-teal-50/30 dark:bg-teal-950/10 ring-2 ring-teal-500/20'
                  : 'border-slate-300 dark:border-slate-800 hover:border-[#00a896]'
              }`}
            >
              <div className="space-y-3 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-xs">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 uppercase mb-1">
                    Primary Patient Flow
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Upload Physical Prescription Document
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                    Upload your prescription image (JPG, PNG) or PDF. The AI OCR engine extracts patient, medicines, dosages, and doctor follow-up dates.
                  </p>
                </div>

                {selectedFile && (
                  <div className="p-3 bg-teal-500/15 border border-teal-500/30 rounded-2xl text-xs text-[#00a896] dark:text-cyan-300 font-extrabold truncate max-w-sm mx-auto flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">Selected: {selectedFile.name}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-[#00a896]" />
                  <span>Browse Device / Photos</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartScan();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start AI OCR Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SECONDARY: DEMO PRESCRIPTION PRESETS (5 COLS) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Demo Prescription Presets
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    Instant Demo Data
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Test the complete extraction and workflow pipeline with sample clinical hospital records:
                </p>

                {/* PRESET CARDS LIST */}
                <div className="space-y-2 pt-1">
                  {SAMPLE_PRESCRIPTION_PRESETS.map((preset) => {
                    const isSelected = selectedPresetId === preset.id && !selectedFile;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 shadow-sm ring-1 ring-amber-500/20'
                            : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-400'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                              {preset.doctor}
                            </span>
                            {preset.data.followUp.hasFollowUp ? (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                Review: {preset.data.followUp.date}
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold font-mono bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                No Follow-up
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {preset.clinic}
                          </p>
                          <div className="text-[11px] font-mono text-[#00a896] dark:text-cyan-400 font-bold truncate">
                            Rx: {preset.data.medicines.map((m: ExtractedMedicine) => m.name).join(', ')}
                          </div>
                        </div>

                        <div className="shrink-0 pt-1">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-amber-600 bg-amber-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartScan}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test with Selected Demo Preset</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 2. STEP: MULTI-STAGE SCANNING / LOADING STATE               */}
      {/* ============================================================ */}
      {step === 'scanning' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 max-w-xl mx-auto text-center space-y-6 shadow-2xl"
        >
          <div className="relative w-24 h-24 mx-auto">
            <div className="w-24 h-24 rounded-full border-4 border-teal-500/20 border-t-[#00a896] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-[#00a896]">
              <ScanLine className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              AI Optical OCR Scanning & Extraction
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {scanStatusText}
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Processing Medical Entities</span>
              <span className="font-extrabold text-[#00a896]">{scanProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-[#00a896] to-cyan-400 rounded-full"
              />
            </div>
          </div>

          {/* LIVE OCR CHECKPOINTS */}
          <div className="grid grid-cols-1 gap-2 pt-2 text-left text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Recognizing Doctor, Clinic & Patient identity</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Parsing Active Medications, Formulations & Dosages</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Detecting Physician Follow-up Directives</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 3. STEP: REVIEW & EDIT EXTRACTED PRESCRIPTION DATA           */}
      {/* ============================================================ */}
      {step === 'review' && prescriptionData && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* TOP REVIEW BANNER */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#00a896] to-teal-700 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase font-mono tracking-wider text-teal-100 block">
                  Step 3: Verification
                </span>
                <h4 className="text-base font-black">
                  Review & Verify Extracted Prescription
                </h4>
                <p className="text-xs text-teal-100 mt-0.5">
                  Verify patient details, medicines, and physician follow-up before confirming downstream automations.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                disabled={isConfirming}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold transition-colors cursor-pointer border border-white/20 disabled:opacity-50"
              >
                Rescan / Back
              </button>
              <button
                type="button"
                onClick={handleConfirmPrescription}
                disabled={isConfirming}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-teal-900 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {isConfirming ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-teal-900/30 border-t-teal-900 rounded-full animate-spin" />
                    {confirmStatusText}
                  </span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Confirm & Send to Pharmacy ➔</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 1, 2, 3: PATIENT, DOCTOR, AND PRESCRIPTION METADATA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. PATIENT INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#00a896] dark:text-cyan-400 font-extrabold text-xs uppercase tracking-wider font-mono">
                <User className="w-4 h-4" />
                <span>1. Patient Information</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Patient Name</label>
                  <input
                    type="text"
                    value={prescriptionData.patientName}
                    onChange={(e) => {
                      setPrescriptionData({ ...prescriptionData, patientName: e.target.value });
                      setPatientNameInput(e.target.value);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Patient ABHA / ID</label>
                  <input
                    type="text"
                    value={user?.abhaId || '91-8472-9104-5821@abdm'}
                    disabled
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 2. DOCTOR INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#00a896] dark:text-cyan-400 font-extrabold text-xs uppercase tracking-wider font-mono">
                <Building2 className="w-4 h-4" />
                <span>2. Doctor Information</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Physician Name</label>
                  <input
                    type="text"
                    value={prescriptionData.doctorName}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, doctorName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Hospital / Clinic & Department</label>
                  <input
                    type="text"
                    value={prescriptionData.clinicName}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, clinicName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* 3. PRESCRIPTION INFORMATION */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-2 text-[#00a896] dark:text-cyan-400 font-extrabold text-xs uppercase tracking-wider font-mono">
                <FileText className="w-4 h-4" />
                <span>3. Prescription Info</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Prescription ID</label>
                  <input
                    type="text"
                    value={prescriptionData.id}
                    disabled
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Prescription Date</label>
                  <input
                    type="date"
                    value={prescriptionData.prescriptionDate}
                    onChange={(e) => setPrescriptionData({ ...prescriptionData, prescriptionDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: EXTRACTED MEDICINES TABLE */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    4. Extracted Medicines ({prescriptionData.medicines.length})
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Transfers automatically to Pharmacy Order and Daily Medication Schedule.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddMedicine}
                className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* MEDICINES LIST */}
            <div className="space-y-3">
              {prescriptionData.medicines.map((med, index) => (
                <div
                  key={med.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      Medicine #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(med.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove medicine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Medicine Name</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(med.id, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(med.id, 'dosage', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Frequency</label>
                      <select
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(med.id, 'frequency', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        <option value="Once daily">Once daily</option>
                        <option value="Twice daily">Twice daily</option>
                        <option value="Three times daily">Three times daily</option>
                        <option value="Every 4 hours">Every 4 hours</option>
                        <option value="As needed">As needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Duration</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(med.id, 'duration', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={med.quantity}
                        onChange={(e) => handleMedicineChange(med.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: DOCTOR FOLLOW-UP SECTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    5. Doctor Follow-up Extraction
                  </h4>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    If detected, automatically creates an appointment reminder in the Reminders Hub.
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={prescriptionData.followUp.hasFollowUp}
                  onChange={(e) =>
                    setPrescriptionData({
                      ...prescriptionData,
                      followUp: {
                        ...prescriptionData.followUp,
                        hasFollowUp: e.target.checked,
                        date: e.target.checked ? (prescriptionData.followUp.date || '2026-09-05') : ''
                      }
                    })
                  }
                  className="w-4 h-4 accent-[#00a896] rounded cursor-pointer"
                />
                <span>Follow-up Scheduled</span>
              </label>
            </div>

            {prescriptionData.followUp.hasFollowUp ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.doctorName}
                    disabled
                    className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={prescriptionData.followUp.date}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        followUp: {
                          ...prescriptionData.followUp,
                          date: e.target.value
                        }
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Follow-up Instructions
                  </label>
                  <input
                    type="text"
                    value={prescriptionData.followUp.instructions}
                    onChange={(e) =>
                      setPrescriptionData({
                        ...prescriptionData,
                        followUp: {
                          ...prescriptionData.followUp,
                          instructions: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Review after 7 days for chest auscultation"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  No doctor follow-up detected in this prescription.
                </p>
                <p className="text-[11px]">
                  No automatic doctor appointment reminder will be generated. You can check the box above if you wish to add one manually.
                </p>
              </div>
            )}
          </div>

          {/* CONFIRMATION STRIP */}
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00a896] text-white flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 dark:text-white block font-extrabold">
                  Automatic Linked Workflows on Confirmation:
                </strong>
                <span className="text-slate-600 dark:text-slate-400">
                  {prescriptionData.followUp.hasFollowUp ? '🗓️ 1 Follow-up Reminder • ' : ''}📦 1 Pharmacy Order (Pending Pharmacist Verification) • 💊 {prescriptionData.medicines.length} Medication Schedules
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleConfirmPrescription}
              disabled={isConfirming}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isConfirming ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {confirmStatusText}
                </span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Confirm & Send to Pharmacy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 4. STEP: SUCCESS & AUTOMATIC WORKFLOW SPLIT                   */}
      {/* ============================================================ */}
      {step === 'success' && confirmationResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6 max-w-4xl mx-auto font-sans"
        >
          {/* CELEBRATION HEADER */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase font-mono bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Prescription Status: Verified</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Prescription Verified Successfully
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-1 leading-relaxed">
                Your prescription <strong className="text-[#00a896]">#{confirmationResult.prescription.id}</strong> has been verified and sent to the pharmacy for processing.
              </p>
            </div>
          </div>

          {/* VISUAL WORKFLOW SPLIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. MEDICINES & PHARMACY ORDER WORKFLOW */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-[#00a896] dark:text-cyan-400">
                    <ShoppingBag className="w-5 h-5" />
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Pharmacy Fulfillment Tracking
                    </h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/15 text-blue-700 dark:text-cyan-300 border border-blue-500/30 font-mono">
                    Pharmacy: Submitted
                  </span>
                </div>

                {/* WORKFLOW STEP DIAGRAM */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Prescription Status:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Pharmacy Order ID:</span>
                    <span className="font-bold text-[#00a896] dark:text-cyan-300">
                      #{confirmationResult.pharmacyOrder?.id || `RX-ORD-${confirmationResult.prescription.id.replace('RX-DOC-', '')}`}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 flex items-center justify-between">
                    <span className="text-amber-900 dark:text-amber-200 font-sans font-bold">Pharmacy Status:</span>
                    <span className="font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Pending Pharmacist Verification
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your prescription is queued for clinical pharmacist verification. Click below to view the live pharmacy tracking timeline.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('pharmacy')}
                  className="w-full py-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Track Pharmacy Order →</span>
                </button>
              </div>
            </div>

            {/* 2. DOCTOR FOLLOW-UP & REMINDER WORKFLOW */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                    <Calendar className="w-5 h-5" />
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Doctor Follow-up Workflow
                    </h4>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono border ${
                    confirmationResult.reminderCreated
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300'
                  }`}>
                    {confirmationResult.reminderCreated ? 'Reminder Created' : 'No Follow-up'}
                  </span>
                </div>

                {confirmationResult.reminderCreated ? (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Follow-up Detected:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ Detected</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Scheduled Review:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-300">
                        {confirmationResult.reminderItem?.date || 'Scheduled'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-700/50 flex items-center justify-between">
                      <span className="text-emerald-900 dark:text-emerald-200 font-sans font-bold">Patient Reminder:</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                        ✓ Added to Schedule
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-1 text-xs">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      No follow-up detected in this prescription
                    </p>
                    <p className="text-slate-500">
                      No automatic doctor reminder was required or created.
                    </p>
                  </div>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {confirmationResult.reminderCreated
                    ? `Doctor review with ${confirmationResult.prescription.doctorName} is scheduled in your appointments & reminders.`
                    : 'You can create custom reminders anytime in the Reminders module.'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => onNavigate('reminders')}
                  className="w-full py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-extrabold transition-all border border-amber-500/30 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>View Reminders Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl font-black text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Scan Another Prescription</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3 rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Return to Patient Dashboard
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
