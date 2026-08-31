import React, { useState } from 'react';
import { Layers, Plus, Trash2, Check, X, Sparkles, FileText } from 'lucide-react';
import type { MedicalRecordItem } from '../records/recordsData';

interface MultiScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBatch: (records: Partial<MedicalRecordItem>[]) => void;
}

export const MultiScanModal: React.FC<MultiScanModalProps> = ({
  isOpen,
  onClose,
  onSaveBatch,
}) => {
  const [queuedDocs, setQueuedDocs] = useState<
    { id: string; name: string; type: MedicalRecordItem['type']; size: string }[]
  >([
    { id: '1', name: 'Prescription_Aug2026.pdf', type: 'Prescription', size: '1.2 MB' },
    { id: '2', name: 'Blood_Report_CBC.pdf', type: 'Lab Report', size: '2.4 MB' },
    { id: '3', name: 'Chest_XRay_Scan.jpg', type: 'Imaging', size: '4.5 MB' },
  ]);

  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddSampleDoc = () => {
    const types: MedicalRecordItem['type'][] = ['Lab Report', 'Prescription', 'Consultation', 'Imaging', 'Discharge', 'Vaccination'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const newDoc = {
      id: Date.now().toString(),
      name: `${randomType.replace(/\s+/g, '_')}_Scan_${queuedDocs.length + 1}.pdf`,
      type: randomType,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
    };
    setQueuedDocs((prev) => [...prev, newDoc]);
  };

  const handleRemoveDoc = (id: string) => {
    setQueuedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSaveAll = () => {
    if (queuedDocs.length === 0) return;
    setSaving(true);

    const batch: Partial<MedicalRecordItem>[] = queuedDocs.map((doc, idx) => ({
      title: doc.name.replace(/_/g, ' ').replace('.pdf', '').replace('.jpg', ''),
      type: doc.type,
      hospital: 'Apollo Hospital',
      doctor: 'Dr. Rajesh Kumar',
      date: new Date(Date.now() - idx * 86400000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileName: doc.name,
      fileSize: doc.size,
      status: 'Normal',
      isImportant: true,
      notes: `Batch scanned document #${idx + 1}`
    }));

    setTimeout(() => {
      setSaving(false);
      onSaveBatch(batch);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs text-slate-900 dark:text-white">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Batch Multi-Page Scanner</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Scan & upload multiple pages into a single record batch</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QUEUED DOCUMENTS LIST */}
        <div className="space-y-3 font-mono">
          <div className="flex justify-between items-center font-sans">
            <span className="font-extrabold text-slate-900 dark:text-white text-xs">Scanned Page Queue ({queuedDocs.length})</span>
            <button
              onClick={handleAddSampleDoc}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-slate-900 dark:text-white font-extrabold text-xs flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Scan Page</span>
            </button>
          </div>

          {queuedDocs.length > 0 ? (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {queuedDocs.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                      #{idx + 1}
                    </span>
                    <FileText className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white font-sans text-xs">{doc.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{doc.type} • {doc.size}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveDoc(doc.id)}
                    className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 font-sans">
              No pages in queue. Click "Scan Page" above to add pages.
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 font-sans">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-extrabold border border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAll}
            disabled={queuedDocs.length === 0 || saving}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            {saving ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Saving Batch...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Batch ({queuedDocs.length} Documents)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
