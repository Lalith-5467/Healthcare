import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  EyeOff,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Layers,
  FileCheck2,
  ScanLine,
  MapPin,
  Lock,
  ChevronDown,
  ChevronUp,
  RotateCw,
  FileQuestion,
  HelpCircle
} from 'lucide-react';
import type { StructuredPrescription, ExtractedMedicine } from '../../utils/prescriptionExtractor';
import {
  SAMPLE_PRESCRIPTION_PRESETS,
  extractPrescriptionData
} from '../../utils/prescriptionExtractor';
import {
  processPrescriptionConfirmation,
  getLatestWorkflowResult,
  setLatestWorkflowResult,
  updateReminderFollowUpStatus,
  getReminders,
  savePharmacyOrder,
} from '../../utils/healthWorkflowStorage';
import type { WorkflowConfirmationResult, ExtendedReminderItem } from '../../utils/healthWorkflowStorage';
import { INITIAL_PHARMACIES, type Pharmacy } from '../pharmacy/pharmacyData';
import { OrderTrackingModal } from '../pharmacy/OrderTrackingModal';

export type WorkflowState =
  | 'idle'
  | 'file_selected'
  | 'uploading'
  | 'processing'
  | 'review_required'
  | 'choose_pharmacy'
  | 'verifying'
  | 'verified'
  | 'failed';

interface PrescriptionScannerTabProps {
  user?: {
    name: string;
    email?: string;
    role?: string;
    abhaId?: string;
  };
  selectedFileProp?: File | null;
  onClearSelectedFile?: () => void;
  capturedImage?: string | null;
  onClearCapturedImage?: () => void;
  onNavigate: (module: string) => void;
  onToast: (message: string) => void;
  onOpenScanner: () => void;
}

