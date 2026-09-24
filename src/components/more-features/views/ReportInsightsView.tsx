import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, Brain, AlertCircle, FileText, UploadCloud, Search, 
  Filter, CheckCircle2, AlertTriangle, FileBox, HeartPulse, Stethoscope, 
  Droplets, Microscope, Activity, MessageSquare, Download, ZoomIn, 
  ZoomOut, Maximize2, X, Plus, Calendar, ArrowUpRight, ArrowDownRight, 
  ArrowRight, ShieldCheck, FileSearch, Sparkles, RefreshCcw
} from 'lucide-react';

export function ReportInsightsView() {
  // --- STATE ---
  type TabType = 'overview' | 'reports' | 'insights' | 'ai';
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState(0);
  
  // Review States
  const [insightReviews, setInsightReviews] = useState<Record<string, 'pending' | 'accepted' | 'dismissed'>>({
    'i1': 'pending',
    'i2': 'pending',
    'i3': 'pending'
  });

  const patientInfo = {
    name: 'Anitha Kumar',
    id: 'MC-10245',
    age: 32,
    gender: 'Female',
    bloodGroup: 'O+',
    lastReport: '08 Sep 2026',
    reportsAvailable: 12,
    avatar: 'A'
  };

  const handleReviewInsight = (id: string, status: 'accepted' | 'dismissed' | 'pending') => {
    setInsightReviews(prev => ({ ...prev, [id]: status }));
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStep(0);
    
    const steps = [
      { p: 20, s: 1, time: 800 },
      { p: 45, s: 2, time: 1500 },
      { p: 70, s: 3, time: 2500 },
      { p: 100, s: 4, time: 3500 },
    ];

    steps.forEach(({ p, s, time }) => {
      setTimeout(() => {
        setUploadProgress(p);
        setUploadStep(s);
        if (s === 4) {
          setTimeout(() => setIsUploading(false), 1000);
        }
      }, time);
    });
  };

  // --- RENDERERS ---

  const renderOverviewTab = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Categories */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {[
          { label: 'Blood Tests', count: 4, icon: Droplets, color: 'text-rose-500' },
          { label: 'Biochemistry', count: 3, icon: Microscope, color: 'text-purple-500' },
          { label: 'Cardiology', count: 2, icon: HeartPulse, color: 'text-indigo-500' },
          { label: 'Imaging', count: 1, icon: FileBox, color: 'text-emerald-500' },
          { label: 'Microbiology', count: 2, icon: Stethoscope, color: 'text-amber-500' },
        ].map(cat => (
          <div key={cat.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 min-w-[180px] shrink-0 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${cat.color}`}>
              <cat.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{cat.label}</h3>
              <p className="text-xs text-slate-500 font-medium">{cat.count} Reports</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Latest Report & AI Summary */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* AI SUMMARY HERO */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-cyan-400" /> AI Report Summary
              </h2>
              
              <div className="bg-slate-800/50 rounded-2xl p-5 mb-8 border border-slate-700/50">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">
                  The report contains multiple results within the laboratory-provided reference ranges. A small number of values may require additional review based on the report's reference intervals and patient context.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-cyan-500">
                  <ShieldCheck className="w-3 h-3" /> AI-assisted analysis
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-emerald-900/20 border border-emerald-800/30 rounded-2xl p-4">
                  <div className="text-3xl font-black text-emerald-400 mb-1">18</div>
                  <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Within Range</div>
                </div>
                <div className="bg-amber-900/20 border border-amber-800/30 rounded-2xl p-4">
                  <div className="text-3xl font-black text-amber-400 mb-1">3</div>
                  <div className="text-xs font-bold text-amber-500 uppercase tracking-widest">Needs Review</div>
                </div>
                <div className="bg-rose-900/20 border border-rose-800/30 rounded-2xl p-4">
                  <div className="text-3xl font-black text-slate-500 mb-1">0</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Critical</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-500" /> Key Insights
            </h3>
            <div className="space-y-4">
              {[
                { id: 'i1', title: 'Insight 01', desc: 'A laboratory value (Vitamin D3) is outside the reference range provided in the report.', priority: 'high' },
                { id: 'i2', title: 'Insight 02', desc: 'Hemoglobin has changed compared with the previous available report from Aug 2026.', priority: 'medium' },
                { id: 'i3', title: 'Insight 03', desc: 'The Lipid Profile result should be reviewed together with relevant patient cardiac history.', priority: 'medium' },
              ].map((insight) => (
                <div key={insight.id} className={`p-5 rounded-2xl border transition-colors ${insightReviews[insight.id] === 'accepted' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50' : insightReviews[insight.id] === 'dismissed' ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{insight.title}</h4>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{insight.desc}</p>
                      
                      {insightReviews[insight.id] === 'accepted' && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Doctor Reviewed
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {insightReviews[insight.id] === 'pending' && (
                        <>
                          <button onClick={() => handleReviewInsight(insight.id, 'dismissed')} className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Dismiss</button>
                          <button onClick={() => handleReviewInsight(insight.id, 'accepted')} className="px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition-colors">Accept</button>
                        </>
                      )}
                      {insightReviews[insight.id] !== 'pending' && (
                        <button onClick={() => handleReviewInsight(insight.id, 'pending')} className="px-4 py-2 text-slate-500 text-xs font-bold hover:underline">Undo</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-6">
          
          {/* Latest Report Detail */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Latest Blood Test</div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">CBC + Complete Blood Count</h3>
            
            <div className="space-y-3 mb-6">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Date</span>
                 <span className="text-slate-900 dark:text-white font-bold">08 Sep 2026</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Status</span>
                 <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded-lg">Reviewed</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Laboratory</span>
                 <span className="text-slate-900 dark:text-white font-bold text-right">Apollo Diagnostics</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500 font-medium">Uploaded By</span>
                 <span className="text-slate-900 dark:text-white font-bold">Dr. Sharma</span>
               </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setActiveTab('insights')} className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">View Report</button>
              <button className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors"><Download className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Values Needing Review Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Values Needing Review
            </h3>
            <div className="space-y-4">
              {[
                { test: 'Hemoglobin', val: '11.2', range: '12.0-15.5', trend: 'down' },
                { test: 'Vitamin B12', val: '180', range: '200-900', trend: 'down' },
                { test: 'Glucose (F)', val: '108', range: '70-100', trend: 'up' },
              ].map((v, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{v.test}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Ref: {v.range}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-base font-black text-amber-600 dark:text-amber-500">{v.val}</div>
                    {v.trend === 'down' ? <ArrowDownRight className="w-4 h-4 text-amber-500" /> : <ArrowUpRight className="w-4 h-4 text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveTab('insights')} className="w-full mt-4 py-2 text-sm font-bold text-cyan-600 hover:underline">View Details in Insights Tab</button>
          </div>

        </div>
      </div>
    </div>
  );

  const renderInsightsTab = () => (
    <div className="h-[80vh] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-500">
      
      {/* Left Panel: Original Report PDF Viewer */}
      <div className="flex-1 bg-slate-200 dark:bg-slate-800/50 rounded-3xl border border-slate-300 dark:border-slate-700 overflow-hidden flex flex-col shadow-inner relative">
        {/* Toolbar */}
        <div className="h-14 bg-slate-100 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300">
            <FileText className="w-4 h-4" /> CBC_Report_Sep2026.pdf
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-xs font-bold text-slate-500 w-12 text-center">100%</span>
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500"><ZoomIn className="w-4 h-4" /></button>
            <div className="w-px h-4 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500"><Maximize2 className="w-4 h-4" /></button>
          </div>
        </div>
        {/* PDF Document Area Mockup */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 flex justify-center">
          <div className="bg-white w-full max-w-2xl h-[1200px] shadow-lg border border-slate-300 p-12 text-slate-800">
             {/* Mock PDF Content */}
             <div className="border-b-2 border-slate-800 pb-6 mb-8 flex justify-between items-end">
               <div>
                 <h1 className="text-3xl font-black mb-1 text-slate-900">APOLLO DIAGNOSTICS</h1>
                 <p className="text-sm font-medium text-slate-500">Comprehensive Blood Analysis Report</p>
               </div>
               <div className="text-right text-xs text-slate-500 space-y-1">
                 <p>Date: 08 Sep 2026</p>
                 <p>Patient ID: MC-10245</p>
                 <p>Ref By: Dr. Sharma</p>
               </div>
             </div>
             
             <h2 className="font-bold text-lg mb-4 bg-slate-100 p-2">HEMATOLOGY</h2>
             <table className="w-full text-sm text-left mb-8">
               <thead>
                 <tr className="border-b-2 border-slate-300 text-slate-500">
                   <th className="py-2">Test Name</th>
                   <th className="py-2">Result</th>
                   <th className="py-2">Units</th>
                   <th className="py-2">Reference Range</th>
                 </tr>
               </thead>
               <tbody className="font-medium">
                 <tr className="border-b border-slate-100">
                   <td className="py-2">Hemoglobin</td>
                   <td className="py-2 font-bold text-rose-600">11.2 ↓</td>
                   <td className="py-2">g/dL</td>
                   <td className="py-2 text-slate-500">12.0 - 15.5</td>
                 </tr>
                 <tr className="border-b border-slate-100">
                   <td className="py-2">RBC Count</td>
                   <td className="py-2 font-bold">4.2</td>
                   <td className="py-2">mill/µL</td>
                   <td className="py-2 text-slate-500">4.1 - 5.1</td>
                 </tr>
                 <tr className="border-b border-slate-100">
                   <td className="py-2">WBC Count</td>
                   <td className="py-2 font-bold">6.8</td>
                   <td className="py-2">thou/µL</td>
                   <td className="py-2 text-slate-500">4.0 - 11.0</td>
                 </tr>
               </tbody>
             </table>

             <h2 className="font-bold text-lg mb-4 bg-slate-100 p-2">BIOCHEMISTRY</h2>
             <table className="w-full text-sm text-left">
               <thead>
                 <tr className="border-b-2 border-slate-300 text-slate-500">
                   <th className="py-2">Test Name</th>
                   <th className="py-2">Result</th>
                   <th className="py-2">Units</th>
                   <th className="py-2">Reference Range</th>
                 </tr>
               </thead>
               <tbody className="font-medium">
                 <tr className="border-b border-slate-100">
                   <td className="py-2">Vitamin B12</td>
                   <td className="py-2 font-bold text-rose-600">180 ↓</td>
                   <td className="py-2">pg/mL</td>
                   <td className="py-2 text-slate-500">200 - 900</td>
                 </tr>
                 <tr className="border-b border-slate-100">
                   <td className="py-2">Fasting Glucose</td>
                   <td className="py-2 font-bold text-rose-600">108 ↑</td>
                   <td className="py-2">mg/dL</td>
                   <td className="py-2 text-slate-500">70 - 100</td>
                 </tr>
               </tbody>
             </table>
             
             <div className="mt-16 text-xs text-slate-400 text-center">
               End of Report. Electronically verified.
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: AI Insights & Workspace */}
      <div className="w-full lg:w-[500px] xl:w-[600px] flex flex-col gap-6 shrink-0 overflow-y-auto custom-scrollbar pr-2">
        
        {/* Critical Findings (Only shown if exists) */}
        <div className="bg-rose-50 dark:bg-rose-900/10 rounded-3xl p-6 border border-rose-200 dark:border-rose-900/50">
          <h3 className="text-sm font-black text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Critical Findings
          </h3>
          <div className="text-sm font-bold text-rose-800 dark:text-rose-300 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl">
             No critical findings identified in this report.
          </div>
        </div>

        {/* Values Needing Review */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Values Needing Review
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <th className="pb-3 pr-4">Test</th>
                  <th className="pb-3 px-4">Result</th>
                  <th className="pb-3 px-4">Ref Range</th>
                  <th className="pb-3 px-4">Prev</th>
                  <th className="pb-3 pl-4">Action</th>
                </tr>
              </thead>
              <tbody className="font-medium">
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">Hemoglobin</td>
                  <td className="py-4 px-4 text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1">11.2 <ArrowDownRight className="w-3 h-3"/></td>
                  <td className="py-4 px-4 text-slate-500">12.0 - 15.5</td>
                  <td className="py-4 px-4 text-slate-500">11.8</td>
                  <td className="py-4 pl-4"><button className="text-cyan-600 font-bold hover:underline">Review</button></td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800/50">
                  <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">Vitamin B12</td>
                  <td className="py-4 px-4 text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1">180 <ArrowDownRight className="w-3 h-3"/></td>
                  <td className="py-4 px-4 text-slate-500">200 - 900</td>
                  <td className="py-4 px-4 text-slate-500">165</td>
                  <td className="py-4 pl-4"><button className="text-cyan-600 font-bold hover:underline">Review</button></td>
                </tr>
                <tr>
                  <td className="py-4 pr-4 font-bold text-slate-900 dark:text-white">Glucose (F)</td>
                  <td className="py-4 px-4 text-amber-600 dark:text-amber-500 font-bold flex items-center gap-1">108 <ArrowUpRight className="w-3 h-3"/></td>
                  <td className="py-4 px-4 text-slate-500">70 - 100</td>
                  <td className="py-4 px-4 text-slate-500">102</td>
                  <td className="py-4 pl-4"><button className="text-cyan-600 font-bold hover:underline">Review</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Review Notes */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-500" /> Clinical Review
          </h3>
          <textarea 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none h-32 mb-4" 
            placeholder="Add your clinical interpretation or follow-up notes..."
          />
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
             <div className="flex-1">
               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Follow-up Required</label>
               <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none">
                 <option>Yes</option><option>No</option>
               </select>
             </div>
             <div className="flex-1">
               <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Priority</label>
               <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none">
                 <option>Low</option><option>Medium</option><option>High</option>
               </select>
             </div>
          </div>
          <button className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-xl transition-colors shadow-md">
            Save Review
          </button>
        </div>

      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Upload Zone */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6">Upload New Report</h2>
        
        {!isUploading && uploadStep === 0 ? (
          <div 
            onClick={simulateUpload}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drag & Drop Report</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">or click to browse files (PDF, JPG, PNG)</p>
            <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-sm">Browse Files</button>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
             {/* Progress Bar Background */}
             <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/80">
               <motion.div 
                 className="h-full bg-cyan-50 dark:bg-cyan-900/10"
                 animate={{ width: `${uploadProgress}%` }}
                 transition={{ ease: "linear", duration: 0.5 }}
               />
             </div>
             
             <div className="relative z-10 space-y-6 max-w-md mx-auto py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${uploadStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className={`font-bold ${uploadStep >= 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Report Uploaded</div>
                </div>
                <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700 ml-4 -my-4"></div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${uploadStep >= 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className={`font-bold ${uploadStep >= 2 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Text Extracted</div>
                </div>
                <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700 ml-4 -my-4"></div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${uploadStep >= 3 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className={`font-bold ${uploadStep >= 3 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Values Identified</div>
                </div>
                <div className="w-0.5 h-6 bg-slate-200 dark:bg-slate-700 ml-4 -my-4"></div>
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${uploadStep >= 4 ? 'bg-cyan-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    {uploadStep === 4 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2.5 h-2.5 bg-current rounded-full animate-pulse" />}
                  </div>
                  <div className={`font-bold ${uploadStep >= 4 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {uploadStep === 4 ? 'Analysis Complete' : 'AI Analysis...'}
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Report History */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-500" /> Report History
          </h2>
          <div className="flex flex-wrap gap-2">
            {['All Reports', 'Blood', 'Imaging', 'Cardiology'].map((f, i) => (
              <button key={f} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${i===0 ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="py-4 px-6">Report Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">AI Analysis</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-medium">
              {[
                { name: 'CBC + Complete Blood Count', cat: 'Blood', date: '08 Sep 2026', status: 'Reviewed', ai: 'Available' },
                { name: 'Lipid Profile', cat: 'Biochemistry', date: '20 Aug 2026', status: 'Reviewed', ai: 'Available' },
                { name: 'ECG Report', cat: 'Cardiology', date: '12 Aug 2026', status: 'Pending', ai: 'Processing' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{r.name}</td>
                  <td className="py-4 px-6 text-slate-500">{r.cat}</td>
                  <td className="py-4 px-6 text-slate-500">{r.date}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${r.status === 'Reviewed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs font-bold flex items-center gap-2 pt-5">
                    {r.ai === 'Available' ? <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> : <RefreshCcw className="w-3.5 h-3.5 text-slate-400 animate-spin" />}
                    {r.ai}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => setActiveTab('insights')} className="text-cyan-600 font-bold hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAITab = () => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm h-[70vh] flex flex-col overflow-hidden animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50">
        <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-black text-slate-900 dark:text-white">Ask AI About This Report</h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verify against original report context</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50 dark:bg-slate-950/30">
         <div className="flex gap-4 max-w-3xl">
           <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center shrink-0 text-white">
             <Sparkles className="w-4 h-4" />
           </div>
           <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300">
             Hello Dr. Sharma. I have analyzed the CBC report for Anitha Kumar uploaded today. What would you like to know?
           </div>
         </div>
      </div>

      <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-wrap gap-2 mb-4">
          {['Summarize this report', 'Explain abnormal values', 'Compare with previous report', 'What should I review?'].map(q => (
            <button key={q} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors border border-slate-200 dark:border-slate-700">
              {q}
            </button>
          ))}
        </div>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask something about this report..." 
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-6 pr-14 py-4 outline-none text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 text-slate-900 dark:text-white"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-200 pb-32">
      <div className="max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* 1. HEADER */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 tracking-wide uppercase">
              <span>Doctor Portal</span> <ChevronRight className="w-3 h-3" /> 
              <span>Patients</span> <ChevronRight className="w-3 h-3" /> 
              <span>Reports</span> <ChevronRight className="w-3 h-3" /> 
              <span className="text-cyan-600 dark:text-cyan-400">Insights & AI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <FileSearch className="w-7 h-7 text-cyan-500" /> Report Insights & AI
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Analyze patient reports, identify important findings, compare trends, and generate AI-assisted insights.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search Patient..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 outline-none text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 w-48 sm:w-64" 
              />
            </div>
            <button onClick={() => setActiveTab('reports')} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <UploadCloud className="w-4 h-4" /> Upload Report
            </button>
            <button onClick={() => setActiveTab('reports')} className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md">
              <Calendar className="w-4 h-4" /> View History
            </button>
          </div>
        </div>


        {/* 3. MAIN NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'reports', label: 'Reports' },
            { id: 'insights', label: 'Insights & Trends' },
            { id: 'ai', label: 'AI Assistant' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-4 text-sm font-black tracking-wide uppercase whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. TAB CONTENT RENDERER */}
        <div className="py-2">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'reports' && renderReportsTab()}
          {activeTab === 'insights' && renderInsightsTab()}
          {activeTab === 'ai' && renderAITab()}
        </div>

      </div>
    </div>
  );
}
