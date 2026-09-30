import sys

path = 'src/components/scan/ScannerModal.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 1
c = c.replace('className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-slate-50"', 
              'className="flex-1 flex items-center justify-center p-4 overflow-hidden relative bg-slate-50 dark:bg-slate-950"')
# 2
c = c.replace('className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-5 text-center text-slate-900 border border-slate-200/90 bg-white shadow-xl"',
              'className="relative w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-5 text-center text-slate-900 dark:text-white border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl"')
# 3
c = c.replace('className="text-xl font-black text-slate-900 tracking-tight"',
              'className="text-xl font-black text-slate-900 dark:text-white tracking-tight"')
# 4
c = c.replace('className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed font-medium"',
              'className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-medium"')
# 5
c = c.replace('className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border border-slate-200 bg-slate-100/90"',
              'className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-800/90"')
# 6
c = c.replace("'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'",
              "'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'")
# 7
c = c.replace('className="p-4 rounded-2xl border border-teal-200 bg-teal-50/40 hover:bg-teal-50/80 transition-all cursor-pointer flex flex-col gap-3 hover:border-teal-400 shadow-xs hover:shadow-md group"',
              'className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/40 dark:bg-teal-900/20 hover:bg-teal-50/80 dark:hover:bg-teal-900/40 transition-all cursor-pointer flex flex-col gap-3 hover:border-teal-400 dark:hover:border-teal-600 shadow-xs hover:shadow-md group"')
# 8
c = c.replace('className="text-xs font-extrabold text-slate-900 group-hover:text-[#00a896] transition-colors">Start Device Camera</h4>',
              'className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#00a896] dark:group-hover:text-teal-400 transition-colors">Start Device Camera</h4>')
# 9
c = c.replace('className="text-[11px] text-slate-500 mt-0.5 font-medium"',
              'className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium"')
# 10
c = c.replace('className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col gap-3 hover:border-amber-400 shadow-xs hover:shadow-md group"',
              'className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-amber-50/30 dark:hover:bg-amber-900/20 transition-all cursor-pointer flex flex-col gap-3 hover:border-amber-400 dark:hover:border-amber-600 shadow-xs hover:shadow-md group"')
# 11
c = c.replace('className="text-xs font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">Instant AI Scan Demo</h4>',
              'className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">Instant AI Scan Demo</h4>')
# 12
c = c.replace('className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"',
              'className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"')
# 13
c = c.replace('className="text-slate-700 hover:text-[#00a896] font-bold flex items-center gap-1.5 cursor-pointer"',
              'className="text-slate-700 dark:text-slate-300 hover:text-[#00a896] dark:hover:text-teal-400 font-bold flex items-center gap-1.5 cursor-pointer"')
# Also fix the top header which might be missing dark classes
c = c.replace('className="fixed inset-0 z-50 flex flex-col bg-white overflow-hidden"',
              'className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-slate-950 overflow-hidden"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
