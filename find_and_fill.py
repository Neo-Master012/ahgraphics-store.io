import os, re, glob, shutil

base_path = r'C:\Users\Admin\.gemini\antigravity\brain\9fb7d4ad-8c47-4e23-9445-ef3a55833ba1'

image_map = {
    'blog': os.path.join(base_path, 'blog_thumbnail_1776191784391.png'),
    'brand': os.path.join(base_path, 'brand_logo_1776191861910.png'),
    'home-showcase': os.path.join(base_path, 'ui_showcase_1776191847582.png'),
    'project': os.path.join(base_path, 'portfolio_thumbnail_1776191799532.png'),
    'services': os.path.join(base_path, 'service_image_1776191816065.png'),
    'shop': os.path.join(base_path, 'shop_product_1776191832770.png'),
    'team': os.path.join(base_path, 'team_portrait_1776191766036.png'),
    'testimonial': os.path.join(base_path, 'testimonial_portrait_1776191750847.png'),
    'resources': os.path.join(base_path, 'service_image_1776191816065.png'),
    'icon': os.path.join(base_path, 'brand_logo_1776191861910.png'),
    'favicons': os.path.join(base_path, 'brand_logo_1776191861910.png'),
    'default': os.path.join(base_path, 'service_image_1776191816065.png')
}

missing = set()

for f in glob.glob('**/*.*', recursive=True):
    if not f.endswith(('.html', '.css', '.js', '.json')):
        continue
    with open(f, 'r', encoding='utf-8', errors='ignore') as file:
        content = file.read()
        
        # Match anything with assets/images/
        matches1 = re.findall(r'(assets/images/[a-zA-Z0-9_\-\./]+[a-zA-Z0-9_\-\.])', content)
        
        # Match other typical src attributes explicitly
        matches2 = re.findall(r'[\'"]([^\'"]+\.(?:jpg|png|webp|svg|jpeg|gif|ico))[\'"]', content)
        
        for m in (matches1 + matches2):
            if m.startswith('http') or m.startswith('//') or m.startswith('data:'):
                continue
                
            full_path_relative = os.path.normpath(os.path.join(os.path.dirname(f), m))
            
            # Root relative
            m_root = m.lstrip('/\\')
            full_path_root = os.path.normpath(m_root)
            
            if os.path.exists(full_path_relative):
                continue
            if os.path.exists(full_path_root):
                continue
                
            # If it's a completely blind path like 'testimonial-preview.png' at root
            if '/' not in m_root and '\\' not in m_root:
                full_path_relative = os.path.join('.', m_root)
                if os.path.exists(full_path_relative):
                    continue
            
            # Prefer assets/ path if it contains it
            if 'assets' in full_path_relative.lower() and 'images' in full_path_relative.lower():
                missing.add(full_path_relative)
            elif 'assets' in full_path_root.lower() and 'images' in full_path_root.lower():
                missing.add(full_path_root)
            else:
                missing.add(full_path_relative)

with open('missing_all_ascii.txt', 'w', encoding='utf-8') as lg:
    for m in missing:
        # Resolve category
        category = 'default'
        m_lower = m.lower().replace('\\', '/')
        if 'assets/images/' in m_lower:
            parts = m_lower.split('assets/images/')[-1].split('/')
            if parts:
                category = parts[0]
                
        src_img = image_map.get(category)
        if not src_img:
            if 'client' in m_lower or 'user' in m_lower or 'testimonial' in m_lower:
                src_img = image_map['testimonial']
            elif 'team' in m_lower:
                src_img = image_map['team']
            elif 'blog' in m_lower:
                src_img = image_map['blog']
            elif 'shop' in m_lower or 'product' in m_lower:
                src_img = image_map['shop']
            else:
                src_img = image_map['default']

        try:
            os.makedirs(os.path.dirname(m), exist_ok=True)
            shutil.copy(src_img, m)
            lg.write(f"Filled: {m} with {category} template\n")
        except Exception as e:
            lg.write(f"Error copying to {m}: {str(e)}\n")

