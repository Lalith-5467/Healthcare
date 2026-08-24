import React, { useState } from 'react';
import { Sparkles, FileText, Save, ArrowLeft } from 'lucide-react';
import type { MedicalRecordItem } from '../records/recordsData';

interface DocumentInfoFormProps {
  imageSrc: string | null;
  fileName?: string;
  fileSize?: string;
  onBack: () => void;
  onSave: (recordData: Partial<MedicalRecordItem>) => void;
  isSaving: boolean;
}

export const DocumentInfoForm: React.FC<DocumentInfoFormProps> = ({
  imageSrc,
  fileName = 'Scanned_Document_Aug2026.pdf',
  fileSize = '2.4 MB',
  onBack,
  onSave,
  isSaving,
}) => {
  // OCR DEMO STATE
  const [ocrAnalyzing, setOcrAnalyzing] = useState(true);

  // FORM FIELDS
  const [title, setTitle] = useState('CBC Blood Test Report');
  const [recordType, setRecordType] = useState<MedicalRecordItem['type']>('Lab Report');
  const [doctor, setDoctor] = useState('Dr. Rajesh Kumar');
  const [hospital, setHospital] = useState('Apollo Hospital');
  const [date, setDate] = useState('2026-08-23');
  const [notes, setNotes] = useState('Blood vitals within normal parameters. Hemoglobin: 14.2 g/dL, Platelets: 245,000 /µL.');

  React.useEffect(() => {
    const timer1 = setTimeout(() => {
      setOcrAnalyzing(false);
    }, 1200);
    return () => clearTimeout(timer1);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title || 'Untitled Medical Record',
      type: recordType,
      doctor: doctor || 'General Practitioner',
      hospital: hospital || 'General Healthcare',
      date: date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '23 Aug 2026',
      fileName: fileName,
      fileSize: fileSize,
      notes: notes,
      status: 'Normal',
      isImportant: true
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* 1. TOP OCR BANNER */}
      <div className="p-4 rounded-2xl bg-[#00a896]/10 border border-teal-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00a896]/15 border border-teal-500/30 flex items-center justify-center text-[#00a896] dark:text-cyan-300 shrink-0">
            <Sparkles className={`w-5 h-5 ${ocrAnalyzing ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                {ocrAnalyzing ? 'AI Document Recognition in Progress...' : '✓ Document Information Recognized'}
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-full font-mono">
                DEMO OCR
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 font-medium">
              {ocrAnalyzing
                ? 'Scanning document text and structure for instant field pre-population...'
                : 'Smart fields pre-filled below. Review and edit any information before saving.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer border border-slate-300 dark:border-slate-700 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scan</span>
        </button>
      </div>

      {/* 2. TWO-COLUMN LAYOUT (DESKTOP: PREVIEW LEFT, FORM RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: PREVIEW */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 font-mono">Document Preview</span>
              <span className="text-[11px] font-extrabold text-[#00a896] dark:text-cyan-400 bg-teal-500/15 border border-teal-500/30 px-2.5 py-1 rounded-full font-sans">
                {recordType}
              </span>
            </div>

            <div className="relative aspect-[3/4] w-full bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex items-center justify-center p-2">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Scanned Medical Document"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-white text-slate-900 p-6 rounded-xl overflow-y-auto text-xs font-sans border border-slate-200 shadow-inner">
                  <div className="border-b-2 border-[#00a896] pb-3 mb-4 flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-sm text-[#00a896]">APOLLO HOSPITAL LABS</h4>
                      <p className="text-[10px] text-slate-500">Diagnostic Center & Pathology</p>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <div>23 Aug 2026</div>
                      <div>Ref: #LAB-84920</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-100 p-2 rounded text-[11px] font-semibold">
                      Patient: Lalith Patel | Age: 34 M
                    </div>
                    <div className="font-bold underline text-slate-900">COMPLETE BLOOD COUNT</div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span>Hemoglobin:</span>
                        <span className="font-bold text-teal-700">14.2 g/dL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>WBC Count:</span>
                        <span className="font-bold text-teal-700">7,200 /µL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platelets:</span>
                        <span className="font-bold text-teal-700">245,000 /µL</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200 text-right text-[10px]">
                      Doctor: Dr. Rajesh Kumar, MD
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl flex items-center justify-between text-xs text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-[#00a896] dark:text-cyan-400 shrink-0" />
                <span className="truncate font-semibold">{fileName}</span>
              </div>
              <span className="font-mono text-slate-500 dark:text-slate-400 shrink-0 font-bold">{fileSize}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DOCUMENT EDITABLE INFORMATION FORM */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Document Information</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                Fill or modify the fields below to ensure accurate indexing in your Medical Records database.
              </p>
            </div>

            <div className="space-y-4 font-medium">
              {/* DOCUMENT NAME */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Document Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. CBC Blood Test Report"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00a896] text-sm font-semibold transition-colors font-sans"
                />
              </div>

              {/* RECORD TYPE & DATE GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Record Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value as MedicalRecordItem['type'])}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] text-sm font-semibold transition-colors cursor-pointer font-sans"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Imaging">Imaging (X-Ray, MRI, Scan)</option>
                    <option value="Discharge">Discharge Summary</option>
                    <option value="Vaccination">Vaccination Record</option>
                    <option value="Insurance">Insurance Document</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Date of Record <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-[#00a896] text-sm font-semibold transition-colors font-sans"
                  />
                </div>
              </div>

              {/* DOCTOR & HOSPITAL GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Doctor / Consultant
                  </label>
                  <input
                    type="text"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00a896] text-sm font-semibold transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                    Hospital / Diagnostic Lab
                  </label>
                  <input
                    type="text"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    placeholder="e.g. Apollo Hospital"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00a896] text-sm font-semibold transition-colors font-sans"
                  />
                </div>
              </div>

              {/* NOTES */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-mono">
                  Clinical Notes / Key Remarks
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes, dosage instructions, or observations..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00a896] text-sm font-normal transition-colors resize-none font-sans"
                />
              </div>
            </div>

            {/* SAVE BUTTON */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 font-sans">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 text-sm font-bold transition-colors border border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3.5 px-6 rounded-xl font-extrabold text-white bg-[#00a896] hover:bg-[#00897b] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isSaving ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>Saving to Medical Records...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save to Medical Records</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
