import os
import re

src_dir = r'd:\MediCare\Healthcare\src'
files_changed = 0

def process_classname(match):
    full_str = match.group(0)
    
    # If the class string contains a button-like or solid background color, skip it
    skip_keywords = ['bg-teal', 'bg-blue', 'bg-rose', 'bg-amber', 'bg-indigo', 'bg-emerald', 'bg-cyan', 'bg-red', 'bg-green', 'bg-[#00a896]', 'bg-[#00897b]', 'bg-slate-900', 'bg-slate-800']
    
    should_skip = any(kw in full_str for kw in skip_keywords)
    
    if not should_skip:
        # replace text-white with text-slate-900 dark:text-white
        # but only if not already prefixed with dark:
        full_str = re.sub(r'(?<!dark:)text-white\b', r'text-slate-900 dark:text-white', full_str)
        
    return full_str

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find all className="..." or className={...}
            new_content = re.sub(r'className=(["\'])(.*?)\1', process_classname, content)
            
            if new_content != content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                files_changed += 1

print(f'Done. Changed {files_changed} files for text-white.')
