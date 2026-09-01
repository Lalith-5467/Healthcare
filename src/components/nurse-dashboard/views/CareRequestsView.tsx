import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MapPin, Clock, FileText, CheckCircle2, X } from 'lucide-react';
import { useNurseWorkflow, type CareRequest } from '../../../utils/nurseWorkflowStorage';

export const CareRequestsView: React.FC = () => {
  const { bookings, updateBookingStatus } = useNurseWorkflow();
  const pendingRequests = bookings.filter(b => b.status === 'Pending');

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Care Requests
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Review and accept incoming patient bookings.
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center border border-amber-200 dark:border-amber-800">
          <Bell className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {pendingRequests.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No pending requests</h3>
              <p className="text-slate-500 dark:text-slate-400">You have responded to all care requests.</p>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, margin: 0 }}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-black text-slate-500 border border-slate-200 dark:border-slate-700">
              {request.patientName.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md mb-1 inline-block">
                NEW REQUEST
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{request.patientName}</h3>
              <p className="text-sm font-medium text-slate-500">{request.patientAge}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400">Just now</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Service Needed</span>
            <p className="text-sm font-black text-slate-900 dark:text-white">{request.serviceType}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Date & Time</span>
            <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              {request.prefDate} at {request.time}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
            <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {request.location}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Instructions</span>
            <p className="text-sm font-black text-slate-900 dark:text-white flex items-start gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{request.instructions}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onReject}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" /> Reject
          </button>
          <button 
            onClick={onAccept}
            className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black rounded-xl transition-colors shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Accept Request
          </button>
        </div>
      </div>
    </motion.div>
  );
};
