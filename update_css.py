import os, glob, re

styles_dir = r"c:\Users\ksthi\Pictures\React\Expense-Tracker\src\styles"
css_files = glob.glob(os.path.join(styles_dir, "**", "*.css"), recursive=True)

for file in css_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for a modern dark/glass theme
    content = re.sub(r'background:\s*#ffffff;?', 'background: var(--glass-bg);\n  backdrop-filter: var(--glass-blur);\n  border: 1px solid var(--glass-border);', content, flags=re.IGNORECASE)
    content = re.sub(r'background:\s*#fff;?', 'background: var(--glass-bg);\n  backdrop-filter: var(--glass-blur);\n  border: 1px solid var(--glass-border);', content, flags=re.IGNORECASE)
    content = re.sub(r'background-color:\s*#ffffff;?', 'background-color: transparent;', content, flags=re.IGNORECASE)
    
    content = re.sub(r'color:\s*#666;?', 'color: var(--text-muted);', content, flags=re.IGNORECASE)
    content = re.sub(r'color:\s*#333;?', 'color: var(--text-main);', content, flags=re.IGNORECASE)
    content = re.sub(r'color:\s*#555;?', 'color: var(--text-main);', content, flags=re.IGNORECASE)
    content = re.sub(r'color:\s*#000;?', 'color: var(--text-main);', content, flags=re.IGNORECASE)
    content = re.sub(r'box-shadow:.*?;', 'box-shadow: var(--glass-shadow);', content, flags=re.IGNORECASE)
    
    # Border colors
    content = re.sub(r'border:\s*1px solid #ddd;?', 'border: 1px solid var(--glass-border);', content, flags=re.IGNORECASE)
    content = re.sub(r'border:\s*1px solid #eee;?', 'border: 1px solid var(--glass-border);', content, flags=re.IGNORECASE)
    content = re.sub(r'border-bottom:\s*1px solid #eee;?', 'border-bottom: 1px solid var(--glass-border);', content, flags=re.IGNORECASE)
    content = re.sub(r'border-bottom:\s*1px solid #ddd;?', 'border-bottom: 1px solid var(--glass-border);', content, flags=re.IGNORECASE)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
        
print(f'Processed {len(css_files)} CSS files.')
