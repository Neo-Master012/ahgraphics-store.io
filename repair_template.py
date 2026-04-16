import glob
import re

files = glob.glob('c:/Users/Matrix/Pictures/01-html-file-20260409T130550Z-3-001/01-html-file/*.html')

replacements = [
    # Contact & Footer Phones
    (r'<a href=\"tel:120034558900\">\+12 \(00\) 345 58900</a>', r'<a href="tel:+923268600994">+92 326 8600 994</a>'),
    (r'<a href=\"tel:001234568900\">\+00 \(123\) 456 8900</a>', r'<a href="tel:+923268600994">+92 326 8600 994</a>'),

    # Footer Links
    (r'<li><a href=\"pricing.html\">Pricing</a></li>', r'<li><a href="portfolio.html">Portfolio</a></li>'),
    (r'<li><a href=\"about.html\">Teams & Condition</a></li>', r'<li><a href="about.html">Terms & Conditions</a></li>'),
    (r'<li><a href=\"404.html\">404 Page</a></li>', r'<li><a href="faq.html">Help Center</a></li>'),
    (r'<li><a href=\"digital-marketing.html\">Products Design</a></li>', r'<li><a href="products.html?category=ai-tools">AI Tools</a></li>'),
    (r'<li><a href=\"web-design-development.html\">Web Application</a></li>', r'<li><a href="products.html?category=seo-subscription">SEO Subscriptions</a></li>'),
    (r'<li><a href=\"digital-marketing.html\">Digital Marketing</a></li>', r'<li><a href="products.html?category=editing-subscription">Editing Tools</a></li>'),
    (r'<li><a href=\"app-development.html\">UI/UX Design</a></li>', r'<li><a href="products.html?category=creative-apps">Creative Apps</a></li>'),
    (r'<li><a href=\"search-engine-optimization.html\">More Services</a></li>', r'<li><a href="products.html">All Services</a></li>'),

    (r'Teams &amp; Condition', r'Terms & Conditions'),
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    new_content = content
    for old, new in replacements:
        new_content = re.sub(old, new, new_content, flags=re.IGNORECASE)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated {f}")
