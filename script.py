import os
import re

src_dir = r'd:\MediCare\Healthcare\src'
changes_made = 0
files_changed = 0

replacements = [
    (r'(?<!dark:)bg-\[\#15192b\]', r'bg-white dark:bg-[#15192b]'),
    (r'(?<!dark:)bg-\[\#121626\]', r'bg-slate-50 dark:bg-[#121626]'),
    (r'(?<!dark:)bg-\[\#1a1f33\]', r'bg-slate-100 dark:bg-[#1a1f33]'),
    (r'(?<!dark:)bg-\[\#1f2937\]', r'bg-slate-100 dark:bg-[#1f2937]'),
    (r'(?<!dark:)bg-\[\#0b172a\]', r'bg-white dark:bg-[#0b172a]'),
    (r'(?<!dark:)bg-\[\#091b36\]', r'bg-slate-50 dark:bg-[#091b36]'),
    (r'(?<!dark:)bg-\[\#040e1e\]', r'bg-slate-100 dark:bg-[#040e1e]'),
    (r'(?<!dark:)bg-\[\#0b1120\]', r'bg-white dark:bg-[#0b1120]'),
    (r'(?<!dark:)bg-\[\#070c18\]', r'bg-slate-50 dark:bg-[#070c18]'),
    (r'(?<!dark:)border-slate-700/50', r'border-slate-200 dark:border-slate-700/50'),
    (r'(?<!dark:)border-slate-800/60', r'border-slate-200 dark:border-slate-800/60'),
    (r'(?<!dark:)border-slate-800', r'border-slate-200 dark:border-slate-800'),
    (r'(?<!dark:)border-slate-700', r'border-slate-200 dark:border-slate-700'),
    (r'(?<!dark:)text-slate-400', r'text-slate-500 dark:text-slate-400'),
    (r'(?<!dark:)text-slate-300', r'text-slate-600 dark:text-slate-300'),
]

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            for pattern, repl in replacements:
                new_content = re.sub(pattern, repl, new_content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                files_changed += 1

print(f'Done. Changed {files_changed} files.')
