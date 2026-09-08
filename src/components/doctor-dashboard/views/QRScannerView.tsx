import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scan, Camera, Upload, ShieldCheck, CheckCircle2, User, Building2, 
  Stethoscope, FileText, Clock, AlertCircle, ArrowLeft, Send, Sparkles, Check,
  XCircle, ArrowRight, Eye, RefreshCw
} from 'lucide-react';
import { healthShareApi, type ValidateQRResponse } from '../../../services/healthShareApi';
import { socketService } from '../../../services/socketService';

interface QRScannerViewProps {
  onScanSuccess?: (patientId: string) => void;
  onNavigateToDashboard?: () => void;
}

type ScanStage = 'SCANNING' | 'ACCESS_REQUEST' | 'WAITING_APPROVAL';

export const QRScannerView: React.FC<QRScannerViewProps> = ({ 
  onScanSuccess, 
  onNavigateToDashboard 
}) => {
  const [stage, setStage] = useState<ScanStage>('SCANNING');
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Validation payload from backend
  const [validationData, setValidationData] = useState<ValidateQRResponse | null>(null);

  // Access Request Form State
  const [selectedPurpose, setSelectedPurpose] = useState('Patient Consultation');
  const [selectedScopes, setSelectedScopes] = useState<string[]>([
    'Basic Information',
    'Medical Records',
    'Prescriptions',
    'Vitals',
    'Medication History',
    'Reports',
  ]);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);
  const [requestStatus, setRequestStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Real-time Socket.IO approval listener + Fallback Polling
  useEffect(() => {
    if (stage !== 'WAITING_APPROVAL' || !validationData) return;

    let isSubscribed = true;

    // Direct fetch function for fallback / immediate verification
    const verifyApprovalStatus = async () => {
      try {
        const doctorRequests = await healthShareApi.getDoctorRequests();
        if (!isSubscribed) return;

        const match = doctorRequests.find((r) => 
          (submittedRequestId && r.id === submittedRequestId) ||
          (r.patientId === validationData.patient.id && (r.status === 'APPROVED' || r.status === 'REJECTED'))
        );

        if (match) {
          if (match.status === 'APPROVED') {
            setRequestStatus('APPROVED');
          } else if (match.status === 'REJECTED') {
            setRequestStatus('REJECTED');
          }
        }
      } catch {
        // Silently handle transient errors
      }
    };

    // Initial check
    verifyApprovalStatus();

    // 1. Subscribe to Socket.IO real-time events
    const unsubscribeSocket = socketService.subscribeToHealthShareEvents((event) => {
      if (!isSubscribed) return;
      const eventType = (event as any).type || (event as any).event;
      
      if (
        eventType === 'ACCESS_APPROVED' ||
        eventType === 'health-share:request-approved'
      ) {
        if (
          !submittedRequestId ||
          event.requestId === submittedRequestId ||
          event.patientId === validationData.patient.id
        ) {
          setRequestStatus('APPROVED');
        }
      } else if (
        eventType === 'ACCESS_REJECTED' ||
        eventType === 'health-share:request-rejected'
      ) {
        if (
          !submittedRequestId ||
          event.requestId === submittedRequestId ||
          event.patientId === validationData.patient.id
        ) {
          setRequestStatus('REJECTED');
        }
      }
    });

    // 2. Fallback polling every 2.5 seconds
    const intervalId = setInterval(verifyApprovalStatus, 2500);

    return () => {
      isSubscribed = false;
      unsubscribeSocket();
      clearInterval(intervalId);
    };
  }, [stage, submittedRequestId, validationData]);

  const handleValidateToken = async (tokenString: string) => {
    setIsScanning(true);
    setErrorMessage(null);
    try {
      const data = await healthShareApi.validateQRToken(tokenString.trim());
      setValidationData(data);
      if (data.availablePurposes?.length) {
        setSelectedPurpose(data.availablePurposes[0]);
      }
      if (data.availableScopes?.length) {
        setSelectedScopes(data.availableScopes);
      }
      setStage('ACCESS_REQUEST');
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired QR token. Please verify and try again.');
    } finally {
      setIsScanning(false);
      setIsCameraActive(false);
    }
  };

  const handleDemoScan = async () => {
    setIsScanning(true);
    try {
      const token = 'MED-QR-DEMO-TEST-PATIENT';
      await handleValidateToken(token);
    } catch {
      try {
        const genRes = await healthShareApi.generateQRToken(30);
        await handleValidateToken(genRes.token);
      } catch (e: any) {
        setErrorMessage(e.message || 'Could not validate test patient QR token');
        setIsScanning(false);
      }
    }
  };

  const handleToggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  const handleSendAccessRequest = async () => {
    if (!validationData) return;
    if (selectedScopes.length === 0) {
      setErrorMessage('Please select at least one permission scope to request access.');
      return;
    }

    setIsSubmittingRequest(true);
    setErrorMessage(null);

    try {
      const res: any = await healthShareApi.createAccessRequest({
        token: validationData.token,
        purpose: selectedPurpose,
        permissionScope: selectedScopes,
      });
      const reqId = res?.requestId || res?.request?.id || res?.id || null;
      setSubmittedRequestId(reqId);
      setRequestStatus('PENDING');
      setStage('WAITING_APPROVAL');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send access request to patient');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const handleResetScanner = () => {
    setStage('SCANNING');
    setValidationData(null);
    setManualToken('');
    setErrorMessage(null);
    setIsCameraActive(false);
    setRequestStatus('PENDING');
    setSubmittedRequestId(null);
  };

  const handleOpenPatient360 = () => {
    if (validationData?.patient?.id && onScanSuccess) {
      onScanSuccess(validationData.patient.id);
    } else if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* 1. STAGE: SCANNING */}
      {stage === 'SCANNING' && (
        <div>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Scan Patient QR
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
              Scan the patient's secure temporary MediCare Health QR code to request authorized clinical access.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative"
          >
            {/* Security Indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full text-xs font-bold border border-teal-200 dark:border-teal-800/50">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-PHI Encrypted QR</span>
            </div>

            {/* Scanner Viewport */}
            <div className="aspect-square sm:aspect-video bg-slate-950 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900 via-slate-900 to-black"></div>

              {/* Target Frame */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-400 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-400 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-400 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-400 rounded-br-xl"></div>

                {/* Laser scan animation */}
                {(isScanning || isCameraActive) && (
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                    className="absolute left-0 w-full h-1 bg-teal-400 shadow-[0_0_16px_4px_rgba(45,212,191,0.6)] z-10 rounded-full"
                  />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <Scan
                    className={`w-14 h-14 ${
                      isCameraActive ? 'text-teal-400' : 'text-white/25'
                    } ${isScanning || isCameraActive ? 'animate-pulse' : ''}`}
                  />
                  <p className="text-xs font-bold text-slate-300 mt-3">
                    Point camera at the patient's MediCare Health QR
                  </p>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border-t border-b border-rose-200 dark:border-rose-800/60 flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs font-bold">
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Controls & Manual Token Input */}
            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsCameraActive(true)}
                  disabled={isScanning || isCameraActive}
                  className={`flex-1 py-3 font-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isCameraActive
                      ? 'bg-teal-500/10 text-teal-600 border border-teal-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  {isCameraActive ? 'Camera Active' : 'Start Camera'}
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={() => handleDemoScan()}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Upload QR Image
                </button>
              </div>

              {/* Manual Token Verification Entry */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  Or enter secure QR reference token directly:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value.toUpperCase())}
                    placeholder="e.g. MED-QR-A1B2-C3D4-E5F6"
                    className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-teal-500 uppercase placeholder:normal-case"
                  />
                  <button
                    type="button"
                    onClick={() => handleValidateToken(manualToken)}
                    disabled={!manualToken || isScanning}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isScanning ? 'Verifying...' : 'Validate QR'}
                  </button>
                </div>
              </div>

              {/* Demo Scan */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemoScan}
                  disabled={isScanning}
                  className="text-xs font-black text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  {isScanning ? 'Validating Token...' : 'Test with sample patient QR'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 2. STAGE: ACCESS REQUEST (NO MEDICAL DATA DISPLAYED) */}
      {stage === 'ACCESS_REQUEST' && validationData && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-black uppercase tracking-wider mb-2 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Patient Identified Successfully</span>
              </div>
              <h2 className="text-2xl font-black">Patient Access Request</h2>
              <p className="text-xs text-teal-50 mt-0.5">
                Medical records are confidential. Request patient consent to view authorized data.
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {errorMessage && (
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2.5 text-rose-700 dark:text-rose-300 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Identified Patient Identity Card (Basic Info Only) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-700 dark:text-teal-300 flex items-center justify-center font-black text-xl font-mono border border-teal-500/30">
                  {validationData.patient.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {validationData.patient.fullName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-300/40">
                      Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>{validationData.patient.age} Yrs</span>
                    <span>•</span>
                    <span>{validationData.patient.gender}</span>
                    <span>•</span>
                    <span className="text-rose-600 dark:text-rose-400">
                      Blood Group: {validationData.patient.bloodGroup}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs font-mono font-bold text-slate-400">
                Token: <span className="text-teal-600 dark:text-teal-400">{validationData.token}</span>
              </div>
            </div>

            {/* Authenticated Doctor Details (Retrieved from DB Session) */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                Doctor Requesting Access
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Doctor Name</span>
                  <span className="font-black text-slate-900 dark:text-white">{validationData.doctor.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Doctor / License ID</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{validationData.doctor.licenseNumber || validationData.doctor.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Hospital / Clinic</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{validationData.doctor.hospital}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Specialization & Dept</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{validationData.doctor.speciality}</span>
                </div>
              </div>
            </div>

            {/* Access Purpose Dropdown */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Purpose of Access
              </label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
              >
                {validationData.availablePurposes.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Permission Scope Checkboxes */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Requested Information Scope
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {validationData.availableScopes.map((scope) => {
                  const checked = selectedScopes.includes(scope);
                  return (
                    <button
                      type="button"
                      key={scope}
                      onClick={() => handleToggleScope(scope)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        checked
                          ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200 font-black'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold'
                      }`}
                    >
                      <span className="text-xs">{scope}</span>
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          checked ? 'bg-teal-600 text-white' : 'border border-slate-400'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={handleResetScanner}
                disabled={isSubmittingRequest}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSendAccessRequest}
                disabled={isSubmittingRequest || selectedScopes.length === 0}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingRequest ? 'Sending Request...' : 'Send Access Request'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. STAGE: WAITING OR APPROVED/REJECTED STATE */}
      {stage === 'WAITING_APPROVAL' && validationData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 text-center max-w-xl mx-auto space-y-6"
        >
          {/* Status Header / Icon */}
          {requestStatus === 'APPROVED' ? (
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : requestStatus === 'REJECTED' ? (
            <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <XCircle className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-400 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Clock className="w-10 h-10 animate-spin" />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              {requestStatus === 'APPROVED' 
                ? 'Access Approved & Active ✓' 
                : requestStatus === 'REJECTED' 
                ? 'Access Request Declined' 
                : 'Access Request Sent ✓'}
            </h2>
            <p className="text-sm font-bold text-teal-600 dark:text-teal-400 mt-1">
              Patient: {validationData.patient.fullName}
            </p>
          </div>

          {/* Details Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Requested by:</span>
              <span className="font-black text-slate-900 dark:text-white">{validationData.doctor.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Purpose:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPurpose}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-400 font-bold">Status:</span>
              {requestStatus === 'APPROVED' ? (
                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-[11px] border border-emerald-400/50 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ACCESS APPROVED / ACTIVE
                </span>
              ) : requestStatus === 'REJECTED' ? (
                <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-black text-[11px] border border-rose-400/50 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  REQUEST REJECTED / DECLINED
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-black text-[11px] border border-amber-300/40 animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  WAITING FOR PATIENT APPROVAL
                </span>
              )}
            </div>
          </div>

          {/* Description text */}
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            {requestStatus === 'APPROVED'
              ? 'Consent granted by patient. Clinical records, medications, vitals, and AI summaries are now unlocked for this authorized session.'
              : requestStatus === 'REJECTED'
              ? 'The patient declined this access request. No medical records can be accessed without explicit patient authorization.'
              : 'The patient has received a notification and must click "ACCEPT & SHARE" on their device before clinical health records can be viewed.'}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {requestStatus === 'APPROVED' ? (
              <>
                <button
                  type="button"
                  onClick={handleOpenPatient360}
                  className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Patient 360° & AI Records</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetScanner}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl transition-all cursor-pointer"
                >
                  Scan Another
                </button>
              </>
            ) : requestStatus === 'REJECTED' ? (
              <>
                <button
                  type="button"
                  onClick={handleResetScanner}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl transition-all cursor-pointer"
                >
                  Scan Another Patient
                </button>
                <button
                  type="button"
                  onClick={onNavigateToDashboard || handleResetScanner}
                  className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl transition-all cursor-pointer"
                >
                  Dashboard
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onNavigateToDashboard || handleResetScanner}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
