import os, re, glob, shutil

base_path = r'C:\Users\Admin\.gemini\antigravity\brain\9fb7d4ad-8c47-4e23-9445-ef3a55833ba1'

image_map = {
    'default': os.path.join(base_path, 'service_image_1776191816065.png'),
    'cross-out': os.path.join(base_path, 'brand_logo_1776191861910.png'),
    'play': os.path.join(base_path, 'ui_showcase_1776191847582.png')
}

missing = set()

for f in glob.glob('**/*.css', recursive=True):
    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
        content = file.read()
        
        matches = re.findall(r'url\([\'"]?([^\'"\)]+\.(?:jpg|png|svg|gif|ico|webp))[\'"]?\)', content)
        
        for m in matches:
            if m.startswith('http') or m.startswith('//') or m.startswith('data:'):
                continue
                
            full_path = os.path.normpath(os.path.join(os.path.dirname(f), m))
            
            if not os.path.exists(full_path):
                missing.add(full_path)

for m in missing:
    try:
        os.makedirs(os.path.dirname(m), exist_ok=True)
        img_src = image_map['default']
        if 'cross-out' in m:
            img_src = image_map['cross-out']
        elif 'play' in m:
            img_src = image_map['play']
            
        shutil.copy(img_src, m)
        print("Filled CSS Image: " + m)
    except Exception as e:
        print("Error: " + str(e))