export const PrescriptionScannerTab: React.FC<PrescriptionScannerTabProps> = ({
  user,
  selectedFileProp,
  onClearSelectedFile,
  capturedImage,
  onClearCapturedImage,
  onNavigate,
  onToast,
  onOpenScanner
}) => {
  // SINGLE AUTHORITATIVE WORKFLOW STATE MACHINE
  const [workflowState, setWorkflowState] = useState<WorkflowState>('idle');

  // Authoritative Patient Name Resolution Helper
  const isInvalidPatientName = useCallback((name?: string): boolean => {
    if (!name) return true;
    const lower = name.toLowerCase().trim();
    return (
      lower === 'patient' ||
      lower === 'ananya sharma' ||
      lower === 'ananya' ||
      lower.startsWith('dr.') ||
      lower.startsWith('dr ') ||
      lower.includes('doctor') ||
      lower.includes('pharmacist') ||
      lower.includes('r.ph') ||
      lower.includes('nurse') ||
      lower.includes('admin') ||
      lower.includes('caregiver')
    );
  }, []);

  const isClinicUncertain = useCallback((name?: string): boolean => {
    if (!name || !name.trim()) return true;
    const lower = name.trim().toLowerCase();
    return (
      lower === 'hospital' ||
      lower === 'clinic' ||
      lower === 'hospital / clinic' ||
      lower === 'hospital/clinic' ||
      lower === 'hospital / facility' ||
      lower === 'clinic name' ||
      lower === 'hospital name' ||
      lower === 'facility' ||
      lower === 'medical centre' ||
      lower === 'medical center' ||
      lower === 'health centre' ||
      lower === 'health center' ||
      lower === 'healthcare' ||
      lower === 'unable to verify clinic name' ||
      lower === 'unable to verify hospital or clinic' ||
      lower.includes('unknown')
    );
  }, []);

  const resolveAuthoritativePatientName = useCallback((userCandidate?: any): string => {
    try {
      const custom = localStorage.getItem('patient_user_name');
      if (custom && custom.trim() && !isInvalidPatientName(custom)) {
        return custom.trim();
      }
      const patientUser = localStorage.getItem('patient_user');
      if (patientUser) {
        const parsed = JSON.parse(patientUser);
        if (parsed?.name && !isInvalidPatientName(parsed.name)) {
          return parsed.name.trim();
        }
      }
      if (userCandidate?.name && !isInvalidPatientName(userCandidate.name)) {
        return userCandidate.name.trim();
      }
      const prof = localStorage.getItem('user_profile_data');
      if (prof) {
        const parsed = JSON.parse(prof);
        if (parsed?.name && !isInvalidPatientName(parsed.name)) {
          return parsed.name.trim();
        }
      }
      const appUser = localStorage.getItem('app_user');
      if (appUser) {
        const parsed = JSON.parse(appUser);
        if (parsed?.name && !isInvalidPatientName(parsed.name)) {
          return parsed.name.trim();
        }
      }
    } catch {}

    if (userCandidate?.name && !isInvalidPatientName(userCandidate.name)) {
      return userCandidate.name.trim();
    }

    return '';
  }, [isInvalidPatientName]);

  const [patientNameInput, setPatientNameInput] = useState<string>(() => resolveAuthoritativePatientName(user));
  const [isEditingPatientName, setIsEditingPatientName] = useState(false);

  // Sync patient name if user object updates
  useEffect(() => {
    let isMounted = true;
    const resolved = resolveAuthoritativePatientName(user);
    if (resolved) {
      setPatientNameInput(resolved);
    }

    import('../../services/apiClient').then(({ apiClient }) => {
      apiClient.get<any>('/profile/patient').then((res) => {
        if (res && res.data && res.data.fullName && isMounted) {
          const fn = res.data.fullName.trim();
          if (fn && !isInvalidPatientName(fn)) {
            setPatientNameInput(fn);
            localStorage.setItem('patient_user_name', fn);
          }
        }
      }).catch(() => {
        apiClient.get<any>('/profile').then((res) => {
          const fn = res?.data?.patient?.fullName || res?.data?.profile?.fullName || res?.data?.fullName;
          if (fn && isMounted && !isInvalidPatientName(fn)) {
            setPatientNameInput(fn.trim());
            localStorage.setItem('patient_user_name', fn.trim());
          }
        }).catch(() => {});
      });
    });

    const handleUserUpdated = () => {
      if (isMounted) {
        setPatientNameInput(resolveAuthoritativePatientName(user));
      }
    };
    window.addEventListener('app_user_updated', handleUserUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('app_user_updated', handleUserUpdated);
    };
  }, [user, resolveAuthoritativePatientName, isInvalidPatientName]);

  const handleSavePatientName = async () => {
    setIsEditingPatientName(false);
    const trimmed = patientNameInput.trim();
    if (!trimmed) return;

    try {
      const appUserStr = localStorage.getItem('app_user');
      if (appUserStr) {
        const appUser = JSON.parse(appUserStr);
        appUser.name = trimmed;
        localStorage.setItem('app_user', JSON.stringify(appUser));
      }
      const profStr = localStorage.getItem('user_profile_data');
      if (profStr) {
        const prof = JSON.parse(profStr);
        prof.name = trimmed;
        localStorage.setItem('user_profile_data', JSON.stringify(prof));
      }
      window.dispatchEvent(new Event('app_user_updated'));

      const { apiClient } = await import('../../services/apiClient');
      await apiClient.put('/profile/patient', { fullName: trimmed });
      onToast(`✓ Patient profile name saved: ${trimmed}`);
    } catch (err) {
      console.warn('Failed to update patient profile name:', err);
    }
  };

  // FILE & IMAGE PREVIEW STATE
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [showRawOcr, setShowRawOcr] = useState<boolean>(false);

  // SCANNING / OCR PROGRESS
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Initializing AI OCR Engine...');
  const [scanError, setScanError] = useState<string | null>(null);

  // EXTRACTED / EDITABLE PRESCRIPTION STATE
  const [prescriptionData, setPrescriptionData] = useState<StructuredPrescription | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<WorkflowConfirmationResult | null>(null);

  // REGISTERED PHARMACY STATE & SELECTION
  const [registeredPharmacies, setRegisteredPharmacies] = useState<Pharmacy[]>([]);
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState<boolean>(true);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(() => {
    try {
      return localStorage.getItem('patient_preferred_pharmacy_id') || '';
    } catch {
      return '';
    }
  });
  const [isPharmacyPickerOpen, setIsPharmacyPickerOpen] = useState<boolean>(false);
  const [patientDeliveryAddress, setPatientDeliveryAddress] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const isSubmittingRef = useRef<boolean>(false);
  const submittedPrescriptionIdsRef = useRef<Set<string>>(new Set());
  const [isLiveTrackingOpen, setIsLiveTrackingOpen] = useState<boolean>(false);
  const [liveTrackingOrder, setLiveTrackingOrder] = useState<any>(null);

  // Load authenticated patient's registered delivery address
  useEffect(() => {
    let isMounted = true;
    const loadPatientAddress = async () => {
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.get<any>('/profile/patient');
        if (isMounted && res?.data?.address && typeof res.data.address === 'string' && res.data.address.trim()) {
          setPatientDeliveryAddress(res.data.address.trim());
        }
      } catch (err) {
        try {
          const stored = localStorage.getItem('user_profile_data');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (isMounted && parsed?.location && typeof parsed.location === 'string' && parsed.location.trim()) {
              setPatientDeliveryAddress(parsed.location.trim());
            }
          }
        } catch {}
      }
    };
    loadPatientAddress();
    return () => { isMounted = false; };
  }, []);

  // CONFIRMATION LOADING STATE
  const [confirmStatusText, setConfirmStatusText] = useState<string>('Verifying & Submitting...');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch available registered tie-up pharmacies from backend
  useEffect(() => {
    let isMounted = true;
    const fetchAvailablePharmacies = async () => {
      setIsLoadingPharmacies(true);
      try {
        const { apiClient } = await import('../../services/apiClient');
        const res = await apiClient.get<any[]>('/pharmacies/available');
        if (isMounted && res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          const seenIds = new Set<string>();
          const mapped: Pharmacy[] = [];

          res.data.forEach((p: any, idx: number) => {
            const id = p.id || p.pharmacyId;
            if (!id || seenIds.has(id)) return;
            seenIds.add(id);

            mapped.push({
              id,
              name: p.name || 'Partner Pharmacy',
              rating: 4.8,
              reviewCount: 350,
              distanceKm: Number((1.8 + idx * 0.9).toFixed(1)),
              hours: 'Open until 10:00 PM',
              deliveryTime: '30–45 min',
              deliveryAvailable: true,
              pickupAvailable: true,
              address: [p.address, p.city, p.state].filter(Boolean).join(', ') || 'Chennai, TN',
              phone: p.phone || '+91 98401 23456',
              isPreferred: false,
            });
          });

          setRegisteredPharmacies(mapped);

          // Only set if patient previously confirmed a preferred pharmacy that exists in network
          const savedPref = localStorage.getItem('patient_preferred_pharmacy_id');
          if (savedPref && mapped.some((m) => m.id === savedPref)) {
            setSelectedPharmacyId(savedPref);
          }
        }
      } catch (err) {
        console.warn('Failed to load registered pharmacies from backend:', err);
      } finally {
        if (isMounted) setIsLoadingPharmacies(false);
      }
    };
    fetchAvailablePharmacies();
    return () => { isMounted = false; };
  }, []);

  const selectedPharmacy = useMemo(() => {
    if (!selectedPharmacyId) return null;
    return registeredPharmacies.find((p) => p.id === selectedPharmacyId) || null;
  }, [registeredPharmacies, selectedPharmacyId]);

  // LIVE LATEST WORKFLOW STATE
  const [latestWorkflow, setLatestWorkflow] = useState<WorkflowConfirmationResult | null>(null);
  const [latestReminder, setLatestReminder] = useState<ExtendedReminderItem | null>(null);

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

  // VALIDATE SELECTED FILE
  const validateFile = (file: File): string | null => {
    if (!file) return 'No file selected.';
    if (file.size === 0) return 'The selected file is empty (0 bytes). Please upload a valid document.';
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) return 'File size exceeds 25 MB limit. Please upload a smaller file.';
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isAllowed = allowed.includes(file.type) || ['pdf', 'jpg', 'jpeg', 'png', 'webp'].includes(ext || '');
    if (!isAllowed) {
      return `Unsupported file format (.${ext || 'unknown'}). Please upload a PDF, JPG, PNG, or WEBP document.`;
    }
    return null;
  };

  // EXECUTE OCR EXTRACTION PIPELINE
  const runExtractionWorkflow = async (overrideSource?: string | File | null) => {
    setWorkflowState('processing');
    setScanProgress(10);
    setScanStatusText('Initializing AI OCR Engine & analyzing document structure...');
    setScanError(null);
    setActivePageIndex(0);
    setPrescriptionData(null);
    setConfirmationResult(null);
    setShowRawOcr(false);

    try {
      const isPresetSource = (typeof overrideSource === 'string' && overrideSource.startsWith('preset-')) || (!overrideSource && !selectedFile && !!selectedPresetId);
      const targetPreset = isPresetSource ? (typeof overrideSource === 'string' ? overrideSource : selectedPresetId) : undefined;
      const targetSource = targetPreset || overrideSource || selectedFile || previewUrl;

      if (!targetSource) {
        throw new Error('No document source provided for OCR scan.');
      }

      const extracted = await extractPrescriptionData(
        targetSource,
        targetPreset,
        (statusText, percent) => {
          setScanStatusText(statusText);
          setScanProgress(percent);
        },
        patientNameInput.trim() || user?.name || 'Patient'
      );

      if (!extracted || !extracted.id) {
        throw new Error('AI OCR scanning completed but failed to parse prescription structure.');
      }

      setPrescriptionData(extracted);
      // TRANSITION DIRECTLY TO REVIEW & VERIFY (STEP 3) — NEVER AUTO-ADVANCE TO STEP 4
      setWorkflowState('review_required');
      onToast('✓ Prescription scanned! Please review extracted fields and confirm.');
    } catch (err: any) {
      console.error('OCR Extraction error:', err);
      setScanError(err?.message || 'Unable to scan document automatically. You can retry or complete fields manually.');
      setWorkflowState('failed');
      onToast('⚠️ OCR scan could not complete automatically. Check the document or retry.');
    }
  };

  // HANDLE FILE SELECTION (Independent of camera permission)
  const handleSelectFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setScanError(error);
      setWorkflowState('failed');
      onToast(`✕ ${error}`);
      return;
    }

    setSelectedFile(file);
    setSelectedPresetId('');
    setScanError(null);
    setPrescriptionData(null);
    setConfirmationResult(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Transition to uploading, then auto-start OCR pipeline
    setWorkflowState('uploading');
    setScanStatusText('Validating and preparing document for OCR scan...');
    setScanProgress(5);

    setTimeout(() => {
      runExtractionWorkflow(file);
    }, 450);
  }, [patientNameInput, user]);

  // Handle selectedFileProp passed from parent (e.g. ScanView header Browse button)
  useEffect(() => {
    if (selectedFileProp) {
      handleSelectFile(selectedFileProp);
      onClearSelectedFile?.();
    }
  }, [selectedFileProp, handleSelectFile, onClearSelectedFile]);

  // Handle capturedImage passed from camera modal
  useEffect(() => {
    if (capturedImage) {
      setPreviewUrl(capturedImage);
      setSelectedFile(null);
      setSelectedPresetId('');
      setScanError(null);
      setWorkflowState('uploading');
      setTimeout(() => {
        runExtractionWorkflow(capturedImage);
      }, 400);
      onClearCapturedImage?.();
    }
  }, [capturedImage, onClearCapturedImage]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectFile(e.target.files[0]);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanError(null);
    setWorkflowState('file_selected');
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPresetId('');
    setScanError(null);
    setPrescriptionData(null);
    setWorkflowState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClearCapturedImage?.();
    onClearSelectedFile?.();
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
      name: 'New Medication',
      dosage: '500 mg',
      frequency: 'Once daily',
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

  // SAVE TO PERSONAL HEALTH RECORDS ONLY (NO PHARMACY DISPATCH)
  const handleSaveToRecordsOnly = async () => {
    if (!prescriptionData) {
      onToast('Please review your prescription details before saving.');
      return;
    }

    setWorkflowState('verifying');
    setConfirmStatusText('Saving verified record to Digital Health Locker...');

    try {
      const chosenPharm = {
        id: 'VAULT',
        name: 'Personal Health Locker',
        address: 'Secured ABDM Record Vault',
      };

      const result = processPrescriptionConfirmation(prescriptionData, chosenPharm);
      const vaultResult: any = {
        ...result,
        pharmacyOrder: null,
      };

      try {
        const { getStoredAuthToken } = await import('../../services/pharmacyOrderApi');
        const token = getStoredAuthToken();
        if (token) {
          const profRes = await fetch('http://localhost:5000/api/profile/patient', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const profData = await profRes.json();
          const patientId = profData?.data?.id;

          if (patientId) {
            const rxPayload = {
              patientId,
              diagnosis: prescriptionData.notes || 'Clinical Prescription Scan',
              notes: `Doctor: ${prescriptionData.doctorName} (${prescriptionData.clinicName}). Patient: ${prescriptionData.patientName || 'Patient'}. Saved to personal record vault.`,
              items: (prescriptionData.medicines || []).map((m) => ({
                medicineName: m.name,
                dosage: m.dosage || '1',
                unit: 'mg',
                frequency: m.frequency || 'Once daily',
                durationDays: m.duration ? parseInt(m.duration, 10) || 7 : 7,
                instructions: m.instructions || 'Take as prescribed',
                foodInstruction: m.foodInstruction || 'After food',
              })),
            };

            const rxRes = await fetch('http://localhost:5000/api/prescriptions', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(rxPayload),
            });

            if (rxRes.ok) {
              const rxCreated = await rxRes.json();
              const rxId = rxCreated?.data?.id;
              if (rxId) {
                await fetch(`http://localhost:5000/api/prescriptions/${rxId}/confirm`, {
                  method: 'PATCH',
                  headers: { Authorization: `Bearer ${token}` },
                });
              }
            }
          }
        }
      } catch (backendErr) {
        console.warn('Backend record save warning:', backendErr);
      }

      setConfirmationResult(vaultResult);
      setLatestWorkflow(vaultResult);
      if (vaultResult.reminderItem) {
        setLatestReminder(vaultResult.reminderItem);
      }

      setWorkflowState('verified');
      onToast('✓ Prescription saved to your Digital Health Locker!');
    } catch (err) {
      console.error(err);
      setWorkflowState('review_required');
      onToast('Failed to save to health records. Please try again.');
    }
  };

  // INITIATE PHARMACY VERIFICATION FLOW
  const handleVerifyAndSendClick = () => {
    if (!prescriptionData) {
      onToast('Please review your prescription details before confirming.');
      return;
    }
    setSubmissionError(null);
    setIsPharmacyPickerOpen(true);
  };

  // CONFIRM & SEND TO REGISTERED PHARMACY
  const handleExecutePharmacySubmission = async (targetPharmacyId?: string) => {
    const pharmIdToUse = targetPharmacyId || selectedPharmacyId;
    if (!pharmIdToUse) {
      setSubmissionError('Please select a registered partner pharmacy before confirming.');
      return;
    }

    if (!prescriptionData) {
      onToast('Please review your prescription details before confirming.');
      return;
    }

    // Double-click lock
    if (isSubmittingRef.current || isSubmittingOrder) {
      return;
    }

    const chosenPharm = registeredPharmacies.find((p) => p.id === pharmIdToUse);
    if (!chosenPharm) {
      setSubmissionError('Selected pharmacy not found in network. Please select a valid partner pharmacy.');
      return;
    }

    const prescriptionIdentifier = prescriptionData.id || `${prescriptionData.patientName}-${prescriptionData.prescriptionDate || ''}`;
    if (prescriptionIdentifier && submittedPrescriptionIdsRef.current.has(prescriptionIdentifier)) {
      onToast('This prescription has already been submitted to the pharmacy.');
      setIsPharmacyPickerOpen(false);
      return;
    }

    const finalDeliveryAddress = patientDeliveryAddress.trim();
    if (!finalDeliveryAddress) {
      setSubmissionError('Please provide your delivery address before placing the order.');
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmittingOrder(true);
    setWorkflowState('verifying');
    setSubmissionError(null);

    try {
      // 1. Submit to backend database first - ensure real MySQL persistence
      const { createPatientPharmacyOrder } = await import('../../services/pharmacyOrderApi');
      const realOrder = await createPatientPharmacyOrder({
        prescriptionData: {
          notes: prescriptionData.notes || 'Clinical Prescription Scan',
          doctorName: prescriptionData.doctorName,
          clinicName: prescriptionData.clinicName,
          patientName: patientNameInput.trim() || user?.name || 'Patient',
          medicines: prescriptionData.medicines,
        },
        pharmacyId: chosenPharm.id,
        deliveryAddress: finalDeliveryAddress,
        deliveryType: 'Home Delivery',
      });

      if (!realOrder || !realOrder.id) {
        throw new Error('Failed to create pharmacy order record in database');
      }

      // 2. Process workflow confirmation and associate with authoritative order
      const result = processPrescriptionConfirmation(prescriptionData, {
        id: chosenPharm.id,
        name: chosenPharm.name,
        address: chosenPharm.address,
      });

      // Store preference
      try {
        localStorage.setItem('patient_preferred_pharmacy_id', chosenPharm.id);
        localStorage.setItem('health_workflow_last_updated', String(Date.now()));
        localStorage.setItem('pharmacy_order_updated', realOrder.id);
      } catch {}

      if (prescriptionIdentifier) {
        submittedPrescriptionIdsRef.current.add(prescriptionIdentifier);
      }

      const updatedResult: any = {
        ...result,
        pharmacyOrder: {
          ...result.pharmacyOrder,
          id: realOrder.id,
          pharmacyName: chosenPharm.name,
          pharmacyId: chosenPharm.id,
          sourcePrescriptionId: realOrder.prescriptionId,
          status: 'PENDING',
          progressPercent: 20,
        },
      };

      setConfirmationResult(updatedResult);
      setLatestWorkflow(updatedResult);
      setLatestWorkflowResult(updatedResult);
      setLiveTrackingOrder(realOrder as any);
      savePharmacyOrder(updatedResult.pharmacyOrder);
      window.dispatchEvent(new Event('health_workflow_updated'));

      if (result.reminderItem) {
        setLatestReminder(result.reminderItem);
      }

      setSelectedPharmacyId(chosenPharm.id);
      setIsPharmacyPickerOpen(false);
      setWorkflowState('verified');
      setIsLiveTrackingOpen(true);
      onToast(`✓ Transmitted! Live order #${realOrder.id.slice(-6)} sent to ${chosenPharm.name}.`);
    } catch (err: any) {
      console.error('Pharmacy order submission error:', err);
      const errorMessage = err?.message || 'Failed to submit order to pharmacy. Please try again.';
      setSubmissionError(errorMessage);
      setIsPharmacyPickerOpen(true);
      setWorkflowState('review_required');
      setIsLiveTrackingOpen(false);
      onToast(errorMessage);
    } finally {
      setIsSubmittingOrder(false);
      isSubmittingRef.current = false;
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
    setWorkflowState('idle');
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedPresetId('');
    setPrescriptionData(null);
    setConfirmationResult(null);
    setScanProgress(0);
    setScanError(null);
    setActivePageIndex(0);
    setShowRawOcr(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClearCapturedImage?.();
    onClearSelectedFile?.();
  };

  // VALIDATION ISSUES COMPUTATION
  const validationAlerts = useMemo(() => {
    if (!prescriptionData) return [];
    const alerts: { field: string; message: string; severity: 'warning' | 'info' }[] = [];

    if (
      !prescriptionData.doctorName ||
      prescriptionData.doctorName === 'Unable to verify physician name' ||
      prescriptionData.doctorName.toLowerCase().includes('unknown') ||
      prescriptionData.doctorName === 'Doctor'
    ) {
      alerts.push({
        field: 'Doctor',
        message: prescriptionData.doctorName === 'Unable to verify physician name'
          ? 'Unable to verify physician name from document. Please review and enter manually.'
          : 'Physician name is uncertain. Please check the document.',
        severity: 'warning'
      });
    }
    if (isClinicUncertain(prescriptionData.clinicName)) {
      alerts.push({ field: 'Clinic', message: 'Hospital or clinic information needs review.', severity: 'info' });
    }
    if (!prescriptionData.prescriptionDate) {
      alerts.push({ field: 'Date', message: 'Prescription date could not be parsed automatically.', severity: 'warning' });
    }
    if (!prescriptionData.medicines || prescriptionData.medicines.length === 0) {
      alerts.push({ field: 'Medicines', message: 'No medications were detected in the OCR text.', severity: 'warning' });
    }
    return alerts;
  }, [prescriptionData]);

  // MAP WORKFLOW STATE TO 4-STEP NAVIGATION
  const activeStepNumber = useMemo(() => {
    switch (workflowState) {
      case 'idle':
      case 'file_selected':
      case 'uploading':
        return 1;
      case 'processing':
        return 2;
      case 'review_required':
      case 'choose_pharmacy':
      case 'verifying':
      case 'failed':
        return 3;
      case 'verified':
        return 4;
    }
  }, [workflowState]);

  const STEPS_NAV = [
    { stepNum: 1, title: '1. Select / Upload', icon: Upload },
    { stepNum: 2, title: '2. AI OCR Scan', icon: ScanLine },
    { stepNum: 3, title: '3. Review & Verify', icon: FileCheck2 },
    { stepNum: 4, title: '4. Health Automations', icon: Layers }
  ];

  // Helper to determine if file is PDF
  const isPdfFile = useMemo(() => {
    if (selectedFile?.type === 'application/pdf') return true;
    if (selectedFile?.name.toLowerCase().endsWith('.pdf')) return true;
    if (previewUrl && previewUrl.startsWith('blob:') && selectedFile?.name.toLowerCase().endsWith('.pdf')) return true;
    return false;
  }, [selectedFile, previewUrl]);

  return (
    <div className="space-y-6 font-sans">
      {/* HIDDEN SYSTEM FILE PICKER (INDEPENDENT OF CAMERA PERMISSION) */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* ============================================================ */}
      {/* 4-STEP PROGRESS STEPPER BAR                                  */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0">
          {STEPS_NAV.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = activeStepNumber === s.stepNum;
            const isPassed = activeStepNumber > s.stepNum;

            return (
              <div key={s.stepNum} className="flex items-center gap-2 flex-1 min-w-[140px]">
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
                  <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300 dark:text-slate-700 shrink-0 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. STEP: SELECT / UPLOAD VIEW (idle, file_selected, uploading) */}
      {/* ============================================================ */}
      {(workflowState === 'idle' || workflowState === 'file_selected' || workflowState === 'uploading') && (
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
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSavePatientName();
                      }}
                      className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-teal-500 text-slate-900 dark:text-white focus:outline-none"
                      placeholder="Enter patient name"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSavePatientName}
                      className="px-3 py-1 rounded-xl bg-[#00a896] hover:bg-teal-600 text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingPatientName(false)}
                      className="px-2 py-1 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-0.5">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {patientNameInput || user?.name || 'Patient'}
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

          {/* UPLOAD & PRESETS WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* PRIMARY: DOCUMENT DROPZONE & SELECTION */}
            <div
              className={`lg:col-span-7 bg-white dark:bg-slate-900 border-2 rounded-3xl p-6 sm:p-8 text-center transition-all shadow-xl flex flex-col justify-between space-y-5 ${
                selectedFile
                  ? 'border-[#00a896] bg-teal-50/20 dark:bg-teal-950/10 ring-2 ring-teal-500/20'
                  : 'border-dashed border-slate-300 dark:border-slate-800 hover:border-[#00a896]'
              }`}
            >
              {/* IF FILE IS SELECTED */}
              {selectedFile ? (
                <div className="space-y-4 my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-[#00a896] flex items-center justify-center mx-auto shadow-xs">
                    <FileText className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 uppercase mb-1">
                      {selectedFile.type || 'Document File'}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white truncate max-w-md mx-auto">
                      {selectedFile.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      Size: {(selectedFile.size / 1024 > 1024) ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : `${Math.round(selectedFile.size / 1024)} KB`}
                    </p>
                  </div>

                  {/* PREVIEW CONTAINER */}
                  {previewUrl && (
                    <div className="max-w-sm mx-auto h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                      {isPdfFile ? (
                        <div className="text-center p-4 space-y-2">
                          <FileText className="w-10 h-10 text-rose-500 mx-auto" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                            PDF Document Attached
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Pages will be scanned via Optical AI Engine
                          </span>
                        </div>
                      ) : (
                        <img
                          src={previewUrl}
                          alt="Document Preview"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      Replace File
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      Remove File
                    </button>
                    <button
                      type="button"
                      onClick={() => runExtractionWorkflow(selectedFile)}
                      className="px-6 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <ScanLine className="w-4 h-4" />
                      <span>Start AI OCR Scan</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* IDLE UPLOAD DROPZONE */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="space-y-4 my-auto cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] flex items-center justify-center mx-auto hover:scale-105 transition-transform shadow-xs">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30 uppercase mb-1">
                      Physical Document Flow
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Upload Physical Prescription Document
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                      Upload your prescription image (JPG, PNG, WEBP) or PDF document. AI OCR extracts patient details, medications, dosages, and physician follow-up instructions.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5 pt-3 max-w-md mx-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-[#00a896]" />
                      <span>Browse Files (PDF / Image)</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenScanner();
                      }}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Use Camera Scanner</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SECONDARY: DEMO PRESCRIPTION PRESETS */}
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
                  Test the complete extraction and verification pipeline with sample clinical hospital records:
                </p>

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
                onClick={() => {
                  if (selectedPresetId) {
                    runExtractionWorkflow(selectedPresetId);
                  } else {
                    onToast('Please select a preset first.');
                  }
                }}
                disabled={!selectedPresetId}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test with Selected Demo Preset</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 2. STEP: GENUINE AI OCR SCANNING (processing)                */}
      {/* ============================================================ */}
      {workflowState === 'processing' && (
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

          {/* REAL PROGRESS BAR */}
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

          {/* OCR CHECKPOINTS */}
          <div className="grid grid-cols-1 gap-2 pt-2 text-left text-xs text-slate-600 dark:text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Optical layout analysis & entity extraction</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Parsing medications, dosages, frequency & food rules</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center gap-2 border border-slate-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Detecting physician follow-up directives</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ============================================================ */}
      {/* 3. STEP: REVIEW & VERIFY (review_required, verifying, failed) */}
      {/* ============================================================ */}
      {(workflowState === 'review_required' || workflowState === 'verifying' || workflowState === 'failed') && (
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
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase font-mono tracking-wider text-teal-100 block">
                    Step 3: Clinical Review & Verification
                  </span>
                  {prescriptionData?.confidence && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white">
                      OCR Confidence: {prescriptionData.confidence}%
                    </span>
                  )}
                </div>
                <h4 className="text-base font-black">
                  Review & Verify Extracted Document Data
                </h4>
                <p className="text-xs text-teal-100 mt-0.5">
                  Confirm patient details, medications, and tie-up pharmacy before proceeding with consequential actions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleReset}
                disabled={workflowState === 'verifying'}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-extrabold transition-colors cursor-pointer border border-white/20 disabled:opacity-50"
              >
                Rescan / Replace File
              </button>

              <button
                type="button"
                onClick={handleVerifyAndSendClick}
                disabled={workflowState === 'verifying' || !prescriptionData}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-teal-900 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
              >
                {workflowState === 'verifying' ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-teal-900/30 border-t-teal-900 rounded-full animate-spin" />
                    {confirmStatusText}
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#00a896]" />
                    <span>Verify & Continue ➔</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SCAN FAILURE NOTICE */}
          {workflowState === 'failed' && (
            <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-900 dark:text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-sm">Automated Optical Recognition Incomplete</h5>
                  <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                    {scanError || 'Could not parse structured text from this document. You can retry with a clearer file or fill in details manually.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => runExtractionWorkflow(selectedFile || previewUrl || selectedPresetId)}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold cursor-pointer hover:bg-rose-700 transition-colors"
                >
                  Retry Scan
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Choose Another File
                </button>
              </div>
            </div>
          )}

          {/* TWO-COLUMN SIDE-BY-SIDE REVIEW WORKSPACE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: DOCUMENT PREVIEW & OCR AUDIT (5 COLS) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#00a896]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-mono">
                      Document Preview
                    </span>
                  </div>
                  {prescriptionData?.confidence && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-teal-500/15 text-[#00a896] dark:text-cyan-300 border border-teal-500/30">
                      ★ {prescriptionData.confidence}% Confidence
                    </span>
                  )}
                </div>

                {/* MULTI-PAGE DOCUMENT NAVIGATION (IF AVAILABLE) */}
                {prescriptionData?.pages && prescriptionData.pages.length > 1 && (
                  <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <button
                      type="button"
                      disabled={activePageIndex === 0}
                      onClick={() => setActivePageIndex((prev) => Math.max(0, prev - 1))}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40 cursor-pointer"
                    >
                      ‹ Previous Page
                    </button>
                    <span className="font-mono text-[11px]">
                      Page {activePageIndex + 1} of {prescriptionData.pages.length}
                    </span>
                    <button
                      type="button"
                      disabled={activePageIndex >= prescriptionData.pages.length - 1}
                      onClick={() => setActivePageIndex((prev) => Math.min(prescriptionData.pages!.length - 1, prev + 1))}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 disabled:opacity-40 cursor-pointer"
                    >
                      Next Page ›
                    </button>
                  </div>
                )}

                {/* THE ACTUAL PREVIEW FRAME */}
                <div className="relative aspect-[3/4] w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2">
                  {prescriptionData?.pages && prescriptionData.pages[activePageIndex] ? (
                    <img
                      src={prescriptionData.pages[activePageIndex]}
                      alt={`Prescription Page ${activePageIndex + 1}`}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : previewUrl && isPdfFile ? (
                    <iframe
                      src={`${previewUrl}#toolbar=0`}
                      title="Uploaded PDF Document"
                      className="w-full h-full border-0 rounded-xl"
                    />
                  ) : previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Uploaded Document"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <div className="text-center p-6 space-y-2 text-slate-400">
                      <FileQuestion className="w-10 h-10 mx-auto" />
                      <p className="text-xs font-medium">Sample Prescription Preset Active</p>
                    </div>
                  )}
                </div>

                {/* FILE METADATA FOOTER */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="truncate max-w-[200px]">
                    {selectedFile?.name || 'Medical_Prescription_Scan'}
                  </span>
                  <span>
                    {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : 'Verified Source'}
                  </span>
                </div>

                {/* RAW OCR TEXT TOGGLE */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRawOcr(!showRawOcr)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      {showRawOcr ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showRawOcr ? 'Hide Raw OCR Text' : 'View Extracted Raw OCR Text'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Raw Stream</span>
                  </button>

                  {showRawOcr && prescriptionData?.rawOcrText && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 p-3 bg-slate-900 text-emerald-400 rounded-2xl text-[11px] font-mono whitespace-pre-wrap max-h-56 overflow-y-auto border border-slate-800 leading-relaxed"
                    >
                      {prescriptionData.rawOcrText}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* VALIDATION & UNCERTAIN FIELDS ALERT */}
              {validationAlerts.length > 0 && (
                <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2 text-xs">
                  <div className="flex items-center gap-2 font-black">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Uncertain / Missing Values Detected ({validationAlerts.length})</span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300">
                    The following fields had low OCR confidence. You can edit them on the right before saving:
                  </p>
                  <ul className="space-y-1 list-disc list-inside text-[11px]">
                    {validationAlerts.map((a, i) => (
                      <li key={i}>
                        <strong>{a.field}:</strong> {a.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: EXTRACTED CLINICAL FIELDS (7 COLS) */}
            <div className="lg:col-span-7 space-y-5">
              {prescriptionData && (
                <>
                  {/* SECTION 1: PATIENT & DOCTOR INFO */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* PATIENT INFO */}
                      <div className="space-y-2 text-xs">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          value={prescriptionData.patientName}
                          onChange={(e) => {
                            setPrescriptionData({ ...prescriptionData, patientName: e.target.value });
                            setPatientNameInput(e.target.value);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* PRESCRIPTION DATE */}
                      <div className="space-y-2 text-xs">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          Prescription Date
                        </label>
                        <input
                          type="date"
                          value={prescriptionData.prescriptionDate}
                          onChange={(e) => setPrescriptionData({ ...prescriptionData, prescriptionDate: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* DOCTOR INFO */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                            Prescribing Physician
                          </label>
                          {prescriptionData.doctorName === 'Unable to verify physician name' && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                              ⚠️ Action Needed
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={prescriptionData.doctorName}
                          onChange={(e) => setPrescriptionData({ ...prescriptionData, doctorName: e.target.value })}
                          placeholder="Enter physician name"
                          className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold text-slate-900 dark:text-white ${
                            prescriptionData.doctorName === 'Unable to verify physician name'
                              ? 'border-amber-400 dark:border-amber-500/50 bg-amber-50/20 text-amber-900 dark:text-amber-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        />
                      </div>

                      {/* CLINIC / HOSPITAL */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                            Hospital / Clinic
                          </label>
                          {isClinicUncertain(prescriptionData.clinicName) && (
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono">
                              ⚠️ Action Needed
                            </span>
                          )}
                        </div>
                        <input
                          type="text"
                          value={prescriptionData.clinicName}
                          onChange={(e) => setPrescriptionData({ ...prescriptionData, clinicName: e.target.value })}
                          placeholder="Enter hospital or clinic name"
                          className={`w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border font-bold text-slate-900 dark:text-white ${
                            isClinicUncertain(prescriptionData.clinicName)
                              ? 'border-amber-400 dark:border-amber-500/50 bg-amber-50/20 text-amber-900 dark:text-amber-200'
                              : 'border-slate-200 dark:border-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: EXTRACTED MEDICINES TABLE */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            Extracted Medicines ({prescriptionData.medicines.length})
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Verify dosages, frequency, and duration before transmission.
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

                    <div className="space-y-3">
                      {prescriptionData.medicines.map((med, index) => (
                        <div
                          key={med.id}
                          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-slate-500">
                              Item #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveMedicine(med.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Remove medication"
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

                  {/* SECTION 3: DOCTOR FOLLOW-UP DIRECTIVE */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            Physician Follow-up Directives
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            If enabled, an appointment reminder is automatically scheduled.
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                followUp: { ...prescriptionData.followUp, date: e.target.value }
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
                                followUp: { ...prescriptionData.followUp, instructions: e.target.value }
                              })
                            }
                            placeholder="e.g. Review after 7 days for chest auscultation"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        No physician follow-up directive detected. Enable checkbox above to schedule one manually.
                      </p>
                    )}
                  </div>

                  {/* SECTION 4: REGISTERED PHARMACY SELECTION */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-[#00a896] dark:text-cyan-400 flex items-center justify-center">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            Choose Registered Fulfillment Pharmacy
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            Select a verified partner pharmacy to dispense and deliver this prescription.
                          </span>
                        </div>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-[11px] font-extrabold text-teal-700 dark:text-cyan-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#00a896]" />
                        <span>{registeredPharmacies.length} Verified Pharmacies</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <select
                          value={selectedPharmacyId}
                          onChange={(e) => {
                            setSelectedPharmacyId(e.target.value);
                            setSubmissionError(null);
                          }}
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00a896] cursor-pointer"
                        >
                          <option value="">-- Choose a registered partner pharmacy --</option>
                          {registeredPharmacies.map((pharm) => (
                            <option key={pharm.id} value={pharm.id}>
                              {pharm.name} — {pharm.address} ({pharm.distanceKm} km away)
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPharmacyPickerOpen(true)}
                        className="px-4 py-3 rounded-2xl bg-teal-500/10 hover:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 text-xs font-black transition-colors border border-teal-500/20 cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{selectedPharmacy ? 'Change Pharmacy' : 'Browse Pharmacies'}</span>
                      </button>
                    </div>

                    {selectedPharmacy && (
                      <div className="p-3.5 rounded-2xl bg-teal-500/5 border border-teal-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">{selectedPharmacy.name}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              Verified Partner
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {selectedPharmacy.address} • {selectedPharmacy.distanceKm} km away • {selectedPharmacy.deliveryTime}
                          </p>
                        </div>
                        <div className="text-xs font-bold text-[#00a896] dark:text-cyan-400 shrink-0">
                          ⭐ {selectedPharmacy.rating} ({selectedPharmacy.reviewCount} reviews)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ACTION BAR: VERIFY / SAVE OPTIONS */}
                  <div className="p-3 sm:p-3.5 rounded-2xl sm:rounded-3xl bg-teal-500/10 border border-teal-500/20 flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* SECTION 1: SHIELD ICON (LEFT) */}
                      <div className="w-8 h-8 rounded-xl bg-[#00a896] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <ShieldCheck className="w-4.5 h-4.5" />
                      </div>

                      {/* SECTION 2: AUTHORIZATION HEADING & PHARMACY DETAILS (MIDDLE-LEFT) */}
                      <div className="min-w-0 flex-1">
                        <strong className="text-slate-900 dark:text-white block font-extrabold text-xs whitespace-nowrap leading-tight">
                          Ready to Confirm & Authorize
                        </strong>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] mt-0.5 leading-snug truncate">
                          <span className="font-medium">Target Pharmacy: </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">
                            {selectedPharmacy ? selectedPharmacy.name : 'Select partner pharmacy'}
                          </span>
                          <span className="inline-block whitespace-nowrap font-medium">&nbsp;•&nbsp;{prescriptionData.medicines.length} Medications</span>
                        </p>
                      </div>
                    </div>

                    {/* SECTION 3: THE TWO ACTION BUTTONS (RIGHT) */}
                    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 shrink-0 w-full xl:w-auto justify-start xl:justify-end">
                      <button
                        type="button"
                        onClick={handleSaveToRecordsOnly}
                        disabled={workflowState === 'verifying' || isSubmittingOrder}
                        className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors cursor-pointer border border-slate-300 dark:border-slate-700 inline-flex items-center justify-center text-center whitespace-nowrap shrink-0 disabled:opacity-50"
                      >
                        Save to Health Locker Only
                      </button>

                      <button
                        type="button"
                        onClick={handleVerifyAndSendClick}
                        disabled={workflowState === 'verifying' || isSubmittingOrder}
                        className="h-9 px-3.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-[11px] transition-all shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 whitespace-nowrap shrink-0 min-w-[170px]"
                      >
                        {workflowState === 'verifying' || isSubmittingOrder ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                            <span>Transmitting...</span>
                          </span>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4 shrink-0" />
                            <span>Verify & Send to Pharmacy ➔</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}


      {/* ============================================================ */}
      {/* 4. STEP: SUCCESS & HEALTH AUTOMATIONS (verified)             */}
      {/* ============================================================ */}
      {workflowState === 'verified' && confirmationResult && (
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
                Your prescription <strong className="text-[#00a896]">#{confirmationResult.prescription.id}</strong> has been verified and processed according to your chosen workflow.
              </p>
            </div>
          </div>

          {/* VISUAL WORKFLOW SPLIT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. PHARMACY ORDER FULFILLMENT */}
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
                    {confirmationResult.pharmacyOrder ? 'Order Submitted' : 'Saved to Vault'}
                  </span>
                </div>

                {confirmationResult.pharmacyOrder ? (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Assigned Pharmacy:</span>
                      <span className="font-extrabold text-[#00a896] dark:text-cyan-400">
                        {confirmationResult.pharmacyOrder?.pharmacyName || selectedPharmacy?.name || 'Verified Partner Pharmacy'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Pharmacy Order ID:</span>
                      <span className="font-bold text-[#00a896] dark:text-cyan-300">
                        #{confirmationResult.pharmacyOrder?.id}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-700/50 flex items-center justify-between">
                      <span className="text-amber-900 dark:text-amber-200 font-sans font-bold">Live Status:</span>
                      <span className="font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Pending Pharmacist Verification
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300">
                      Saved to Digital Health Locker
                    </p>
                    <p>
                      No pharmacy order was transmitted. The prescription record has been securely archived in your personal medical records.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                {confirmationResult.pharmacyOrder && (
                  <button
                    type="button"
                    onClick={() => setIsLiveTrackingOpen(true)}
                    className="flex-1 py-3 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Track Live Status Popup →</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onNavigate('pharmacy')}
                  className="py-3 px-4 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-[#00a896] dark:text-cyan-300 text-xs font-extrabold transition-all border border-teal-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Pharmacy Module</span>
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
                      <span className="text-slate-700 dark:text-slate-300 font-sans font-bold">Follow-up Directive:</span>
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
                      No follow-up detected
                    </p>
                    <p className="text-slate-500">
                      No automatic appointment reminder was needed for this prescription.
                    </p>
                  </div>
                )}
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

      {/* REGISTERED PHARMACY SELECTION MODAL */}
      <AnimatePresence>
        {isPharmacyPickerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden font-sans"
            >
              {/* MODAL HEADER */}
              <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#00a896] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      Select Fulfillment Pharmacy
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Choose a verified partner pharmacy to fulfill and deliver your medications
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!isSubmittingOrder) {
                      setIsPharmacyPickerOpen(false);
                      setSubmissionError(null);
                    }
                  }}
                  disabled={isSubmittingOrder}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Close pharmacy picker"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* MODAL BODY */}
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                {submissionError && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <strong className="block font-bold">Submission Failed</strong>
                      <p className="mt-0.5">{submissionError}</p>
                    </div>
                  </div>
                )}

                {/* PATIENT DELIVERY ADDRESS INPUT */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="patient-delivery-address" className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#00a896]" />
                      <span>Patient Delivery Address</span>
                      <span className="text-rose-500 font-bold">*</span>
                    </label>
                    {patientDeliveryAddress.trim() ? (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">✓ Address provided</span>
                    ) : (
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Required for home delivery</span>
                    )}
                  </div>
                  <input
                    id="patient-delivery-address"
                    type="text"
                    value={patientDeliveryAddress}
                    onChange={(e) => {
                      setPatientDeliveryAddress(e.target.value);
                      if (submissionError) setSubmissionError(null);
                    }}
                    placeholder="Enter your delivery address..."
                    disabled={isSubmittingOrder}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#00a896] transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-1">
                  <span>Available Network Pharmacies ({registeredPharmacies.length})</span>
                  <span className="flex items-center gap-1 text-[#00a896]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Live Tie-ups</span>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {registeredPharmacies.map((pharm) => {
                    const isSelected = selectedPharmacyId === pharm.id;
                    return (
                      <div
                        key={pharm.id}
                        onClick={() => {
                          if (!isSubmittingOrder) {
                            setSelectedPharmacyId(pharm.id);
                            setSubmissionError(null);
                          }
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-500/10 border-[#00a896] shadow-sm ring-1 ring-[#00a896]'
                            : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isSelected
                                  ? 'border-[#00a896] bg-[#00a896] text-white'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                  {pharm.name}
                                </h4>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  Verified
                                </span>
                              </div>

                              <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>{pharm.address}</span>
                              </p>

                              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                <span className="font-bold text-teal-700 dark:text-teal-400">
                                  📍 {pharm.distanceKm} km away
                                </span>
                                <span>•</span>
                                <span>⭐ {pharm.rating} ({pharm.reviewCount}+)</span>
                                <span>•</span>
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                  <Clock className="w-3 h-3" />
                                  <span>{pharm.deliveryTime}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate w-full sm:w-auto">
                  {selectedPharmacy ? (
                    <span>
                      Selected:{' '}
                      <strong className="text-slate-900 dark:text-white font-bold">
                        {selectedPharmacy.name}
                      </strong>
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-bold">
                      Please select a pharmacy above to continue
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isSubmittingOrder) {
                        setIsPharmacyPickerOpen(false);
                        setSubmissionError(null);
                      }
                    }}
                    disabled={isSubmittingOrder}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecutePharmacySubmission()}
                    disabled={!selectedPharmacyId || isSubmittingOrder}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-black text-xs transition-all shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isSubmittingOrder ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Order...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirm & Send to Pharmacy ➔</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIVE PHARMACY TRACKING POPUP */}
      <OrderTrackingModal
        isOpen={isLiveTrackingOpen}
        order={liveTrackingOrder || confirmationResult?.pharmacyOrder || null}
        onClose={() => setIsLiveTrackingOpen(false)}
      />
    </div>
  );
};
