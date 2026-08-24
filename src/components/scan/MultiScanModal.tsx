import React, { useState } from 'react';
import { Layers, Plus, CheckCircle2, Trash2, Save, X, Sparkles, FileText } from 'lucide-react';
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
      onSaveBatch(batch);
      setSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00a896]/20 border border-teal-500/30 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Scan Multiple Documents</h3>
              <p className="text-xs text-slate-400">Queue & save multiple medical records at once</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QUEUED DOCUMENTS LIST */}
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {queuedDocs.map((doc, index) => (
            <div
              key={doc.id}
              className="bg-slate-800/80 border border-slate-700/60 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-sm"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs font-bold shrink-0">
                  #{index + 1}
                </div>
                <div className="truncate">
                  <h4 className="text-xs font-extrabold text-white truncate">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span className="text-cyan-400 font-semibold">{doc.type}</span>
                    <span>•</span>
                    <span className="font-mono">{doc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready
                </span>
                <button
                  onClick={() => handleRemoveDoc(doc.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition-colors cursor-pointer"
                  title="Remove document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {queuedDocs.length === 0 && (
            <div className="py-8 text-center text-slate-500 text-xs">
              No documents in multi-scan queue. Click below to add documents.
            </div>
          )}
        </div>

        {/* ADD DOCUMENT BUTTON */}
        <button
          onClick={handleAddSampleDoc}
          className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-slate-800/40"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>Add Another Document Page to Batch</span>
        </button>

        {/* FOOTER */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold text-slate-400">
            <strong className="text-white font-extrabold">{queuedDocs.length}</strong> document(s) ready
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={queuedDocs.length === 0 || saving}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[#00a896] to-cyan-600 hover:from-teal-600 hover:to-cyan-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Saving All...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All to Records</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
