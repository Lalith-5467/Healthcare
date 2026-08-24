import React, { useState } from 'react';
import { 
  FlaskConical, 
  Pill, 
  Stethoscope, 
  FileImage, 
  Building2, 
  Syringe, 
  FileText,
  Star,
  Eye,
  Download,
  Share2,
  MoreVertical,
  Trash2,
  Edit2,
  Check
} from 'lucide-react';
import type { MedicalRecordItem } from './recordsData';

interface RecordCardProps {
  record: MedicalRecordItem;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onView: (record: MedicalRecordItem) => void;
  onDownload: (record: MedicalRecordItem) => void;
  onShare: (record: MedicalRecordItem) => void;
  onDelete: (record: MedicalRecordItem) => void;
  onRename: (record: MedicalRecordItem) => void;
}

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  isSelected = false,
  onToggleSelect,
  onToggleImportant,
  onView,
  onDownload,
  onShare,
  onDelete,
  onRename
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Icon mapping
  const getIcon = () => {
    switch (record.type) {
      case 'Lab Report':
        return <FlaskConical className="w-5 h-5 text-purple-400" />;
      case 'Prescription':
        return <Pill className="w-5 h-5 text-amber-400" />;
      case 'Consultation':
        return <Stethoscope className="w-5 h-5 text-teal-400" />;
      case 'Imaging':
        return <FileImage className="w-5 h-5 text-blue-400" />;
      case 'Discharge':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'Vaccination':
        return <Syringe className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileText className="w-5 h-5 text-cyan-400" />;
    }
  };

  // Status Badge styling (subtle badges as required)
  const getStatusBadge = () => {
    switch (record.status) {
      case 'Normal':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Attention':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Reviewed':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'Pending':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0f172a] border transition-all duration-300 relative group ${
      isSelected
        ? 'border-[#00a896] bg-[#00a896]/5 shadow-lg shadow-teal-500/10'
        : 'border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 hover:shadow-xl'
    }`}>
      <div className="flex items-start sm:items-center justify-between gap-3">
        {/* LEFT: CHECKBOX & TYPE ICON */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleSelect && (
            <button
              onClick={() => onToggleSelect(record.id)}
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#00a896] border-[#00a896] text-white'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-transparent hover:border-[#00a896]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            {getIcon()}
          </div>
        </div>

        {/* CENTER: TITLE & METADATA */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 
              onClick={() => onView(record)}
              className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate hover:text-[#00a896] cursor-pointer transition-colors"
            >
              {record.title}
            </h3>

            {/* STAR BUTTON */}
            <button
              onClick={() => onToggleImportant(record.id)}
              className="p-1 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              title={record.isImportant ? 'Unstar Record' : 'Star as Important'}
            >
              <Star className={`w-3.5 h-3.5 ${record.isImportant ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="font-semibold text-teal-600 dark:text-cyan-400">{record.type}</span>
            <span>•</span>
            <span className="truncate">{record.hospital}</span>
            <span>•</span>
            <span className="font-medium text-slate-600 dark:text-slate-300">{record.doctor}</span>
            <span>•</span>
            <span className="font-mono text-slate-400">{record.date}</span>
          </p>
        </div>

        {/* RIGHT: STATUS & ACTIONS */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${getStatusBadge()}`}>
            {record.status}
          </span>

          <button
            onClick={() => onView(record)}
            className="hidden sm:flex px-3.5 py-1.5 rounded-xl bg-[#00a896]/10 hover:bg-[#00a896]/20 text-cyan-300 border border-teal-500/20 text-xs font-bold transition-all items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View</span>
          </button>

          {/* THREE-DOT MENU */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-20"
                />
                <div className="absolute right-0 top-10 w-44 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-white z-30 space-y-1 text-xs">
                  <button
                    onClick={() => { setMenuOpen(false); onView(record); }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-left font-bold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Report</span>
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onDownload(record); }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-left font-bold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onShare(record); }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-left font-bold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Share Record</span>
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onRename(record); }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 text-left font-bold cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rename</span>
                  </button>
                  <div className="border-t border-slate-800 my-1" />
                  <button
                    onClick={() => { setMenuOpen(false); onDelete(record); }}
                    className="w-full px-3 py-2 rounded-xl hover:bg-rose-500/20 text-rose-300 flex items-center gap-2 text-left font-bold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Delete Record</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
