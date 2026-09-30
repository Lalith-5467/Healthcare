const fs = require('fs');
let content = fs.readFileSync('src/components/more-features/views/DietPlanView.tsx', 'utf8');

// 1. Replace the Card Containers (6 replacements)
content = content.replace(/className="bg-\[#1c2431\] rounded-2xl p-6 border border-\[#2d3748\] shadow-lg/g, 'className="bg-white dark:bg-[#1c2431] rounded-3xl p-6 border border-slate-200 dark:border-[#2d3748] shadow-xl dark:shadow-lg transition-all duration-300 hover:shadow-2xl');

// 2. Fix the Headers inside the cards
content = content.replace(/className="text-sm font-bold text-slate-100 tracking-wider"/g, 'className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wider"');

// 3. Fix the '...' buttons
content = content.replace(/className="text-slate-400 hover:text-white"/g, 'className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"');

// 4. Fix Macronutrients & Calories Intake text colors (text-slate-400)
content = content.replace(/className="text-\[10px\] text-slate-400/g, 'className="text-[10px] text-slate-500 dark:text-slate-400');
content = content.replace(/className="text-xs text-slate-400 font-bold/g, 'className="text-xs text-slate-500 dark:text-slate-400 font-bold');

// 5. Fix text inside SVG charts (Protein, Carbs, Fats)
content = content.replace(/className="text-slate-700" strokeWidth="4"/g, 'className="text-slate-200 dark:text-slate-700" strokeWidth="4"');
content = content.replace(/className="text-\[#a5d8d8\]" strokeWidth="4"/g, 'className="text-teal-500 dark:text-[#a5d8d8]" strokeWidth="4"');
content = content.replace(/className="text-xs font-semibold"/g, 'className="text-xs font-semibold text-slate-800 dark:text-slate-200"');

// 6. Fix Calories Intake chart text
content = content.replace(/className="text-xl font-bold leading-none text-white"/g, 'className="text-xl font-bold leading-none text-slate-900 dark:text-white"');

// 7. Fix Weekly Goals list items
content = content.replace(/className="text-sm font-medium"/g, 'className="text-sm font-medium text-slate-800 dark:text-slate-200"');
content = content.replace(/className="w-4 h-4 text-slate-400"/g, 'className="w-4 h-4 text-slate-500 dark:text-slate-400"');
content = content.replace(/className="w-full bg-slate-700 rounded-full h-2"/g, 'className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"');
content = content.replace(/className="bg-\[#a5d8d8\] h-2 rounded-full"/g, 'className="bg-teal-500 dark:bg-[#a5d8d8] h-2 rounded-full"');

// 8. Fix Hydration Goals text
content = content.replace(/className="text-3xl font-bold text-white mb-4 flex items-end gap-2"/g, 'className="text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-end gap-2"');
content = content.replace(/className="text-lg text-slate-400 font-normal mb-1"/g, 'className="text-lg text-slate-500 dark:text-slate-400 font-normal mb-1"');
content = content.replace(/className="w-5 h-5 sm:w-6 sm:h-6 text-\[#a5d8d8\]"/g, 'className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 dark:text-[#a5d8d8]"');
content = content.replace(/className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600"/g, 'className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300 dark:text-slate-600"');
content = content.replace(/className="text-xs text-slate-400 ml-2"/g, 'className="text-xs text-slate-500 dark:text-slate-400 ml-2"');
content = content.replace(/className="w-full bg-slate-700 rounded-full h-1\.5 mb-6"/g, 'className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-6"');
content = content.replace(/className="bg-\[#a5d8d8\] h-1\.5 rounded-full"/g, 'className="bg-teal-500 dark:bg-[#a5d8d8] h-1.5 rounded-full"');

// 9. Fix Meal Schedule list items
content = content.replace(/border-slate-700/g, 'border-slate-200 dark:border-slate-700');
content = content.replace(/className="p-2 bg-slate-800 rounded-lg mt-1"/g, 'className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg mt-1"');
content = content.replace(/className="w-5 h-5 text-\[#a5d8d8\]/g, 'className="w-5 h-5 text-teal-600 dark:text-[#a5d8d8]');
content = content.replace(/text-\[#a5d8d8\]/g, 'text-teal-600 dark:text-[#a5d8d8]');
content = content.replace(/className="text-sm font-bold text-white"/g, 'className="text-sm font-bold text-slate-900 dark:text-white"');
content = content.replace(/className="text-xs text-slate-400 mt-1"/g, 'className="text-xs text-slate-500 dark:text-slate-400 mt-1"');
content = content.replace(/className="text-slate-500 text-xs font-bold uppercase"/g, 'className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase"');

// 10. Fix Micronutrients & Alerts
content = content.replace(/className="text-xs font-bold text-white mb-2"/g, 'className="text-xs font-bold text-slate-800 dark:text-white mb-2"');
content = content.replace(/className="w-full bg-slate-700 rounded-full h-1"/g, 'className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1"');
content = content.replace(/className="bg-\[#a5d8d8\] h-1 rounded-full"/g, 'className="bg-teal-500 dark:bg-[#a5d8d8] h-1 rounded-full"');
content = content.replace(/className="text-sm text-slate-200 font-medium"/g, 'className="text-sm text-slate-800 dark:text-slate-200 font-medium"');
content = content.replace(/className="text-xs text-slate-500 mt-1"/g, 'className="text-xs text-slate-500 dark:text-slate-400 mt-1"');

// 11. Fix the tracking modal text
content = content.replace(/className="text-xs text-slate-400 font-bold tracking-wider"/g, 'className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-wider"');

fs.writeFileSync('src/components/more-features/views/DietPlanView.tsx', content);
console.log("Done");
