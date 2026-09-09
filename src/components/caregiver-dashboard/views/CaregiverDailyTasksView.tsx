import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Check, 
  Clock, 
  AlertCircle,
  Search,
  Filter,
  Calendar,
  User,
  ChevronRight,
  X,
  FileText,
  MessageSquare,
  AlertOctagon
} from 'lucide-react';
import { useCaregiverWorkflow } from '../../../utils/caregiverWorkflowStorage';

export const CaregiverDailyTasksView: React.FC = () => {
  const { wards, activeWard, tasks, toggleTask, addTask } = useCaregiverWorkflow();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  const [patientFilter, setPatientFilter] = useState('Patient');
  
  // Add Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [category, setCategory] = useState('Medication');
  const [time, setTime] = useState('08:00 AM');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [instructions, setInstructions] = useState('');

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const overdueTasks = 1; // Mocked for UI requirements

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (activeFilter === 'Pending') matchesFilter = !task.completed;
    if (activeFilter === 'Completed') matchesFilter = task.completed;
    if (activeFilter === 'Overdue') matchesFilter = !task.completed && task.priority === 'high';
    if (activeFilter === 'High Priority') matchesFilter = task.priority === 'high';

    let matchesDate = true;
    if (dateFilter === 'Today') matchesDate = true; // In real app, filter by date
    let matchesPatient = true;
    if (patientFilter === 'Patient') matchesPatient = true; // In real app, filter by wardId

    return matchesSearch && matchesFilter && matchesDate && matchesPatient;
  });

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    addTask({
      wardId: activeWard.id,
      title: taskTitle,
      category: category as any,
      time,
      priority,
      assignedTo: 'Anita Sharma'
    });
    setIsAddTaskOpen(false);
    setTaskTitle('');
    setInstructions('');
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'text-rose-600 bg-rose-50 dark:bg-rose-900/40 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'medium': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/40 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-teal-600 dark:text-cyan-400" />
            <span>Daily Care Tasks</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Manage and complete today's assigned care activities.
          </p>
        </div>
        <button
          onClick={() => setIsAddTaskOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Care Task</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">Today's Tasks</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{tasks.length + 1}</p>
        </div>
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-cyan-900/10 border border-teal-100 dark:border-teal-900/30 flex flex-col justify-center">
          <p className="text-[11px] font-black text-teal-700 dark:text-cyan-500 uppercase tracking-wider mb-1">Completed</p>
          <p className="text-2xl font-black text-teal-700 dark:text-cyan-400">{completedTasks}</p>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 flex flex-col justify-center">
          <p className="text-[11px] font-black text-amber-700 dark:text-amber-500 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-black text-amber-700 dark:text-amber-400">{pendingTasks}</p>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 flex flex-col justify-center">
          <p className="text-[11px] font-black text-rose-700 dark:text-rose-500 uppercase tracking-wider mb-1">Overdue</p>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-400">{overdueTasks}</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-800">
        <div className="relative w-full lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500"
          />
        </div>
        
        <div className="flex w-full lg:w-auto items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {['All', 'Pending', 'Completed', 'Overdue', 'High Priority'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2 hidden lg:block" />
          <button 
            onClick={() => setDateFilter(prev => prev === 'Today' ? 'All Dates' : 'Today')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              dateFilter === 'Today'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> {dateFilter === 'Today' ? 'Today' : 'All Dates'}
          </button>
          <button 
            onClick={() => setPatientFilter(prev => prev === 'Patient' ? 'All Patients' : 'Patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              patientFilter === 'Patient'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'
            }`}
          >
            <User className="w-3.5 h-3.5" /> {patientFilter === 'Patient' ? 'Patient' : 'All Patients'}
          </button>
        </div>
      </div>

      {/* TIMELINE VIEW */}
      <div className="bg-white dark:bg-[#0b1120] rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6">Today's Care Schedule</h3>
        
        <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
          
          {/* Mock Task Grouping by Time */}
          {filteredTasks.map((task, idx) => (
            <div key={task.id} className="relative pl-8">
              {/* Timeline Dot */}
              <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white dark:border-[#0b1120] flex items-center justify-center ${
                task.completed ? 'bg-teal-500' : task.priority === 'high' ? 'bg-rose-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}>
                {task.completed && <Check className="w-3 h-3 text-white stroke-[3]" />}
              </div>
              
              <div className="mb-2">
                <span className="text-[10px] font-black text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {task.time}
                </span>
              </div>

              <div 
                onClick={() => setSelectedTask(task)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  task.completed 
                    ? 'bg-slate-50/50 border-slate-100 dark:bg-slate-900/30 dark:border-slate-800 opacity-75' 
                    : 'bg-white border-slate-200 hover:border-teal-300 dark:bg-slate-900/80 dark:border-slate-700 dark:hover:border-teal-700/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className={`text-sm font-black ${task.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {activeWard.name}</span>
                      <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> {task.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Scheduled: {task.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                      {task.priority} Priority
                    </span>
                    <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase tracking-wider ${
                      task.completed 
                        ? 'text-teal-700 bg-teal-50 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800' 
                        : 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                    }`}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-black">AS</div>
                    <span className="text-[10px] font-semibold text-slate-500">Assigned to: {task.assignedTo || 'Anita Sharma'}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-black transition-colors"
                    >
                      Add Note
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-colors flex items-center gap-1 ${
                        task.completed
                          ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                          : 'bg-teal-500 text-white hover:bg-teal-600 shadow-sm shadow-teal-500/20'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      {task.completed ? 'Undo' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TASK DETAILS MODAL */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedTask(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                <h2 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" /> Task Details
                </h2>
                <button onClick={() => setSelectedTask(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg dark:hover:bg-slate-800">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{selectedTask.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                      selectedTask.completed ? 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      Status: {selectedTask.completed ? 'Completed' : 'Pending'}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority} Priority
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Patient</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-teal-500" /> {activeWard.name}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Category</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5"><CheckSquare className="w-3.5 h-3.5 text-teal-500" /> {selectedTask.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Scheduled Time</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-500" /> {selectedTask.time}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Assigned To</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{selectedTask.assignedTo || 'Anita Sharma'}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-500">Instructions</h4>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedTask.instructions || 'Ensure medication is taken after meals. Keep patient hydrated. Verify BP before administering if feeling dizzy.'}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase text-slate-500 flex items-center justify-between">
                    <span>Care Notes</span>
                    <button className="text-teal-600 dark:text-teal-400 font-bold hover:underline">+ Add Note</button>
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-white dark:bg-[#0b1120] border border-slate-200 dark:border-slate-700 flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-[8px] font-black shrink-0">AS</div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Patient resting well.</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Today at 10:15 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 grid grid-cols-2 gap-3">
                <button 
                  onClick={() => { toggleTask(selectedTask.id); setSelectedTask({...selectedTask, completed: !selectedTask.completed}); }}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all flex justify-center items-center gap-2 ${
                    selectedTask.completed 
                      ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' 
                      : 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  {selectedTask.completed ? 'Mark as Pending' : 'Mark Complete'}
                </button>
                <button className="py-2.5 rounded-xl text-xs font-black bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400 flex justify-center items-center gap-2">
                  <AlertOctagon className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD TASK MODAL */}
      <AnimatePresence>
        {isAddTaskOpen && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setIsAddTaskOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0b1120] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
                  <span>Create Care Task</span>
                </h3>
                <button onClick={() => setIsAddTaskOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <form id="add-task-form" onSubmit={handleAddTaskSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Task Name</label>
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Administer Evening Metformin"
                      className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Patient</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={activeWard.name} 
                        className="w-full h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                      >
                        <option value="Medication Reminder">Medication Reminder</option>
                        <option value="Vital Check">Vital Check</option>
                        <option value="Mobility">Mobility</option>
                        <option value="Nutrition">Nutrition</option>
                        <option value="Hydration">Hydration</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Appointment">Appointment</option>
                        <option value="Wellness">Wellness</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Date & Time</label>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder="08:00 AM"
                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Priority</label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Instructions / Notes</label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="Optional instructions for the caregiver..."
                      rows={3}
                      className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all resize-none text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Repeat</label>
                      <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white">
                        <option>Does not repeat</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Assign To</label>
                      <select className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 font-bold focus:outline-none focus:border-teal-500 transition-all text-slate-900 dark:text-white">
                        <option>Anita Sharma (You)</option>
                        <option>Vijay Kumar</option>
                        <option>Nurse Sarah</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 rounded-b-3xl flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddTaskOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  form="add-task-form"
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20 transition-all"
                >
                  Create Task
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
