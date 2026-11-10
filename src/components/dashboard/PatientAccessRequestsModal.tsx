import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Stethoscope, Building2, Check, XCircle, Clock, 
  AlertCircle, Lock, RefreshCw, Eye, ShieldAlert, Sparkles, Calendar 
} from 'lucide-react';
import { healthShareApi, type AccessRequestItem } from '../../services/healthShareApi';
import { socketService } from '../../services/socketService';
import { showGlobalToast } from '../common/GlobalToastManager';
import { useLanguage } from '../../context/LanguageContext';

interface PatientAccessRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast?: (msg: string) => void;
}

export const PatientAccessRequestsModal: React.FC<PatientAccessRequestsModalProps> = ({
  isOpen,
  onClose,
  onToast
}) => {
  const { t } = useLanguage();
  const [requests, setRequests] = useState<AccessRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [, setClockTick] = useState(0);

  // Live timer tick every 10 seconds for active session remaining countdowns
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setClockTick((prev) => prev + 1), 10000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const [selectedScopesMap, setSelectedScopesMap] = useState<Record<string, string[]>>({});

  const formatDoc = (name?: string | null) => {
    if (!name || !name.trim()) return 'Attending Doctor';
    const trimmed = name.trim();
    if (/^dr\.?\s+/i.test(trimmed)) return trimmed;
    return `Dr. ${trimmed}`;
  };

  // Professional Clinical Date & Time Formatter
  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;

    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();

    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();

    const timeFormatted = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateFormatted = d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

    let relativeLabel = `${dateFormatted}, ${timeFormatted}`;
    if (isToday) {
      relativeLabel = `Today at ${timeFormatted}`;
    } else if (isYesterday) {
      relativeLabel = `Yesterday at ${timeFormatted}`;
    }

    return {
      dateFormatted,
      timeFormatted,
      relativeLabel,
      full: `${dateFormatted} • ${timeFormatted}`,
    };
  };

  // Remaining active session duration helper
  const getRemainingTime = (expiresAtStr?: string | null) => {
    if (!expiresAtStr) return null;
    const exp = new Date(expiresAtStr).getTime();
    const now = Date.now();
    const diff = exp - now;
    if (diff <= 0) return 'Expired';
    const totalMinutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m remaining`;
    }
    return `${Math.max(1, mins)}m remaining`;
  };

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const rawData = await healthShareApi.getPatientRequests();
      const data = (rawData || []).map((r) => ({
        ...r,
        doctorName: formatDoc(r.doctorName),
      }));
      setRequests(data);
      // Initialize selected scopes map for pending requests if not set
      setSelectedScopesMap((prev) => {
        const next = { ...prev };
        data.forEach((r) => {
          if (!next[r.id] && Array.isArray(r.permissionScope)) {
            next[r.id] = [...r.permissionScope];
          }
        });
        return next;
      });
    } catch (err) {
      console.warn('Failed to load patient access requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // Immediately dismiss any floating access request toasts when modal opens so they never overlap
    window.dispatchEvent(new CustomEvent('dismiss_access_request_toasts'));
    window.dispatchEvent(new CustomEvent('access_modal_state', { detail: { isOpen: true } }));

    fetchRequests();
    const intervalId = setInterval(fetchRequests, 3500);

    const handleUpdate = () => fetchRequests();
    window.addEventListener('notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('health-share:request-created', handleUpdate);

    let crossBc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        crossBc = new BroadcastChannel('health_share_channel');
        crossBc.onmessage = () => {
          fetchRequests();
        };
      } catch {}
    }

    const unsubHealth = socketService.subscribeToHealthShareEvents(() => {
      fetchRequests();
    });

    const unsubNotif = socketService.subscribeToNotifications(() => {
      fetchRequests();
    });

    return () => {
      window.dispatchEvent(new CustomEvent('access_modal_state', { detail: { isOpen: false } }));
      clearInterval(intervalId);
      window.removeEventListener('notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('health-share:request-created', handleUpdate);
      crossBc?.close();
      unsubHealth();
      unsubNotif();
    };
  }, [isOpen]);

  const toggleScope = (requestId: string, scopeName: string) => {
    setSelectedScopesMap((prev) => {
      const current = prev[requestId] || [];
      const updated = current.includes(scopeName)
        ? current.filter((s) => s !== scopeName)
        : [...current, scopeName];
      return { ...prev, [requestId]: updated };
    });
  };

  const handleApprove = async (requestId: string, doctorName = 'the doctor') => {
    if (processingId) return;
    setProcessingId(requestId);
    try {
      const scopesToApprove = selectedScopesMap[requestId] && selectedScopesMap[requestId].length > 0
        ? selectedScopesMap[requestId]
        : undefined;

      await healthShareApi.approveRequest(requestId, scopesToApprove, 60);
      const successMsg = `✓ Approved temporary health record access for ${doctorName}`;
      if (onToast) onToast(successMsg);
      else showGlobalToast(successMsg, 'success');

      // Optimistic instant state update
      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: 'APPROVED' as const, grantedAt: now.toISOString(), expiresAt: expires, permissionScope: scopesToApprove || r.permissionScope }
            : r
        )
      );

      window.dispatchEvent(new Event('notifications_updated'));
      await fetchRequests();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to approve access request';
      if (onToast) onToast(errMsg);
      else showGlobalToast(errMsg, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string, doctorName = 'the doctor') => {
    if (processingId) return;
    setProcessingId(requestId);
    try {
      await healthShareApi.rejectRequest(requestId);
      const msg = `Declined health record access for ${doctorName}`;
      if (onToast) onToast(msg);
      else showGlobalToast(msg, 'info');

      // Optimistic instant state update
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: 'REJECTED' as const }
            : r
        )
      );

      window.dispatchEvent(new Event('notifications_updated'));
      await fetchRequests();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to decline access request';
      if (onToast) onToast(errMsg);
      else showGlobalToast(errMsg, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRevoke = async (requestId: string, doctorName = 'the doctor') => {
    if (processingId) return;
    setProcessingId(requestId);
    try {
      await healthShareApi.revokeSession(requestId);
      const msg = `🔒 Revoked active access session for ${doctorName}`;
      if (onToast) onToast(msg);
      else showGlobalToast(msg, 'warning');

      // Optimistic instant state update
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: 'REVOKED' as const }
            : r
        )
      );

      window.dispatchEvent(new Event('notifications_updated'));
      await fetchRequests();
    } catch (err: any) {
      const errMsg = err.message || 'Failed to revoke access session';
      if (onToast) onToast(errMsg);
      else showGlobalToast(errMsg, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const activeSessions = requests.filter((r) => r.status === 'APPROVED');
  const historyRequests = requests.filter((r) => r.status === 'REJECTED' || r.status === 'EXPIRED' || r.status === 'REVOKED');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="access-requests-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 dark:bg-slate-950/85 backdrop-blur-md font-sans"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-between shrink-0">
              <h2 className="text-xl font-black tracking-tight">{t('requests.modal_title', 'Doctor Access Request')}</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchRequests}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer active:scale-95"
                  title={t('requests.refresh', 'Refresh Requests')}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer z-50"
                  aria-label={t('requests.close', 'Close modal')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

          {/* Body List */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* 1. PENDING REQUESTS */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {t('requests.pending_title', 'Pending Doctor Access Requests ({{count}})').replace('{{count}}', pendingRequests.length.toString())}
              </h3>

              {pendingRequests.length === 0 ? (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-400 space-y-1">
                  <ShieldCheck className="w-6 h-6 text-teal-500/40 mx-auto" />
                  <p className="font-bold text-slate-600 dark:text-slate-300">
                    {t('requests.no_pending', 'No pending access requests at this moment.')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    When a doctor scans your QR code or submits a record request, it will appear here for your review and consent.
                  </p>
                </div>
              ) : (
                pendingRequests.map((req) => {
                  const currentScopes = selectedScopesMap[req.id] || req.permissionScope || [];
                  const isProcessing = processingId === req.id;

                  return (
                    <div
                      key={req.id}
                      className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 space-y-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                              {req.doctorName || 'Attending Doctor'}
                            </h4>
                            {(req.doctorLicense || req.doctorId) && (
                              <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                                License: {req.doctorLicense || req.doctorId}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                            {[req.doctorSpeciality, req.doctorHospital, req.doctorQualification].filter(Boolean).join(' • ')}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-amber-200/50 dark:border-amber-900/40 text-xs text-slate-600 dark:text-slate-300 font-medium">
                            <span className="inline-flex items-center gap-1.5 text-amber-950 dark:text-amber-200 font-bold bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-300/70 dark:border-amber-800/60 text-[11px] font-mono">
                              <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                              <span>Requested: {formatDateTime(req.requestedAt)?.relativeLabel || 'Today'}</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                              <Clock className="w-3 h-3" />
                              <span>Standard 60-min session</span>
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 animate-pulse shrink-0">
                          Requires Consent
                        </span>
                      </div>

                      {/* Request Purpose & Scope Details */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 text-xs space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-bold">Clinical Purpose:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white">{req.purpose}</span>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-bold">
                              Requested Record Permissions (Select to Grant):
                            </span>
                            <span className="text-[10px] text-teal-600 dark:text-cyan-400 font-mono font-bold">
                              {currentScopes.length} selected
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {req.permissionScope.map((scope) => {
                              const isChecked = currentScopes.includes(scope);
                              return (
                                <button
                                  key={scope}
                                  type="button"
                                  onClick={() => toggleScope(req.id, scope)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                    isChecked
                                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 border-teal-300 dark:border-teal-700 shadow-xs'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 opacity-60'
                                  }`}
                                >
                                  <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${
                                    isChecked ? 'bg-teal-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                                  }`}>
                                    {isChecked && '✓'}
                                  </span>
                                  <span>{scope}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Security & Consequence of Granting Access Notice */}
                        <div className="p-3 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 text-[11px] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
                            <ShieldAlert className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>Consent & Privacy Notice</span>
                          </div>
                          <p className="text-teal-950 dark:text-teal-200/90 leading-relaxed font-normal">
                            Granting consent allows <strong className="font-extrabold">{req.doctorName}</strong> temporary read-only access to your selected records for 60 minutes under ABDM guidelines. Access automatically expires and can be revoked at any time. Unchecked records will not be shared.
                          </p>
                        </div>
                      </div>

                      {/* Actions: Reject & Accept & Share */}
                      <div className="flex items-center justify-end gap-3 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleReject(req.id, req.doctorName);
                          }}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isProcessing ? 'Processing...' : 'Reject'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleApprove(req.id, req.doctorName);
                          }}
                          disabled={isProcessing || currentScopes.length === 0}
                          className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          <span>{isProcessing ? 'Processing...' : 'Accept & Share'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 2. ACTIVE ACCESS SESSIONS (WITH REVOCATION) */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {t('requests.active_title', 'Active Doctor Access Sessions ({{count}})').replace('{{count}}', activeSessions.length.toString())}
              </h3>

              {activeSessions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-400">
                  {t('requests.no_active', 'No active approved doctor sessions.')}
                </div>
              ) : (
                activeSessions.map((session) => {
                  const granted = formatDateTime(session.grantedAt || session.requestedAt);
                  const effectiveExpires = session.expiresAt || (session.grantedAt ? new Date(new Date(session.grantedAt).getTime() + 60*60*1000).toISOString() : new Date(Date.now() + 45*60*1000).toISOString());
                  const expires = formatDateTime(effectiveExpires);
                  const remaining = getRemainingTime(effectiveExpires);

                  return (
                    <div
                      key={session.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-3.5"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <h4 className="text-sm font-black text-slate-900 dark:text-white">
                              {session.doctorName}
                            </h4>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[10px] font-black uppercase tracking-wider border border-emerald-300 dark:border-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {t('records_card.status_active', 'ACTIVE')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                            {[session.doctorSpeciality, session.doctorHospital, session.doctorQualification].filter(Boolean).join(' • ')}
                          </p>
                          {session.purpose && (
                            <p className="text-[11px] text-teal-800 dark:text-cyan-300 font-semibold">
                              Purpose: {session.purpose}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRevoke(session.id, session.doctorName)}
                          disabled={processingId === session.id}
                          className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{processingId === session.id ? 'Revoking...' : t('requests.revoke', 'Revoke Session')}</span>
                        </button>
                      </div>

                      {/* Date & Time Schedule Box */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-white/90 dark:bg-slate-950/60 border border-emerald-200/80 dark:border-emerald-900/50 text-xs">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Access Granted</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                              {granted?.relativeLabel || 'Today'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Access Valid Until</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                                {expires?.relativeLabel || 'Today'}
                              </span>
                              {remaining && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/70 dark:border-emerald-800/70">
                                  {remaining}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shared Record Scope Tags */}
                      {session.permissionScope && session.permissionScope.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[11px] font-bold text-slate-400 mr-1">Shared Permissions:</span>
                          {session.permissionScope.map((scope: string) => (
                            <span
                              key={scope}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-[10px] font-bold"
                            >
                              ✓ {scope}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* 3. RECENT ACCESS HISTORY */}
            {historyRequests.length > 0 && (
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('requests.history_title', 'Previous Access Requests ({{count}})').replace('{{count}}', historyRequests.length.toString())}</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Clinical Audit Trail
                  </span>
                </div>

                <div className="space-y-2.5">
                  {historyRequests.slice(0, 10).map((h) => {
                    const reqDate = formatDateTime(h.requestedAt);
                    const grantedDate = formatDateTime(h.grantedAt);
                    const expiresDate = formatDateTime(h.expiresAt);
                    const revokedDate = formatDateTime(h.revokedAt);

                    const isExpired = h.status === 'EXPIRED';
                    const isRejected = h.status === 'REJECTED';
                    const isRevoked = h.status === 'REVOKED';

                    return (
                      <div
                        key={h.id}
                        className="p-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-colors space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-black text-slate-900 dark:text-white">
                                {h.doctorName}
                              </h4>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <span className="text-xs font-bold text-teal-700 dark:text-cyan-400">
                                {h.purpose}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {[h.doctorSpeciality, h.doctorHospital].filter(Boolean).join(' • ')}
                            </p>
                          </div>

                          {/* Status Pill Badge */}
                          <div className="shrink-0 flex items-center gap-2">
                            {isExpired && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-200/80 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>EXPIRED</span>
                              </span>
                            )}
                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                <XCircle className="w-3 h-3 text-rose-500" />
                                <span>DECLINED</span>
                              </span>
                            )}
                            {isRevoked && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Lock className="w-3 h-3 text-amber-600" />
                                <span>REVOKED</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date and Time Audit Details */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/40 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {reqDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-400 font-sans">Requested:</span>
                              <strong className="text-slate-700 dark:text-slate-300 font-mono">{reqDate.full}</strong>
                            </span>
                          )}

                          {isExpired && (expiresDate || grantedDate) && (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-slate-400 font-sans">Expired:</span>
                              <strong className="text-slate-700 dark:text-slate-300 font-mono">
                                {(expiresDate || grantedDate)?.full}
                              </strong>
                            </span>
                          )}

                          {isRevoked && revokedDate && (
                            <span className="inline-flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-500" />
                              <span className="text-slate-400 font-sans">Revoked:</span>
                              <strong className="text-amber-700 dark:text-amber-300 font-mono">{revokedDate.full}</strong>
                            </span>
                          )}

                          {isRejected && (
                            <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                              <XCircle className="w-3 h-3" />
                              <span className="font-sans">Access Declined by Patient</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};
