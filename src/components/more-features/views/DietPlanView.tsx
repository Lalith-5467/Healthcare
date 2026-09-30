import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { 
  Apple, ChevronRight, Search, History, Plus, AlertCircle, 
  Droplets, Target, Sparkles, RefreshCw, Edit2, Trash2, 
  CheckCircle2, X, FileText, ArrowRight, Save, Download, Send, CheckSquare, Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const patientInfo = {
  name: "Anitha Kumar",
  id: "MC-10245",
  age: 32,
  activity: "Moderate",
  goal: "Balanced Nutrition",
  allergies: "Peanuts, Shellfish",
  lastUpdated: "08 Sep 2026",
  avatar: "A"
};

const mockMeals = [
  { id: 1, type: "Breakfast", name: "Oats Idli with Sambar", time: "08:30 AM", portion: "3 pieces, 1 bowl", cal: 320, pro: 12, days: ['Monday', 'Wednesday', 'Friday'] },
  { id: 6, type: "Breakfast", name: "Poha with Peanuts", time: "08:30 AM", portion: "1 bowl", cal: 280, pro: 8, days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'] },
  { id: 2, type: "Morning Snack", name: "Mixed Fruit Bowl", time: "11:00 AM", portion: "1 medium bowl", cal: 150, pro: 2, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  { id: 3, type: "Lunch", name: "Brown Rice with Dal & Veggies", time: "01:30 PM", portion: "1 cup rice, 1 cup dal", cal: 450, pro: 18, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
  { id: 4, type: "Evening Snack", name: "Roasted Makhana", time: "05:00 PM", portion: "1 small bowl", cal: 120, pro: 3, days: ['Monday', 'Wednesday', 'Friday'] },
  { id: 7, type: "Evening Snack", name: "Sprouts Salad", time: "05:00 PM", portion: "1 bowl", cal: 110, pro: 5, days: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'] },
  { id: 5, type: "Dinner", name: "Roti with Paneer Sabzi", time: "08:30 PM", portion: "2 rotis, 1 cup sabzi", cal: 400, pro: 16, days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
];

export function DietPlanView() {
  // --- STATE ---
  type TabType = 'plan' | 'analysis' | 'history';
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [activeDay, setActiveDay] = useState('Monday');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [meals, setMeals] = useState<any[]>([]);

  // Calculate current week dates dynamically
  const weekDates = React.useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay() || 7; // Monday = 1, Sunday = 7
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + 1);
    
    const dates = [];
    const daysArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      dates.push({
        day: daysArr[i],
        date: d.getDate(),
        month: monthNames[d.getMonth()]
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    // Set active day to today automatically
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    setActiveDay(todayName);
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const response = await api.get(`/diet/${patientInfo.id}/meals`);
      if (response.data && response.data.length > 0) {
        setMeals(response.data);
      } else {
        // Seed mock data if database is empty
        for (const m of mockMeals) {
           await api.post(`/diet/${patientInfo.id}/meals`, m);
        }
        const freshResponse = await api.get(`/diet/${patientInfo.id}/meals`);
        setMeals(freshResponse.data);
      }
    } catch (e) {
      console.error("Failed to fetch meals, falling back to mock", e);
      setMeals(mockMeals);
    }
  };
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Modals & Drawers
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSwapDrawer, setShowSwapDrawer] = useState(false);
  const [showMealDrawer, setShowMealDrawer] = useState(false);
  
  // Selection States
  const [selectedMealForSwap, setSelectedMealForSwap] = useState<any>(null);
  const [editingMeal, setEditingMeal] = useState<any>(null);
  const [mealDays, setMealDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  const [mealForm, setMealForm] = useState<any>({ type: 'Breakfast', time: '08:00 AM', name: '', portion: '', cal: '', pro: '', carbs: '50', fat: '15' });

  // Form States (Simplified for UI Demo)
  const [instructions, setInstructions] = useState({ timings: true, hydration: true, portions: false, track: true, review: false, share: true });

  const toggleInstruction = (key: keyof typeof instructions) => setInstructions(prev => ({ ...prev, [key]: !prev[key] }));

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenMealDrawer = (meal?: any) => {
    setEditingMeal(meal || null);
    if (meal) {
      setMealForm({
        type: meal.type,
        time: meal.time,
        name: meal.name,
        portion: meal.portion,
        cal: meal.cal,
        pro: meal.pro,
        carbs: meal.carbs || 50,
        fat: meal.fat || 15
      });
      setMealDays(meal.days.map((d: string) => d.substring(0, 3)));
    } else {
      setMealForm({
        type: 'Breakfast',
        time: '08:00 AM',
        name: '',
        portion: '',
        cal: '',
        pro: '',
        carbs: '50',
        fat: '15'
      });
      setMealDays([activeDay.substring(0, 3)]);
    }
    setShowMealDrawer(true);
  };

  const handleSaveMeal = async () => {
    const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].filter(d => mealDays.includes(d.substring(0, 3)));
    
    try {
      if (editingMeal) {
        const response = await api.put(`/diet/${patientInfo.id}/meals/${editingMeal.id}`, { ...mealForm, days: fullDays });
        setMeals(prev => prev.map(m => m.id === editingMeal.id ? response.data : m));
        showToast("Meal updated");
      } else {
        const response = await api.post(`/diet/${patientInfo.id}/meals`, { ...mealForm, days: fullDays });
        setMeals(prev => [...prev, response.data]);
        showToast("Meal added");
      }
    } catch (e) {
       console.error("Failed to save meal", e);
       showToast("Failed to save meal (see console)");
    }
    setShowMealDrawer(false);
  };

  const handleDeleteMeal = async (id: string | number) => {
    try {
      await api.delete(`/diet/${patientInfo.id}/meals/${id}`);
      setMeals(prev => prev.filter(m => m.id !== id));
      showToast("Meal deleted");
    } catch (e) {
      console.error("Failed to delete meal", e);
      showToast("Failed to delete meal (see console)");
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // --- RENDERERS ---

  const renderAssessmentModal = () => (
    <AnimatePresence>
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssessmentModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col rounded-3xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-500" /> New Plan Assessment
              </h2>
              <button onClick={() => setShowAssessmentModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Nutrition Assessment */}
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-slate-500">Patient Habits & Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Eating Pattern</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20">
              <option>Regular meals</option>
              <option>Irregular meals</option>
              <option>Frequently skips meals</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Activity Level</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="Moderate">
              <option>Sedentary</option>
              <option>Light</option>
              <option>Moderate</option>
              <option>Active</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Meal Frequency</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="4 meals">
              <option>2 meals</option>
              <option>3 meals</option>
              <option>4 meals</option>
              <option>5+ meals</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Hydration Habit</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="Moderate">
              <option>Low</option>
              <option>Moderate</option>
              <option>Good</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Food Preferences</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="South Indian">
              <option>South Indian</option>
              <option>North Indian</option>
              <option>Indian</option>
              <option>Mixed</option>
              <option>Custom</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Dietary Restrictions</label>
            <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="Non-Vegetarian">
              <option>Vegetarian</option>
              <option>Non-Vegetarian</option>
              <option>Vegan</option>
              <option>Eggetarian</option>
              <option>Dairy-Free</option>
              <option>Gluten-Free</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end"></div>
      </div>

      {/* Goals & Targets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Nutrition Goals */}
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 col-span-1">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-500" /> Nutrition Goals
          </h3>
          <div className="space-y-4">
             <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Primary Goal</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="Balanced Nutrition">
                <option>Balanced Nutrition</option>
                <option>Weight Management</option>
                <option>Improve Energy</option>
                <option>Heart-Healthy Nutrition</option>
                <option>Diabetes-Friendly Nutrition</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Plan Duration</label>
              <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20" defaultValue="4 Weeks">
                <option>2 Weeks</option>
                <option>4 Weeks</option>
                <option>8 Weeks</option>
                <option>12 Weeks</option>
              </select>
            </div>
          </div>
        </div>

        {/* Nutrient Targets */}
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 col-span-1 lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-500" /> Nutrient Targets
            </h3>
            <button className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">Edit Targets</button>
           </div>
           
           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Calories', val: '2,000', unit: 'kcal/day', color: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' },
                { label: 'Protein', val: '75', unit: 'g/day', color: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' },
                { label: 'Carbohydrates', val: '250', unit: 'g/day', color: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30' },
                { label: 'Healthy Fats', val: '65', unit: 'g/day', color: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30' },
                { label: 'Fibre', val: '30', unit: 'g/day', color: 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/30' },
                { label: 'Water', val: '2.5', unit: 'L/day', color: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-900/30' },
              ].map(t => (
                <div key={t.label} className={`p-4 rounded-2xl border ${t.color}`}>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{t.label}</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{t.val} <span className="text-sm font-semibold text-slate-500">{t.unit}</span></div>
                </div>
              ))}
           </div>
        </div>

      </div>
      
      <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
         <button onClick={() => setShowAssessmentModal(false)} className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-colors">Cancel</button>
         <button onClick={() => { setShowAssessmentModal(false); setActiveTab('plan'); showToast("Assessment Saved! Ready to generate plan."); }} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold rounded-xl transition-colors shadow-md">Save Assessment</button>
      </div>
      
    </div>
    </motion.div>
    </div>
    )}
    </AnimatePresence>
  );

  const renderMealPlanTab = () => (
    <div className="animate-in fade-in duration-500">
      
      {/* AI Generate Prompt Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 sm:p-5 mb-8 relative overflow-hidden shadow-lg border border-slate-800 flex items-center justify-between">
        <div className="absolute inset-0 bg-cyan-500/10 blur-xl rounded-full translate-y-1/2"></div>
        <div className="relative z-10 w-full flex items-center justify-center gap-3 text-center">
          <h2 className="text-xl sm:text-2xl font-medium text-slate-300 uppercase tracking-widest">
            Healthcare Meal Plan <span className="text-slate-500 mx-2">|</span> <span className="text-white font-bold tracking-normal">AI Generation ✨</span>
          </h2>
        </div>
        <button onClick={() => setShowAIModal(true)} className="relative z-10 p-2 hover:bg-white/10 rounded-lg text-slate-300 transition-colors">
          <Sparkles className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Planner */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Day Tabs - Floating Pills */}
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 px-1">
            {weekDates.map(({ day, date }) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex flex-col items-center justify-center min-w-[70px] h-20 rounded-2xl transition-all shadow-sm border ${
                  activeDay === day 
                    ? 'bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-slate-300 dark:border-slate-600 shadow-md transform -translate-y-1' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${activeDay === day ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400'}`}>
                  {day.substring(0, 3)}
                </span>
                <span className={`text-xl font-black ${activeDay === day ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                  {date}
                </span>
              </button>
            ))}
          </div>

          <div className="mb-4 mt-2 px-1">
             <h3 className="text-xl font-black text-slate-900 dark:text-white">
               {activeDay}, {weekDates.find(d => d.day === activeDay)?.month} {weekDates.find(d => d.day === activeDay)?.date}
             </h3>
          </div>

          {/* Meals List */}
          <div className="space-y-6">
            {meals.filter(m => m.days.includes(activeDay)).map((meal) => (
              <div key={meal.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group relative">
                
                <div className="flex justify-between items-start mb-4">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                     {meal.type}
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="flex items-center gap-0.5">
                       <button onClick={() => { setSelectedMealForSwap(meal); setShowSwapDrawer(true); }} className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded-lg transition-colors" title="Swap Food">
                         <RefreshCw className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleOpenMealDrawer(meal)} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Meal">
                         <Edit2 className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDeleteMeal(meal.id)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" title="Delete Meal">
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                     <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                       {meal.cal} kcal
                     </div>
                   </div>
                </div>

                <div className="flex items-start gap-5">
                   <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0 shadow-inner text-3xl">
                     {meal.type === 'Breakfast' ? '🥑' : meal.type === 'Lunch' ? '🥗' : meal.type.includes('Snack') ? '🍎' : '🍲'}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1">{meal.name}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">{meal.portion}</p>
                      
                      <div className="flex flex-wrap items-center gap-3">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mr-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                           {meal.time}
                         </div>
                         <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                           {meal.pro}g Protein
                         </div>
                         <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                           {meal.carbs || Math.round(meal.cal * 0.5 / 4)}g Carbs
                         </div>
                         <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                           {meal.fat || Math.round(meal.cal * 0.3 / 9)}g Fat
                         </div>
                      </div>
                   </div>
                </div>

              </div>
            ))}

            <button onClick={() => handleOpenMealDrawer()} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:border-cyan-500 hover:text-cyan-500 dark:hover:border-cyan-500 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/10 transition-all flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Meal
            </button>
          </div>
        </div>

        {/* Sidebar: Recommendations & Limitations */}
        <div className="space-y-6">
           {/* RECOMMENDED FOODS */}
           <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">
              Recommended Foods
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {[
                'Leafy Greens (Veg)', 'Berries (Fruit)', 'Nuts (Snack)', 
                'Salmon (Omega-3)', 'Oats (Grains)', 'Greek Yogurt (Probiotic)'
              ].map(f => (
                <span key={f} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-default">
                  {f}
                </span>
              ))}
            </div>
            
            <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-8"></div>

            {/* FOODS TO LIMIT */}
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6">
              Foods to Limit
            </h3>
            <ul className="space-y-4">
              {[
                'Sugary Drinks',
                'Red Meat',
                'Processed Foods',
                'High Sodium',
                'Refined Grains'
              ].map(item => (
                <li key={item} className="flex justify-between items-center text-sm font-bold text-slate-700 dark:text-slate-300">
                  {item}
                  <X className="w-4 h-4 text-slate-400" />
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quality Score */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-1 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" /> Nutrition Plan Quality
            </h2>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">82</span>
              <span className="text-xl font-bold text-slate-400 mb-1">/ 100</span>
            </div>
            <div className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-lg mb-8 border border-emerald-200 dark:border-emerald-800/50">
              Status: Good
            </div>
            
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Breakdown</p>
              {[
                { label: 'Meal Balance', ok: true },
                { label: 'Protein Coverage', ok: true },
                { label: 'Hydration', ok: true },
                { label: 'Food Variety', ok: true },
                { label: 'Fibre Target', ok: false },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                  {b.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> : <AlertCircle className="w-4 h-4 text-amber-500 shrink-0"/>}
                  {b.label}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 mt-6">* This is a plan quality indicator based on targeted macros, not a medical diagnosis.</p>
        </div>

        {/* Daily Nutrient Breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-2">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
             <Apple className="w-4 h-4 text-cyan-500" /> Daily Nutrient Breakdown
          </h2>
          <div className="space-y-6">
            {[
              { label: 'Calories', current: 1780, max: 2000, unit: 'kcal', color: 'bg-amber-400' },
              { label: 'Protein', current: 62, max: 75, unit: 'g', color: 'bg-blue-400' },
              { label: 'Carbohydrates', current: 215, max: 250, unit: 'g', color: 'bg-emerald-400' },
              { label: 'Fat', current: 48, max: 65, unit: 'g', color: 'bg-rose-400' },
              { label: 'Fibre', current: 24, max: 30, unit: 'g', color: 'bg-purple-400' },
              { label: 'Water', current: 2.1, max: 2.5, unit: 'L', color: 'bg-cyan-400' },
            ].map(macro => {
              const percent = Math.min(100, Math.round((macro.current / macro.max) * 100));
              return (
                <div key={macro.label}>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-slate-600 dark:text-slate-300 uppercase tracking-wider">{macro.label}</span>
                    <span className="text-slate-900 dark:text-white">{macro.current} <span className="text-slate-400 font-medium">/ {macro.max} {macro.unit}</span></span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-200/50 dark:border-slate-200 dark:border-slate-700/50">
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${macro.color} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly Progress & Adherence */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-500" /> Patient Adherence & Progress
            </h2>
            <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none">
              <option>7 Days</option>
              <option>30 Days</option>
              <option>Custom</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Meals Completed</p>
               <div className="text-3xl font-black text-slate-900 dark:text-white">86%</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Water Goal</p>
               <div className="text-3xl font-black text-slate-900 dark:text-white">74%</div>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plan Followed</p>
               <div className="text-3xl font-black text-slate-900 dark:text-white">81%</div>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-2 opacity-80">
            {/* Simulated Chart Bars */}
            {[60, 80, 40, 90, 75, 85, 100].map((h, i) => (
              <div key={i} className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-t-xl relative group overflow-hidden">
                <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }} className="absolute bottom-0 w-full bg-cyan-500/80 group-hover:bg-cyan-400 transition-colors"></motion.div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-bold text-slate-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
          <div className="mt-6">
            <button className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline">View Detailed Progress</button>
          </div>
        </div>

        {/* Clinical Notes & Instructions */}
        <div className="space-y-8 col-span-1">
          {/* Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-500" /> Clinical Notes
            </h2>
            <textarea 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none h-32 mb-4" 
              placeholder="Enter clinical observations, adjustments, and dietetic notes here..."
            />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Next Review</label>
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Frequency</label>
                <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none">
                  <option>Weekly</option>
                  <option>Bi-Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
            </div>
            <button className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold transition-colors">
              Save Notes
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-cyan-500" /> Patient Instructions
            </h2>
            <div className="space-y-3 mb-6">
              {[
                { key: 'timings', label: 'Follow scheduled meal timings' },
                { key: 'hydration', label: 'Maintain daily hydration' },
                { key: 'portions', label: 'Follow recommended portions' },
                { key: 'track', label: 'Track meals regularly' },
                { key: 'review', label: 'Review progress during follow-up' }
              ].map(item => (
                <div 
                  key={item.key} onClick={() => toggleInstruction(item.key as keyof typeof instructions)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors"
                >
                  {instructions[item.key as keyof typeof instructions] 
                    ? <CheckSquare className="w-5 h-5 text-cyan-500 shrink-0" /> 
                    : <Square className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0" />
                  }
                  <span className={`text-sm font-bold ${instructions[item.key as keyof typeof instructions] ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-800/30 rounded-xl cursor-pointer" onClick={() => toggleInstruction('share')}>
              {instructions.share ? <CheckSquare className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> : <Square className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />}
              <span className="text-xs font-black text-cyan-700 dark:text-cyan-400 uppercase tracking-wider">Share instructions with patient</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div id="plan-history-section" className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 animate-in fade-in duration-500">
      <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <History className="w-4 h-4 text-cyan-500" /> Plan History & Versions
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="pb-4 text-xs font-black uppercase tracking-wider text-slate-500">Plan Name</th>
              <th className="pb-4 text-xs font-black uppercase tracking-wider text-slate-500">Duration</th>
              <th className="pb-4 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
              <th className="pb-4 text-xs font-black uppercase tracking-wider text-slate-500">Updated</th>
              <th className="pb-4 text-xs font-black uppercase tracking-wider text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700 dark:text-slate-300">
            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <td className="py-4">Balanced Nutrition Plan <br/><span className="text-xs font-medium text-slate-400">Version 3</span></td>
              <td className="py-4 text-slate-500">01–28 Sep</td>
              <td className="py-4"><span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs">Active</span></td>
              <td className="py-4">08 Sep 2026</td>
              <td className="py-4 text-right space-x-3">
                <button className="text-cyan-600 hover:underline">View</button>
                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Duplicate</button>
              </td>
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <td className="py-4">Nutrition Plan <br/><span className="text-xs font-medium text-slate-400">Version 1</span></td>
              <td className="py-4 text-slate-500">01–28 Aug</td>
              <td className="py-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs">Completed</span></td>
              <td className="py-4">28 Aug 2026</td>
              <td className="py-4 text-right space-x-3">
                <button className="text-cyan-600 hover:underline">View</button>
                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Duplicate</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
              <td className="py-4">Basic Diet Plan <br/><span className="text-xs font-medium text-slate-400">Version 1</span></td>
              <td className="py-4 text-slate-500">15–30 Jul</td>
              <td className="py-4"><span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-xs">Completed</span></td>
              <td className="py-4">30 Jul 2026</td>
              <td className="py-4 text-right space-x-3">
                <button className="text-cyan-600 hover:underline">View</button>
                <button className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">Duplicate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-200 pb-32">
      
      {/* TOAST */}
      <div className="fixed bottom-24 right-8 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toastMessage && (
            <motion.div initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} className="px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 pointer-events-auto border border-slate-800 dark:border-slate-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-500" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* 1. HEADER */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 tracking-wide uppercase">
              <span>Doctor Portal</span> <ChevronRight className="w-3 h-3" /> 
              <span>Patients</span> <ChevronRight className="w-3 h-3" /> 
              <span className="text-cyan-600 dark:text-cyan-400">Diet & Nutrient Plan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
              <Apple className="w-7 h-7 text-cyan-500" /> Diet & Nutrient Plan
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              Create, customize, and monitor personalized nutrition plans for patients.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
              <input 
                type="text" 
                placeholder="Search Patient..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(e.target.value.length > 0);
                }}
                onFocus={() => setShowSearchResults(searchQuery.length > 0)}
                onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2.5 outline-none text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 w-48 sm:w-64 relative z-10" 
              />
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 10 }} 
                    className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="p-2">
                      <div 
                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                          showToast("Loaded patient: Rahul Sharma");
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 flex items-center justify-center font-bold text-xs">RS</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Rahul Sharma</p>
                          <p className="text-xs text-slate-500">ID: MED-9921</p>
                        </div>
                      </div>
                      <div 
                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors flex items-center gap-3"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchResults(false);
                          showToast("Loaded patient: Priya Patel");
                        }}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 flex items-center justify-center font-bold text-xs">PP</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Priya Patel</p>
                          <p className="text-xs text-slate-500">ID: MED-4452</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button onClick={() => setActiveTab('history')} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
              <History className="w-4 h-4" /> View History
            </button>
            <button onClick={() => { 
                setShowAssessmentModal(true); 
              }} 
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" /> Create New Plan
            </button>
          </div>
        </div>

        {/* 2. PATIENT OVERVIEW (Compact) */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-md text-slate-300 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30 text-xl font-black text-cyan-400">
              {patientInfo.avatar}
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-3">
                {patientInfo.name}
                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] uppercase tracking-widest rounded-md border border-slate-200 dark:border-slate-700">{patientInfo.id}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 md:gap-5 text-sm font-medium mt-1">
                <span className="flex items-center gap-1">Age: <strong className="text-white">{patientInfo.age}</strong></span>
                <span className="flex items-center gap-1">Activity: <strong className="text-white">{patientInfo.activity}</strong></span>
                <span className="flex items-center gap-1">Goal: <strong className="text-white">{patientInfo.goal}</strong></span>
                <span className="flex items-center gap-1">Allergies: <strong className="text-rose-400">{patientInfo.allergies}</strong></span>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0">
            <button className="text-sm font-bold text-cyan-400 hover:text-cyan-300 hover:underline">View Patient Profile</button>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1 text-right">Last Updated: {patientInfo.lastUpdated}</div>
          </div>
        </div>

        {/* 3. NUTRITION ALERTS */}
        {activeTab !== 'history' && (
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl flex items-center gap-3 text-sm font-bold text-amber-800 dark:text-amber-500 shadow-sm">
              <AlertCircle className="w-4 h-4" /> ⚠ Protein target needs attention
            </div>
            <div className="px-4 py-2.5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50 rounded-xl flex items-center gap-3 text-sm font-bold text-blue-800 dark:text-blue-400 shadow-sm">
              <Droplets className="w-4 h-4" /> 💧 Hydration goal is below target
            </div>
          </div>
        )}

        {/* MAIN NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto custom-scrollbar">
          {[
            { id: 'plan', label: 'Meal Plan' },
            { id: 'analysis', label: 'Analysis & Progress' }
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

        {/* TAB CONTENT RENDERER */}
        <div className="py-2">
          {activeTab === 'plan' && renderMealPlanTab()}
          {activeTab === 'analysis' && renderAnalysisTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </div>

      </div>

      {/* BOTTOM ACTION BAR (Sticky) */}
      <AnimatePresence>
        {activeTab !== 'history' && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 p-4 z-40"
          >
            <div className="max-w-7xl w-full mx-auto px-2 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm font-bold text-slate-500">
                Last saved: <span className="text-slate-900 dark:text-white">Just now</span>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
                <button onClick={() => showToast("Draft Saved Successfully!")} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                  Save Draft
                </button>
                <button onClick={() => showToast("Opening Preview...")} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm hidden sm:block">
                  Preview Plan
                </button>
                <button onClick={() => showToast("Downloading PDF...")} className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Export PDF
                </button>
                <button onClick={() => setShowAssignModal(true)} className="px-8 py-2.5 bg-slate-900 dark:bg-cyan-600 text-white rounded-xl text-sm font-black hover:bg-slate-800 dark:hover:bg-cyan-500 transition-colors shadow-lg flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Assign Plan
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODALS & DRAWERS --- */}

      {/* AI GENERATION MODAL */}
      <AnimatePresence>
        {showAIModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAIModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white">
                <h2 className="text-xl font-black flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400" /> Generate Nutrition Plan</h2>
                <button onClick={() => setShowAIModal(false)} className="p-2 text-slate-400 hover:text-white rounded-full transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Nutrition Goal</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none" defaultValue={patientInfo.goal}><option>Balanced Nutrition</option><option>Weight Management</option></select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Diet Type</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none" defaultValue="South Indian"><option>South Indian</option><option>North Indian</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Cal</label>
                    <input type="number" defaultValue={2000} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Target Pro</label>
                    <input type="number" defaultValue={75} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Frequency</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white outline-none"><option>3 Meals</option><option>4 Meals</option><option>5 Meals</option></select>
                  </div>
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Dietary Restrictions applied</label>
                   <div className="flex gap-2">
                     <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-800/50">Peanuts</span>
                     <span className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg text-xs font-bold border border-rose-200 dark:border-rose-800/50">Shellfish</span>
                   </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                <button onClick={() => setShowAIModal(false)} className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
                <button onClick={() => { setShowAIModal(false); showToast("AI Draft Generated Successfully!"); }} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"><Sparkles className="w-4 h-4"/> Generate Draft</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MEAL SWAP MODAL */}
      <AnimatePresence>
        {showSwapDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSwapDrawer(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col rounded-3xl overflow-hidden max-h-[90vh]">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-cyan-50 dark:bg-cyan-900/10">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2"><RefreshCw className="w-5 h-5 text-cyan-500" /> Swap Food</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">Select an alternative for <strong className="text-slate-700 dark:text-slate-300">{selectedMealForSwap?.name}</strong></p>
                </div>
                <button onClick={() => setShowSwapDrawer(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {[
                  { name: "Dosa + Sambar", portion: "2 medium, 1 bowl", cal: 280, pro: 8 },
                  { name: "Vegetable Upma", portion: "1.5 cups", cal: 300, pro: 6 },
                  { name: "Pongal + Sambar", portion: "1 cup, 1 bowl", cal: 350, pro: 9 },
                  { name: "Oats + Fruit", portion: "1 bowl", cal: 250, pro: 10 }
                ].map((alt, i) => (
                  <div key={i} className="p-4 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-2xl hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-md transition-all cursor-pointer group flex justify-between items-center bg-white dark:bg-slate-800">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{alt.name}</h4>
                      <p className="text-xs font-medium text-slate-500 mb-2">{alt.portion}</p>
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-amber-600 dark:text-amber-400">{alt.cal} kcal</span>
                        <span className="text-blue-600 dark:text-blue-400">{alt.pro}g pro</span>
                      </div>
                    </div>
                    <button onClick={() => { setShowSwapDrawer(false); showToast("Meal Replaced!"); }} className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                      Replace
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MEAL EDIT MODAL */}
      <AnimatePresence>
        {showMealDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMealDrawer(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col rounded-3xl overflow-hidden max-h-[90vh]">
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-cyan-500" /> {editingMeal ? 'Edit Meal' : 'Add New Meal'}
                </h2>
                <button onClick={() => setShowMealDrawer(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Meal Type</label>
                    <select value={mealForm.type} onChange={(e) => setMealForm({...mealForm, type: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 outline-none">
                      <option>Breakfast</option><option>Morning Snack</option><option>Lunch</option><option>Evening Snack</option><option>Dinner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Time</label>
                    <input type="time" value={mealForm.time.substring(0, 5)} onChange={(e) => setMealForm({...mealForm, time: e.target.value + ' AM'})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl px-4 py-2.5 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Days</label>
                  <div className="flex flex-wrap gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        onClick={() => {
                          setMealDays(prev => 
                            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                          );
                        }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                          mealDays.includes(day)
                            ? 'bg-cyan-500 text-white border-cyan-500'
                            : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-cyan-500'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Food Description</label>
                  <textarea value={mealForm.name} onChange={(e) => setMealForm({...mealForm, name: e.target.value})} rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white rounded-xl p-4 outline-none resize-none" placeholder="e.g. Oats Idli with Sambar" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Portion</label>
                  <input type="text" value={mealForm.portion} onChange={(e) => setMealForm({...mealForm, portion: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white rounded-xl px-4 py-3 outline-none" placeholder="e.g. 3 pieces, 1 cup" />
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-200 dark:border-slate-700 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">Macronutrients</h4>
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                      <label className="block text-xs font-bold text-amber-600 dark:text-amber-500 mb-1">Calories (kcal)</label>
                      <input type="number" value={mealForm.cal} onChange={(e) => setMealForm({...mealForm, cal: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl px-3 py-2 outline-none" />
                    </div>
                     <div>
                      <label className="block text-xs font-bold text-blue-600 dark:text-blue-500 mb-1">Protein (g)</label>
                      <input type="number" value={mealForm.pro} onChange={(e) => setMealForm({...mealForm, pro: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl px-3 py-2 outline-none" />
                    </div>
                     <div>
                      <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-500 mb-1">Carbs (g)</label>
                      <input type="number" value={mealForm.carbs} onChange={(e) => setMealForm({...mealForm, carbs: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl px-3 py-2 outline-none" />
                    </div>
                     <div>
                      <label className="block text-xs font-bold text-rose-600 dark:text-rose-500 mb-1">Fat (g)</label>
                      <input type="number" value={mealForm.fat} onChange={(e) => setMealForm({...mealForm, fat: e.target.value})} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-bold rounded-xl px-3 py-2 outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Notes</label>
                  <textarea rows={2} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white rounded-xl p-4 outline-none resize-none" placeholder="Special prep instructions..." />
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
                <button onClick={() => setShowMealDrawer(false)} className="flex-1 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-200 dark:border-slate-700 font-bold rounded-xl transition-colors text-slate-700 dark:text-slate-300">Cancel</button>
                <button onClick={handleSaveMeal} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-xl transition-colors shadow-md"><Save className="w-4 h-4 inline-block mr-2" /> Save Meal</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN CONFIRMATION MODAL */}
      <AnimatePresence>
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAssignModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/30">
                <Send className="w-10 h-10 text-white translate-x-1 -translate-y-0.5" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Assign Plan to Patient?</h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 px-2">This will instantly notify <strong className="text-slate-700 dark:text-slate-300">{patientInfo.name}</strong> and update their mobile app with the new nutrition guidelines.</p>
              
              <div className="flex gap-3">
                <button onClick={() => setShowAssignModal(false)} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors">Cancel</button>
                <button onClick={() => { setShowAssignModal(false); showToast("Plan Assigned Successfully!"); }} className="flex-1 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-black rounded-xl transition-colors shadow-md">Assign Plan</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {renderAssessmentModal()}

    </div>
  );
}
