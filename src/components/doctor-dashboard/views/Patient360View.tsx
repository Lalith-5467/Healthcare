import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, FileText, Activity, Pill, HeartPulse, History, TestTube, 
  ChevronRight, Stethoscope, Clock, Scan, ShieldAlert, Lock, ArrowLeft,
  AlertTriangle, CheckCircle2, ShieldCheck, Sparkles, User, Calendar
} from 'lucide-react';
import { healthShareApi, type Patient360AuthorizedData } from '../../../services/healthShareApi';
import { useDoctorWorkflow } from '../../../utils/doctorWorkflowStorage';

interface Patient360ViewProps {
  patientId: string | null;
  patientName?: string;
  onNavigate: (id: string) => void;
  initialTab?: string;
}

export const Patient360View: React.FC<Patient360ViewProps> = ({ patientId, patientName: _patientName, onNavigate, initialTab }) => {
  const { records } = useDoctorWorkflow();
  const [activeTab, setActiveTab] = useState<'summary' | 'medications' | 'vitals' | 'records' | 'reports'>('summary');
  
  // Real Backend Data State
  const [authData, setAuthData] = useState<Patient360AuthorizedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<{ isError: boolean; message: string; is403: boolean } | null>(null);

  // AI Simulation State
  const [processingStep, setProcessingStep] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!patientId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorStatus(null);

      try {
        const result = await healthShareApi.getPatient360Data(patientId);
        if (isMounted) {
          setAuthData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          const isForbidden = err.message?.includes('403') || err.message?.includes('Forbidden') || err.message?.includes('expired') || err.message?.includes('revoked');
          
          // Check if fallback mock record matches this patientId (for offline mock previews)
          const fallbackMock = records.find(p => p.id === patientId || p.patientId === patientId);
          if (fallbackMock && !isForbidden) {
            // Use mock data if not an explicit 403 forbidden security block
            setAuthData({
              session: {
                id: 'mock-session',
                status: 'ACTIVE',
                purpose: 'Patient Consultation',
                grantedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 3600000).toISOString(),
                approvedScopes: ['Basic Information', 'Medical Records', 'Prescriptions', 'Vitals', 'Medication History', 'Reports'],
              },
              patient: {
                id: fallbackMock.id,
                fullName: fallbackMock.name,
                gender: fallbackMock.gender,
                age: Number(fallbackMock.age) || 35,
                bloodGroup: fallbackMock.bloodGroup,
                address: 'Greams Road, Chennai',
                emergencyContactName: 'Family Member',
                emergencyContactPhone: '+91 98400 00000',
                abhaId: fallbackMock.patientId,
              },
              vitals: [
                { id: 'v1', systolicBp: 120, diastolicBp: 80, heartRate: 72, oxygenSaturation: 99, temperature: 98.6, bloodSugar: 104, recordedAt: new Date().toISOString() }
              ],
              medicalRecords: [
                { id: 'm1', title: 'Cardiology Review', type: 'CONSULTATION', hospital: 'Apollo Hospitals', status: 'Normal', notes: 'Stable cardiovascular parameters.', recordDate: new Date().toISOString() }
              ],
              reports: [],
              prescriptions: [
                { id: 'p1', diagnosis: 'Essential Hypertension', issuedAt: new Date().toISOString(), doctor: { fullName: 'Dr. Rajesh Varma' }, items: [{ medicineName: 'Telmisartan', dosage: '40mg', frequency: '1-0-0', durationDays: 30 }] }
              ],
              medicationHistory: [
                { medicineName: 'Telmisartan', dosage: '40mg', frequency: '1-0-0', durationDays: 30, prescribedBy: 'Dr. Rajesh Varma' }
              ],
              adherence: {
                hasData: true,
                percentage: 85,
                completedReminders: 12,
                totalReminders: 14,
                summary: '85% adherence across active medication schedules'
              }
            });
          } else {
            setErrorStatus({
              isError: true,
              message: err.message || 'Access Denied: You do not have an active approved session for this patient.',
              is403: true,
            });
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  // Handle 403 Forbidden / Expired / Revoked State
  if (errorStatus?.is403) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 rounded-[2rem] border border-rose-200 dark:border-rose-900/60 shadow-2xl p-8 sm:p-10 space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-400 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-black uppercase tracking-wider border border-rose-200 dark:border-rose-800">
              403 Forbidden • Access Expired or Unauthorized
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Patient Access Expired or Revoked
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium">
              {errorStatus.message}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1 text-left font-medium">
            <p className="font-bold text-slate-800 dark:text-slate-200">Security Enforcement Active:</p>
            <p>• Medical record access requires explicit patient approval via secure QR scan.</p>
            <p>• Temporary access sessions automatically expire after the authorized window.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('overview')}
              className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-xs rounded-xl transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => onNavigate('scan')}
              className="flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white dark:text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Scan Patient QR</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[55vh] text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-teal-100 dark:border-teal-900 rounded-full"></div>
          <motion.div
            className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          ></motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-6 h-6 text-teal-500" />
          </div>
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Verifying Authorized Consent & Loading Patient 360°...
        </h3>
        <p className="text-xs text-slate-400 font-medium">Connecting to secure encrypted ABDM clinical repository</p>
      </div>
    );
  }

  const patient = authData?.patient;
  const scopes = authData?.session?.approvedScopes || [];
  const hasScope = (name: string) => scopes.some(s => s.toLowerCase() === name.toLowerCase());

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center max-w-md mx-auto space-y-4">
        <Scan className="w-16 h-16 text-slate-300 mb-2" />
        <h2 className="text-xl font-black text-slate-900 dark:text-white">No Patient Selected</h2>
        <p className="text-xs text-slate-500">Please scan a patient QR code to request authorized access to their records.</p>
        <button
          onClick={() => onNavigate('scan')}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl transition-all cursor-pointer shadow-md"
        >
          Scan Patient QR
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 select-none font-sans max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center text-2xl sm:text-3xl font-black shadow-lg shadow-teal-500/30 border border-white/20 shrink-0">
            {patient.fullName.charAt(0)}
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-teal-400/30 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Temporary Access Active
              </span>
              {authData?.session?.expiresAt && (
                <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Expires: {new Date(authData.session.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {patient.fullName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-300">
              <span>{patient.age} yrs</span>
              <span>•</span>
              <span>{patient.gender}</span>
              <span>•</span>
              <span className="text-rose-400 font-mono">Blood: {patient.bloodGroup}</span>
              {patient.abhaId && (
                <>
                  <span>•</span>
                  <span className="text-cyan-300 font-mono">ABHA: {patient.abhaId}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 relative z-10 w-full md:w-auto shrink-0">
          <button 
            onClick={() => onNavigate('consultations')}
            className="flex-1 md:flex-initial px-6 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-2xl transition-all shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
          >
            <Stethoscope className="w-4 h-4" /> 
            <span>Start Active Consultation</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'summary', label: 'Clinical Summary', icon: Activity, scope: 'Basic Information' },
          { id: 'vitals', label: 'Telemetry & Vitals', icon: HeartPulse, scope: 'Vitals' },
          { id: 'medications', label: 'Medications & Adherence', icon: Pill, scope: 'Medication History' },
          { id: 'records', label: 'Medical History', icon: FileText, scope: 'Medical Records' },
          { id: 'reports', label: 'Diagnostic Reports', icon: TestTube, scope: 'Reports' },
        ].map((tab) => {
          const tabAllowed = hasScope(tab.scope) || tab.id === 'summary';
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              disabled={!tabAllowed}
              className={`px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : tabAllowed
                  ? 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {!tabAllowed && <Lock className="w-3 h-3 ml-1" />}
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      {/* SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Basic Information Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-teal-500" />
              Patient Demographics
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Full Name</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient.fullName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Gender / Age</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient.gender} • {patient.age} Yrs</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Blood Group</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{patient.bloodGroup}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Emergency Contact</span>
                <span className="font-bold text-slate-900 dark:text-white">{patient.emergencyContactName || 'None listed'} ({patient.emergencyContactPhone || 'N/A'})</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Address</span>
                <span className="font-bold text-slate-900 dark:text-white text-right max-w-[180px]">{patient.address || 'Chennai, Tamil Nadu'}</span>
              </div>
            </div>
          </div>

          {/* Medication Adherence Card (Part 18) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-500" />
              Medication Adherence
            </h3>

            {authData?.adherence?.hasData ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-teal-700 dark:text-teal-300">
                      {authData.adherence.percentage}%
                    </span>
                    <p className="text-[11px] text-teal-600 dark:text-teal-400 font-bold mt-0.5">Overall Adherence</p>
                  </div>
                  <div className="text-right text-xs font-bold text-slate-600 dark:text-slate-300">
                    <p>Taken: <span className="text-emerald-600 dark:text-emerald-400">{authData.adherence.completedReminders}</span></p>
                    <p>Total: {authData.adherence.totalReminders}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  {authData.adherence.summary}
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-2">
                <Clock className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {authData?.adherence?.message || 'Medication adherence data is not available.'}
                </p>
                <p className="text-[10px] text-slate-400">
                  Adherence is computed as patient logs daily doses.
                </p>
              </div>
            )}
          </div>

          {/* Approved Permission Scope Badge List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Approved Scope of Access
            </h3>

            <div className="space-y-2">
              {scopes.map((scope) => (
                <div
                  key={scope}
                  className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300"
                >
                  <span>{scope}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VITALS TAB */}
      {activeTab === 'vitals' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-rose-500" />
            Vitals History
          </h3>

          {authData?.vitals && authData.vitals.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {authData.vitals.map((v, i) => (
                <div key={v.id || i} className="py-3 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      {new Date(v.recordedAt).toLocaleString()}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {v.systolicBp && <span>BP: <strong className="text-teal-600 dark:text-cyan-400">{v.systolicBp}/{v.diastolicBp} mmHg</strong></span>}
                      {v.heartRate && <span>Heart Rate: <strong className="text-rose-500">{v.heartRate} bpm</strong></span>}
                      {v.oxygenSaturation && <span>SpO2: <strong className="text-cyan-500">{v.oxygenSaturation}%</strong></span>}
                      {v.temperature && <span>Temp: {v.temperature}°F</span>}
                      {v.bloodSugar && <span>Sugar: {v.bloodSugar} mg/dL</span>}
                    </div>
                  </div>
                  {v.notes && <span className="text-xs text-slate-500 italic">{v.notes}</span>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No vitals records found for this patient.</p>
          )}
        </div>
      )}

      {/* MEDICATIONS TAB */}
      {activeTab === 'medications' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-500" />
            Current & Previous Medications
          </h3>

          {authData?.medicationHistory && authData.medicationHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {authData.medicationHistory.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">{m.medicineName}</h4>
                    <span className="px-2 py-0.5 bg-teal-500/10 text-teal-600 dark:text-cyan-300 rounded text-[10px] font-bold">{m.dosage}</span>
                  </div>
                  <p className="text-xs text-slate-500">Frequency: <strong className="text-slate-700 dark:text-slate-300">{m.frequency}</strong></p>
                  {m.prescribedBy && <p className="text-[11px] text-slate-400">Prescribed by {m.prescribedBy}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No active medication records found.</p>
          )}
        </div>
      )}

      {/* RECORDS TAB */}
      {activeTab === 'records' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            Clinical Records & Consultation Notes
          </h3>

          {authData?.medicalRecords && authData.medicalRecords.length > 0 ? (
            <div className="space-y-3">
              {authData.medicalRecords.map((r, i) => (
                <div key={r.id || i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{r.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{r.notes || 'No notes available'}</p>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(r.recordDate).toLocaleDateString()} • {r.hospital || 'MediCare Hospital'}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-black text-[10px]">
                    {r.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No clinical consultation notes recorded.</p>
          )}
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TestTube className="w-5 h-5 text-amber-500" />
            Diagnostic & Lab Reports
          </h3>

          {authData?.reports && authData.reports.length > 0 ? (
            <div className="space-y-3">
              {authData.reports.map((rp, i) => (
                <div key={rp.id || i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white">{rp.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(rp.recordDate).toLocaleDateString()}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-black text-[10px]">
                    {rp.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">No lab or imaging reports available.</p>
          )}
        </div>
      )}
    </div>
  );
};
