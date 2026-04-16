import os, re, glob
missing = set()
for f in glob.glob('**/*.*', recursive=True):
    if not f.endswith(('.html', '.css', '.js')):
        continue
    try:
        content = open(f, 'r', encoding='utf-8', errors='ignore').read()
        # Find all src="..." or href="..." or url(...) matches
        matches = re.finditer(r'(?:src|href)=[\'"]([^\'"]+.(?:jpg|png|svg|webp|gif|webm|mp4))[\'"]|url\([\'"]?([^\'"\)]+.(?:jpg|png|svg|webp|gif))[\'"]?\)', content, re.IGNORECASE)
        for m in matches:
            path = m.group(1) or m.group(2)
            if not path or path.startswith('http') or path.startswith('//') or path.startswith('data:'):
                continue
                
            full_path = os.path.normpath(os.path.join(os.path.dirname(f), path))
            if not os.path.exists(full_path):
                # check root relative
                root_path = os.path.normpath(path.lstrip('/\\'))
                if not os.path.exists(root_path):
                    missing.add(path)
    except Exception as e:
        pass

for m in sorted(list(missing)):
    print(m)
