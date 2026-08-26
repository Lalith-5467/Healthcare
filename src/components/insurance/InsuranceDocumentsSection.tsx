import React, { useState } from 'react';
import { FileText, Download, Upload, Trash2, Eye, X } from 'lucide-react';
import type { InsuranceDocument } from './insuranceData';

interface InsuranceDocumentsSectionProps {
  documents: InsuranceDocument[];
  onUploadDocument: (newDoc: InsuranceDocument) => void;
  onDeleteDocument: (id: string) => void;
}

export const InsuranceDocumentsSection: React.FC<InsuranceDocumentsSectionProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [previewDoc, setPreviewDoc] = useState<InsuranceDocument | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState<InsuranceDocument['category']>('Policy Document');

  const filteredDocs = documents.filter((d) => selectedCategory === 'All' || d.category === selectedCategory);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newDoc: InsuranceDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      fileName: newFileName,
      category: newCategory,
      dateAdded: '24 Aug 2026',
      fileSize: '1.5 MB'
    };

    onUploadDocument(newDoc);
    setNewFileName('');
    setUploadModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      {/* HEADER & UPLOAD TRIGGER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Insurance Documents</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Stored policy schedules, claim receipts, and health cards</p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto shadow-sm"
        >
          <Upload className="w-4 h-4 text-[#00a896] dark:text-teal-400" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar font-mono">
        {['All', 'Policy Document', 'Health Card', 'Claim Receipt', 'Tax Certificate'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-extrabold whitespace-nowrap transition-all cursor-pointer font-sans ${
              selectedCategory === cat
                ? 'bg-[#00a896] text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DOCUMENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#00a896] dark:text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-slate-900 dark:text-white truncate">{doc.fileName}</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 font-mono font-medium">{doc.category} • {doc.fileSize}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 font-mono">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                title="Preview Document"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteDocument(doc.id)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-600 cursor-pointer"
                title="Delete Document"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Upload Insurance Document</h4>
              <button onClick={() => setUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Document Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Policy Schedule 2026.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896]"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-bold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896] font-bold"
                >
                  <option value="Policy Document">Policy Document</option>
                  <option value="Health Card">Health Card</option>
                  <option value="Claim Receipt">Claim Receipt</option>
                  <option value="Tax Certificate">Tax Certificate</option>
                </select>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold cursor-pointer text-center shadow-md">
                Upload & Save Document
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">{previewDoc.fileName}</h4>
              <button onClick={() => setPreviewDoc(null)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <FileText className="w-12 h-12 text-[#00a896] mx-auto" />
              <p className="font-bold text-slate-800 dark:text-slate-200">{previewDoc.fileName}</p>
              <span className="text-[10px] text-slate-500 font-mono block">{previewDoc.category} • {previewDoc.fileSize}</span>
            </div>
            <div className="flex justify-between gap-3">
              <button onClick={() => setPreviewDoc(null)} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-300 dark:border-slate-700">Close</button>
              <a href="#download" onClick={(e) => { e.preventDefault(); setPreviewDoc(null); }} className="flex-1 py-2 rounded-xl bg-[#00a896] text-white font-extrabold text-center shadow-md flex items-center justify-center gap-1"><Download className="w-3.5 h-3.5" /><span>Download PDF</span></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
