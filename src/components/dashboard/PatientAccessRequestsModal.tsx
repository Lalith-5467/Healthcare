import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShieldCheck, Stethoscope, Building2, Check, XCircle, Clock, 
  AlertCircle, Lock, RefreshCw, Eye, ShieldAlert, Sparkles 
} from 'lucide-react';
import { healthShareApi, type AccessRequestItem } from '../../services/healthShareApi';
import { showGlobalToast } from '../common/GlobalToastManager';

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
  const [requests, setRequests] = useState<AccessRequestItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await healthShareApi.getPatientRequests();
      setRequests(data);
    } catch (err) {
      console.warn('Failed to load patient access requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    fetchRequests();
    const intervalId = setInterval(fetchRequests, 2500);

    return () => {
      clearInterval(intervalId);
    };
  }, [isOpen]);

  const handleApprove = async (requestId: string, doctorName = 'the doctor') => {
    if (processingId) return;
    setProcessingId(requestId);
    try {
      const res = await healthShareApi.approveRequest(requestId, undefined, 60);
      const successMsg = `✓ Approved temporary health record access for ${doctorName}`;
      if (onToast) onToast(successMsg);
      else showGlobalToast(successMsg, 'success');

      // Optimistic instant state update
      const now = new Date();
      const expires = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId
            ? { ...r, status: 'APPROVED' as const, grantedAt: now.toISOString(), expiresAt: expires }
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
            <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-between shrink-0">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-1 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ABDM Consent & Doctor Access Control</span>
                </div>
                <h2 className="text-xl font-black">Doctor Access Request</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchRequests}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Refresh Requests"
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
                  aria-label="Close modal"
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
                Pending Doctor Access Requests ({pendingRequests.length})
              </h3>

              {pendingRequests.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-400">
                  No pending access requests at this moment.
                </div>
              ) : (
                pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-700/60 space-y-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                          <h4 className="text-sm font-black text-slate-900 dark:text-white">
                            {req.doctorName || 'Dr. Venkat Raman'}
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            ID: {req.doctorLicense || req.doctorId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                          {req.doctorHospital} • {req.doctorSpeciality}
                        </p>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 animate-pulse">
                        Requires Approval
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">Purpose of Access:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{req.purpose}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 font-bold block mb-1">Requested Information:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {req.permissionScope.map((scope) => (
                            <span
                              key={scope}
                              className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 font-bold text-[10px] border border-teal-200 dark:border-teal-800/60"
                            >
                              ✓ {scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReject(req.id, req.doctorName);
                        }}
                        disabled={processingId === req.id}
                        className="px-4 py-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-700 hover:text-rose-600 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleApprove(req.id, req.doctorName);
                        }}
                        disabled={processingId === req.id}
                        className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs rounded-xl shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>{processingId === req.id ? 'Processing...' : 'Accept & Share'}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 2. ACTIVE ACCESS SESSIONS (WITH REVOCATION) */}
            <div className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Active Health Record Access ({activeSessions.length})
              </h3>

              {activeSessions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-center text-xs text-slate-400">
                  No active authorized doctor access sessions.
                </div>
              ) : (
                activeSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-300/80 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white">
                          {session.doctorName}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-[9px] font-black uppercase">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{session.doctorHospital}</p>
                      {session.expiresAt && (
                        <p className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Access expires: {new Date(session.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRevoke(session.id, session.doctorName)}
                      disabled={processingId === session.id}
                      className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      {processingId === session.id ? 'Revoking...' : 'Revoke Access'}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* 3. RECENT ACCESS HISTORY */}
            {historyRequests.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Past Access Requests & History
                </h3>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {historyRequests.slice(0, 5).map((h) => (
                    <div key={h.id} className="py-2 flex justify-between items-center text-slate-500">
                      <span>{h.doctorName} • {h.purpose}</span>
                      <span className="font-mono uppercase font-bold text-[10px]">{h.status}</span>
                    </div>
                  ))}
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
