import React, { useState } from 'react';
import { IconCircleCheck, IconCircle } from '@tabler/icons-react';

export const NurseNeedsAttention: React.FC = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Confirm Lakshmi N's IV medication", done: false, type: 'critical' },
    { id: 2, title: "Update Ramesh R's wound record", done: false, type: 'normal' },
    { id: 3, title: "Restock wound dressing kit", done: false, type: 'inventory' },
    { id: 4, title: "Review 1 pending care request", done: false, type: 'action' },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const pendingCount = tasks.filter(t => !t.done).length;

  return (
    <section className="pt-2">
      <div className="flex items-center gap-3 mb-3 px-1">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Needs your attention
        </h3>
        {pendingCount > 0 && (
          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-[10px] font-bold">
            {pendingCount} pending
          </span>
        )}
      </div>

      <div className="bg-white dark:bg-[#1b1e27] rounded-xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm overflow-hidden flex flex-col">
        {tasks.map((task, idx) => (
          <div 
            key={task.id} 
            className={`flex items-start gap-3 p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${idx !== tasks.length - 1 ? 'border-b border-slate-100 dark:border-slate-800/50' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <button className="mt-0.5 text-slate-400 hover:text-teal-500 transition-colors shrink-0">
              {task.done ? (
                <IconCircleCheck className="w-5 h-5 text-teal-500" />
              ) : (
                <IconCircle className="w-5 h-5" />
              )}
            </button>
            <div className="flex flex-col">
              <span className={`text-sm font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                {task.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
