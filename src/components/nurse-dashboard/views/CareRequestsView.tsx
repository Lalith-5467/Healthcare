import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin, Clock, FileText, CheckCircle2, X, Phone, ShieldCheck, User } from 'lucide-react';
import { useNurseWorkflow, type CareRequest } from '../../../utils/nurseWorkflowStorage';

export const CareRequestsView: React.FC = () => {
  const { bookings, updateBookingStatus } = useNurseWorkflow();
  const pendingRequests = bookings.filter(b => b.status === 'Pending');

  return (
    <div className="space-y-6 pb-16 font-sans select-none">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" /> Live Inbound Queue
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Incoming Care Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Review patient clinical care requests, procedure requirements, and dispatch schedules.
          </p>
        </div>

        <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-black text-xs rounded-2xl flex items-center gap-2 self-start sm:self-auto">
          <span>{pendingRequests.length} Pending Actions</span>
        </div>
      </div>

      {/* REQUESTS LIST */}
      <div className="space-y-4">
        <AnimatePresence>
          {pendingRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Queue Clear</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                You have evaluated all incoming patient nursing requests. New requests will appear here in real-time.
              </p>
            </motion.div>
          ) : (
            pendingRequests.map(request => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onAccept={() => updateBookingStatus(request.id, 'Accepted')}
                onReject={() => updateBookingStatus(request.id, 'Rejected')}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const RequestCard = ({ request, onAccept, onReject }: { request: CareRequest, onAccept: () => void, onReject: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 sm:p-7 space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
            {request.patientName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-md">
                NEW CARE REQUEST
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                {request.id}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              {request.patientName} ({request.patientAge})
            </h3>
            {request.patientPhone && (
              <p className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-emerald-500" />
                <span>{request.patientPhone}</span>
              </p>
            )}
          </div>
        </div>

        <div className="text-left sm:text-right font-mono">
          <span className="text-[10px] font-bold text-slate-400 uppercase block font-sans">Scheduled Slot</span>
          <strong className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">
            {request.prefDate} at {request.time}
          </strong>
          <span className="text-[11px] text-teal-600 dark:text-cyan-400 font-bold block mt-0.5">
            Distance: ~{request.distanceKm || '2.8 km'}
          </span>
        </div>
      </div>

      {/* PROCEDURE DETAILS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Procedure Required</span>
          <p className="font-black text-slate-900 dark:text-white text-sm">{request.serviceType}</p>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" /> Patient Address
          </span>
          <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">{request.location}</p>
        </div>
      </div>

      {/* CLINICAL INSTRUCTIONS */}
      <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/40 text-xs">
        <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-300 block mb-1">
          Clinical Order & Instructions:
        </span>
        <p className="text-slate-700 dark:text-slate-300 font-medium">
          {request.instructions}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3 pt-2">
        <button 
          onClick={onReject}
          className="flex-1 py-3 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-300 font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
        >
          <X className="w-4 h-4" /> Decline
        </button>
        <button 
          onClick={onAccept}
          className="flex-[2] py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-xs hover:scale-[1.01]"
        >
          <CheckCircle2 className="w-4 h-4" /> Accept Care Booking & Assign RN
        </button>
      </div>
    </motion.div>
  );
};
