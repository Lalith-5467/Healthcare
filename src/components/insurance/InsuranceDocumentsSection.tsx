import React, { useState } from 'react';
import { FileText, Download, Upload, Trash2, Eye, Plus, Check, X } from 'lucide-react';
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
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
      {/* HEADER & UPLOAD TRIGGER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-white">Insurance Documents</h3>
          <p className="text-xs text-slate-400">Stored policy schedules, claim receipts, and health cards</p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <Upload className="w-4 h-4 text-teal-400" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* CATEGORY CHIPS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {['All', 'Policy Document', 'Premium Receipt', 'Claim Documents', 'ID Proof', 'Health Card'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#00a896] text-white'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DOCUMENT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-sm flex flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-white text-xs font-sans line-clamp-1">{doc.fileName}</h4>
                  <span className="text-[10px] text-purple-300 block">{doc.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
              <span>{doc.dateAdded} • {doc.fileSize}</span>
              <div className="flex items-center gap-1 font-bold">
                <button onClick={() => setPreviewDoc(doc)} className="p-1 rounded text-cyan-300 hover:bg-slate-800 cursor-pointer" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onDeleteDocument(doc.id)} className="p-1 rounded text-rose-400 hover:bg-slate-800 cursor-pointer" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Upload Document</h3>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-bold mb-1">File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Hospital_Invoice_Receipt.pdf"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Document Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none"
                >
                  <option value="Policy Document">Policy Document</option>
                  <option value="Premium Receipt">Premium Receipt</option>
                  <option value="Claim Documents">Claim Documents</option>
                  <option value="ID Proof">ID Proof</option>
                  <option value="Health Card">Health Card</option>
                </select>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#00a896] text-white font-extrabold cursor-pointer">Upload Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">Document Preview</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
              <FileText className="w-10 h-10 text-teal-400 mx-auto" />
              <h4 className="font-extrabold text-white">{previewDoc.fileName}</h4>
              <p className="text-[11px] text-slate-400 font-mono">{previewDoc.category} • {previewDoc.fileSize}</p>
            </div>
            <button onClick={() => setPreviewDoc(null)} className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-200 font-bold cursor-pointer">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
