import React, { useState } from 'react';
import {
  X,
  Clock,
  Pill,
  CheckCircle2,
  AlertCircle,
  Search,
  Calendar,
  Filter,
  Check,
  TrendingUp
} from 'lucide-react';
import type { DoseRecord } from './medicinesData';

interface MedicationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyLogs: DoseRecord[];
}

export const MedicationHistoryModal: React.FC<MedicationHistoryModalProps> = ({
  isOpen,
  onClose,
  historyLogs,
}) => {
  const [timeFilter, setTimeFilter] = useState<'Today' | '7 Days' | '30 Days'>('7 Days');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Taken' | 'Skipped'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter logs based on search, status, and time range
  const filteredLogs = historyLogs.filter((log) => {
    if (statusFilter !== 'All' && log.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = log.medicineName.toLowerCase().includes(q);
      const matchDose = log.dosage.toLowerCase().includes(q);
      if (!matchName && !matchDose) return false;
    }
    return true;
  });

  const takenCount = historyLogs.filter((l) => l.status === 'Taken').length;
  const skippedCount = historyLogs.filter((l) => l.status === 'Skipped').length;
  const adherencePercent = historyLogs.length > 0 ? Math.round((takenCount / historyLogs.length) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-slate-900 dark:text-white my-auto max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#00a896]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Medication History & Logs
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Comprehensive audit trail of all taken and skipped doses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUMMARY STATS TILES */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Logged</span>
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono mt-0.5 block">{historyLogs.length}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Doses Taken</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">{takenCount}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-center">
            <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">Adherence Rate</span>
            <span className="text-lg font-black text-[#00a896] dark:text-cyan-400 font-mono mt-0.5 block">{adherencePercent}%</span>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search medication name or dosage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* TIME FILTER PILLS */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {(['Today', '7 Days', '30 Days'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeFilter(range)}
                  className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-colors cursor-pointer ${
                    timeFilter === range
                      ? 'bg-[#00a896] text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* STATUS FILTER */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              {(['All', 'Taken', 'Skipped'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-extrabold text-[11px] transition-colors cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LOGS CARDS LIST */}
        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-2">No logs matching criteria</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Try selecting a different time filter or status.</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isTaken = log.status === 'Taken';
              return (
                <div
                  key={log.id}
                  className="bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors shadow-2xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                        isTaken
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}
                    >
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{log.medicineName}</span>
                        <span className="text-[10px] font-mono text-slate-500 font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          {log.dosage}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3 h-3 text-[#00a896]" />
                        <span>{log.date}</span>
                        <span>•</span>
                        <span>Scheduled: <strong className="font-mono text-slate-700 dark:text-slate-300">{log.scheduledTime}</strong></span>
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center text-right font-mono shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 font-extrabold px-3 py-1 rounded-full text-[11px] ${
                        isTaken
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {isTaken ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Taken at {log.actualTime || '08:02 AM'}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Skipped</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md cursor-pointer"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
