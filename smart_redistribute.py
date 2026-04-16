import os, hashlib, random, shutil

base_path = r'C:\Users\Admin\.gemini\antigravity\brain\9fb7d4ad-8c47-4e23-9445-ef3a55833ba1'

original_placeholders = [
    'testimonial_portrait_1776191750847.png',
    'team_portrait_1776191766036.png',
    'blog_thumbnail_1776191784391.png',
    'portfolio_thumbnail_1776191799532.png',
    'service_image_1776191816065.png',
    'shop_product_1776191832770.png',
    'ui_showcase_1776191847582.png',
    'brand_logo_1776191861910.png'
]

def get_hash(filepath):
    if not os.path.exists(filepath): return None
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

bad_hashes = set()
for p in original_placeholders:
    h = get_hash(os.path.join(base_path, p))
    if h: bad_hashes.add(h)

# Expand library
libraries = {
    'avatar': [
        'avatar_male_tech_1776193774682.png',
        'ceo_handsome_male_1776192782146.png',
        'team_portrait_1776191766036.png',
        'testimonial_portrait_1776191750847.png'
    ],
    'brand': [
        'brand_ai_logo_1776193421887.png',
        'brand_design_logo_1776193451822.png',
        'brand_logo_1776191861910.png',
        'brand_security_logo_1776193483433.png',
        'brand_seo_logo_1776193466525.png',
        'brand_streaming_logo_1776193435769.png'
    ],
    'portfolio': [
        'portfolio_ai_chat_1776193515739.png',
        'portfolio_ai_tools_1776192797502.png',
        'portfolio_iptv_1776193498228.png',
        'portfolio_seo_analytics_1776193546223.png',
        'portfolio_streaming_app_1776193564586.png',
        'portfolio_thumbnail_1776191799532.png',
        'portfolio_video_editor_1776193531339.png'
    ],
    'services': [
        'services_creative_suite_1776193670492.png',
        'services_streaming_access_1776193693165.png',
        'services_vpn_security_1776193718551.png',
        'service_image_1776191816065.png'
    ],
    'showcase': [
        'about_digital_agency_1776193651407.png',
        'showcase_ai_hub_1776193635707.png',
        'showcase_digital_marketplace_1776193586546.png',
        'showcase_seo_dashboard_1776193618131.png',
        'showcase_subscriptions_1776193602076.png',
        'ui_showcase_1776191847582.png'
    ],
    'shop': [
        'shop_chatgpt_card_1776193751825.png',
        'shop_netflix_card_1776193735211.png',
        'shop_product_1776191832770.png'
    ]
}

# Resolve full paths
for key in libraries:
    libraries[key] = [os.path.join(base_path, fname) for fname in libraries[key] if os.path.exists(os.path.join(base_path, fname))]

# We want random, but seeded so it's consistent if we re-run
random.seed(42)

def get_category(path):
    p = path.lower().replace('\\', '/')
    if any(x in p for x in ['user', 'client', 'team', 'testimonial', 'comment', 'review', 'avatar']): return 'avatar'
    if any(x in p for x in ['brand', 'partner', 'logo']): return 'brand'
    if any(x in p for x in ['portfolio', 'project']): return 'portfolio'
    if any(x in p for x in ['service', 'feature']): return 'services'
    if any(x in p for x in ['shop', 'cart', 'wishlist', 'product']): return 'shop'
    return 'showcase'

count = 0
for root, dirs, files in os.walk('assets'):
    for file in files:
        if file.endswith(('.png', '.jpg', '.jpeg', '.gif')):
            filepath = os.path.join(root, file)
            h = get_hash(filepath)
            
            # Skip if it's the CEO image because we explicitly replaced it recently
            if 'team-1-1' in file:
                continue
                
            if h in bad_hashes:
                cat = get_category(filepath)
                replacement = random.choice(libraries[cat])
                shutil.copy(replacement, filepath)
                print(f"Redistributed [{cat}]: {filepath}")
                count += 1
                
print(f"Total redistributed instances: {count}")
