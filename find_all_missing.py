import os, re, glob

missing = set()

for f in glob.glob('**/*.*', recursive=True):
    if not f.endswith(('.html', '.css', '.js', '.json')):
        continue
    
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            # Match any string that looks like 'assets/images/...'
            matches = re.findall(r'(assets/images/[a-zA-Z0-9_\-\./]+[a-zA-Z0-9_\-\.])', content)
            
            # Match other general image extensions to be safe
            matches2 = re.findall(r'[\'"]([^\'"]+\.(?:jpg|png|webp|svg|jpeg|gif|ico))[\'"]', content)
            
            all_matches = set(matches + matches2)
            
            for m in all_matches:
                # ignore URLs
                if m.startswith('http') or m.startswith('//') or m.startswith('data:'):
                    continue
                
                # Check path relative to file
                full_path_relative = os.path.normpath(os.path.join(os.path.dirname(f), m))
                
                # Check path relative to root
                full_path_root = os.path.normpath(m)
                if full_path_root.startswith('\\') or full_path_root.startswith('/'):
                    full_path_root = full_path_root[1:]
                
                exists_rel = os.path.exists(full_path_relative)
                exists_root = os.path.exists(full_path_root)
                
                if not exists_rel and not exists_root:
                    missing.add((f, m))
    except Exception as e:
        pass

for f_name, m_path in sorted(list(missing)):
    print(f"{f_name}: Missing -> {m_path}")
