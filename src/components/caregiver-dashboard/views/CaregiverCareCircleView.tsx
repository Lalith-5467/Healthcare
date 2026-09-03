import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Users, 
  CheckSquare, 
  Plus, 
  Check, 
  Clock, 
  FileText, 
  Share2, 
  UserPlus, 
  Lock, 
  Sparkles,
  X
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverCareCircleView: React.FC = () => {
  const { wards, activeWard, setActiveWardId, tasks, toggleTask, addTask } = useCaregiverWorkflow();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState<'Medication' | 'Vitals' | 'Nutrition' | 'Mobility' | 'Hygiene' | 'Doctor'>('Medication');
  const [time, setTime] = useState('02:00 PM');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    addTask({
      wardId: activeWard.id,
      title: taskTitle,
      category,
      time,
      priority,
      assignedTo: 'Anita Sharma (Caregiver)'
    });
    setIsAddTaskOpen(false);
    setTaskTitle('');
  };

  return (
    <div className="space-y-6 select-none pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>Care Circle & ABDM Consent Governance</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage multi-caregiver access, delegated parental proxy permissions, and daily care tasks.
          </p>
        </div>

        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Care Routine Task</span>
        </button>
      </div>

      {/* CARE CIRCLE MEMBERS & CONSENT TOKENS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* FAMILY CARE CIRCLE MEMBERS */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Authorized Care Circle Members</span>
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-50 dark:bg-cyan-950/40 text-teal-700 dark:text-cyan-300">
              3 Verified
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-500 text-white font-black flex items-center justify-center">
                  AS
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white">Anita Sharma (You)</h4>
                  <p className="text-[11px] text-slate-500">Primary Caregiver & Legal Guardian • Full Access</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-cyan-300">
                Admin
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-black flex items-center justify-center">
                  VK
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white">Vijay Kumar</h4>
                  <p className="text-[11px] text-slate-500">Secondary Caregiver (Brother) • View & Alert Access</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Co-Caregiver
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white font-black flex items-center justify-center">
                  NS
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white">Nurse Sarah (Apollo Home Health)</h4>
                  <p className="text-[11px] text-slate-500">Registered Visiting Nurse • Vitals & Meds Log Access</p>
                </div>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                Clinical Care
              </span>
            </div>
          </div>
        </div>

        {/* ABDM DIGITAL CONSENT ARTIFACTS */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>ABDM Health Consent Tokens</span>
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              HIPAA & ABDM Compliant
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-white">Ragul Kumar (Father)</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Active (Expires Dec 2027)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Scope: Diagnostic Reports, Prescriptions, Discharge Summaries, Telehealth Consultations.
              </p>
              <div className="text-[10px] font-mono text-slate-400">Artifact ID: ABDM-CONSENT-8492-9104</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 dark:text-white">Meena Kumar (Mother)</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Active (Expires Dec 2027)</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Scope: Orthopedic imaging, blood reports, pharmacy dispensing authorizations.
              </p>
              <div className="text-[10px] font-mono text-slate-400">Artifact ID: ABDM-CONSENT-6281-4490</div>
            </div>
          </div>
        </div>
      </div>

      {/* DAILY CARE ROUTINE CHECKLIST */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
              <span>Comprehensive Care Tasks Checklist</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive task assignment and accountability tracker for all wards.
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/60 opacity-60'
                  : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-teal-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                  task.completed 
                    ? 'bg-teal-500 text-white shadow-md' 
                    : 'border-2 border-slate-300 dark:border-slate-600'
                }`}>
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div>
                  <h4 className={`text-xs font-black ${task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Category: <span className="font-bold text-slate-600 dark:text-slate-300">{task.category}</span> • Scheduled: <span className="font-bold text-teal-600 dark:text-cyan-400">{task.time}</span> • Assigned: {task.assignedTo}
                  </p>
                </div>
              </div>

              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${
                task.priority === 'high' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' :
                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {task.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ADD TASK MODAL */}
      <AnimatePresence>
        {isAddTaskOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAddTaskOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0b1120] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Add Care Routine Task</span>
                </h3>
                <button onClick={() => setIsAddTaskOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleAddTaskSubmit} className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Task Title / Activity</label>
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Give Evening Metformin & Check BP"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Care Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      <option value="Medication">Medication</option>
                      <option value="Vitals">Vitals Check</option>
                      <option value="Nutrition">Nutrition & Diet</option>
                      <option value="Mobility">Mobility & Exercise</option>
                      <option value="Hygiene">Hygiene & Dressing</option>
                      <option value="Doctor">Doctor Followup</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full h-10 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddTaskOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
