import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Apple, 
  Edit3, 
  CheckCircle2, 
  Circle,
  Flame,
  Droplets,
  Activity,
  ChevronRight,
  X,
  Plus,
  Coffee,
  Sun,
  Moon,
  Zap
} from 'lucide-react';

export const DietPlanView: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // State for meals
  const [meals, setMeals] = useState([
    { id: 1, type: 'Breakfast', time: '8:30 AM', calories: 350, desc: 'Oatmeal with berries, 2 boiled eggs, and green tea.', icon: Coffee, completed: true },
    { id: 2, type: 'Lunch', time: '1:00 PM', calories: 650, desc: 'Grilled chicken salad with quinoa, avocado, and olive oil dressing.', icon: Sun, completed: false },
    { id: 3, type: 'Dinner', time: '7:30 PM', calories: 500, desc: 'Baked salmon with steamed broccoli and sweet potato mash.', icon: Moon, completed: false },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateGoals = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdateModalOpen(false);
    showToast("Nutrition goals updated successfully!");
  };

  const toggleMealStatus = (id: number) => {
    setMeals(prev => prev.map(meal => 
      meal.id === id ? { ...meal, completed: !meal.completed } : meal
    ));
    const meal = meals.find(m => m.id === id);
    if (meal && !meal.completed) {
      showToast(`${meal.type} logged successfully!`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto space-y-6 font-sans pb-16 relative"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-bold flex items-center gap-2 text-white bg-emerald-500"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 dark:bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="flex gap-4 relative z-10">
          <div className="hidden sm:flex shrink-0 p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 items-center justify-center">
            <Apple className="w-8 h-8 text-emerald-600 dark:text-emerald-400 drop-shadow-sm" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-emerald-500 dark:text-emerald-400 uppercase mb-1 block">NUTRITION & WELLNESS</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              Diet & Nutrient Plans
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Personalized meal plans and daily nutrition tracking
              </p>
              <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <p className="hidden md:block text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                1 meal logged today
              </p>
            </div>
          </div>
        </div>
        
        <motion.button 
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsUpdateModalOpen(true)}
          className="relative group flex items-center gap-2 bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 dark:text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] border border-emerald-400/50 dark:border-emerald-300/30 w-full sm:w-auto justify-center z-10"
        >
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Edit3 className="w-4 h-4 relative z-10" />
          <span className="relative z-10 tracking-wide">Update Goals</span>
        </motion.button>
      </motion.div>

      {/* 2. QUICK HEALTH STATS */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Calories Eaten', value: '350', unit: '/ 2000', icon: Flame, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Protein', value: '75g', unit: '/ 120g', icon: Activity, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Carbs', value: '180g', unit: '/ 220g', icon: Droplets, color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/10' },
          { label: 'Fats', value: '40g', unit: '/ 65g', icon: Droplets, color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/10' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{stat.label}</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none flex items-baseline gap-1">
                {stat.value} <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{stat.unit}</span>
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 3. MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT: DAILY NUTRITION */}
        <section className="lg:col-span-1 space-y-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 px-1">
            <Activity className="w-5 h-5 text-emerald-500" />
            Today's Macros
          </h2>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 h-full">
            
            {/* Calories Ring */}
            <div className="flex flex-col items-center justify-center py-4 relative group cursor-pointer">
              <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/10 opacity-0 group-hover:opacity-100 rounded-full blur-2xl transition-opacity duration-500"></div>
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-slate-100 dark:text-slate-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  {/* Foreground Ring */}
                  <motion.path 
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: "65, 100" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-emerald-500" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">1,450</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-1">/ 2000 kcal</span>
                </div>
              </div>
            </div>

            {/* Macros Bars */}
            <div className="space-y-6">
              {[
                { label: 'Protein', current: 75, max: 120, color: 'bg-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                { label: 'Carbs', current: 180, max: 220, color: 'bg-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                { label: 'Fats', current: 40, max: 65, color: 'bg-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' }
              ].map((macro, idx) => (
                <div key={idx} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{macro.label}</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{macro.current}g <span className="text-slate-500 dark:text-slate-400 font-medium">/ {macro.max}g</span></span>
                  </div>
                  <div className={`h-2.5 w-full ${macro.bg} rounded-full overflow-hidden`}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(macro.current / macro.max) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                      className={`h-full ${macro.color} rounded-full`} 
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* RIGHT: MEAL PLAN TIMELINE */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Apple className="w-5 h-5 text-emerald-500" />
              Meal Plan
            </h2>
            <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Snack
            </button>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <AnimatePresence>
              {meals.map((meal, idx) => (
                <motion.div 
                  key={meal.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.1) }}
                  onClick={() => toggleMealStatus(meal.id)}
                  whileHover={{ scale: 1.01 }}
                  className={`relative flex items-start gap-4 p-5 border rounded-2xl cursor-pointer transition-all group overflow-hidden ${
                    meal.completed 
                      ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30 shadow-none' 
                      : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700/50'
                  }`}
                >
                  {meal.completed && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
                  )}
                  
                  <div className={`mt-1 shrink-0 transition-transform duration-300 ${meal.completed ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {meal.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-600 dark:text-slate-300 dark:text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </div>
                  
                  <div className="flex-1 relative z-10">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <meal.icon className={`w-4 h-4 ${meal.completed ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
                        <h3 className={`font-black text-base ${meal.completed ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-white'}`}>
                          {meal.type}
                        </h3>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-2">{meal.time}</span>
                      </div>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        meal.completed 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {meal.calories} kcal
                      </span>
                    </div>
                    <p className={`text-sm mt-2 transition-colors ${meal.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                      {meal.desc}
                    </p>
                  </div>
                  
                  {/* Hover Action Indicator */}
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className={`w-5 h-5 ${meal.completed ? 'text-emerald-500' : 'text-slate-500 dark:text-slate-400'}`} />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* 4. HEALTH INSIGHTS */}
      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-4"
      >
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-3xl p-6 border border-emerald-100/50 dark:border-emerald-800/30 flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-12 h-12 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100 dark:border-emerald-800/50">
            <Zap className="w-6 h-6 text-emerald-500 fill-emerald-500" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-black text-slate-900 dark:text-white text-base mb-1">Nutrition Insights</h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              You're on track! Hitting your protein goal today will aid in recovery after yesterday's workout. Consider adding a small handful of almonds to your afternoon snack.
            </p>
          </div>
        </div>
      </motion.section>

      {/* UPDATE GOALS MODAL */}
      <AnimatePresence>
        {isUpdateModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUpdateModalOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-500" />
                  Update Nutrition Goals
                </h2>
                <button 
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateGoals} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Calorie Target (kcal)</label>
                  <input 
                    type="number" 
                    defaultValue={2000}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 transition-all dark:text-white font-bold" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Protein (g)</label>
                    <input type="number" defaultValue={120} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold text-center" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Carbs (g)</label>
                    <input type="number" defaultValue={220} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold text-center" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fats (g)</label>
                    <input type="number" defaultValue={65} className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 outline-none focus:border-emerald-500 transition-all dark:text-white font-bold text-center" required />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-900 dark:text-white font-black py-4 rounded-xl transition-all mt-2 shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] border border-emerald-400/50"
                >
                  Save Goals
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
