import React, { useState } from 'react';
import { FileText, Download, Upload, Trash2, Eye, X, CheckCircle2, Paperclip, FileCheck } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState('');
  const [newCategory, setNewCategory] = useState<InsuranceDocument['category']>('Policy Document');

  const filteredDocs = documents.filter((d) => selectedCategory === 'All' || d.category === selectedCategory);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setNewFileName(file.name);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const newDoc: InsuranceDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      fileName: newFileName,
      category: newCategory,
      dateAdded: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      fileSize: selectedFile ? formatFileSize(selectedFile.size) : '1.8 MB'
    };

    onUploadDocument(newDoc);
    setNewFileName('');
    setSelectedFile(null);
    setUploadModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl font-sans">
      {/* HEADER & UPLOAD TRIGGER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Insurance Documents</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Stored policy schedules, claim receipts, and digital health cards
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFile(null);
            setNewFileName('');
            setUploadModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-stretch sm:self-auto"
        >
          <Upload className="w-4 h-4" />
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
                ? 'bg-[#00a896] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* DOCUMENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs hover:border-teal-500/30 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#00a896] dark:text-cyan-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-extrabold text-slate-900 dark:text-white truncate">{doc.fileName}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">
                  {doc.category} • {doc.fileSize}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 font-mono">
              <button
                onClick={() => setPreviewDoc(doc)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-[#00a896] border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors shadow-2xs"
                title="Preview Document"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeleteDocument(doc.id)}
                className="p-2 rounded-xl bg-white dark:bg-slate-900 text-slate-400 hover:text-rose-600 border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors shadow-2xs"
                title="Delete Document"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPLOAD MODAL WITH REAL FILE PICKER */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[#00a896] flex items-center justify-center">
                  <Upload className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">Upload Insurance Document</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Add PDF policy schedules or claim bills</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              {/* FILE SELECTION DROPZONE */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                  Select File from Device *
                </label>
                
                <label className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-teal-500/60 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all text-center group">
                  <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center text-[#00a896] group-hover:scale-110 transition-transform">
                    {selectedFile ? <FileCheck className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  </div>
                  
                  {selectedFile ? (
                    <div className="space-y-0.5">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs block truncate max-w-[260px]">
                        {selectedFile.name}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">
                        ✓ Ready ({formatFileSize(selectedFile.size)}) · Click to Change
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                        Click to Browse or Drag File Here
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        PDF, PNG, JPG, DOCX (up to 25MB)
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* DOCUMENT TITLE */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                  Document Title / Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Star_Health_Policy_Schedule_2026.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896] font-medium"
                />
              </div>

              {/* CATEGORY SELECTOR */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#00a896] font-bold cursor-pointer"
                >
                  <option value="Policy Document">Policy Document</option>
                  <option value="Health Card">Health Card</option>
                  <option value="Claim Receipt">Claim Receipt</option>
                  <option value="Tax Certificate">Tax Certificate (80D)</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!newFileName.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold cursor-pointer text-center shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload & Save Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-xs text-slate-900 dark:text-white">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#00a896]" />
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm truncate max-w-[280px]">
                  {previewDoc.fileName}
                </h4>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
              <FileText className="w-12 h-12 text-[#00a896]" />
              <strong className="text-slate-900 dark:text-white font-extrabold text-sm">{previewDoc.fileName}</strong>
              <span className="text-[11px] font-mono text-slate-500">
                {previewDoc.category} • {previewDoc.fileSize} • Added {previewDoc.dateAdded}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full mt-1">
                ✓ Verified Digital Record
              </span>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = previewDoc.fileName;
                  link.href = 'data:text/plain;charset=utf-8,DemoInsuranceDocumentContent';
                  link.click();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#00a896] hover:bg-[#00897b] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
