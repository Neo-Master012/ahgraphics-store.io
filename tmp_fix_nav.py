import glob
import re
import os

html_files = glob.glob('c:/Users/Matrix/Pictures/01-html-file-20260409T130550Z-3-001/01-html-file/*.html')

nav_replacement = '''<div class="main-menu-two__main-menu-box">
                            <a href="#mobile-navigation" class="mobile-nav__toggler" aria-label="Open mobile navigation"><i class="fa fa-bars"></i></a>
                            <ul class="main-menu__list">
                                <li>
                                    <a href="portfolio.html">Portfolio</a>
                                </li>
                            </ul>
                        </div>'''

for fp in html_files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        # Match from <div class="main-menu-two__main-menu-box"> all the way to </div><div class="main-menu-two__right">
        pattern = re.compile(r'<div class="main-menu-two__main-menu-box">.*?</div>\s*<div class="main-menu-two__right">', re.DOTALL)
        
        if pattern.search(content):
            new_content = pattern.sub(nav_replacement + '\n                        <div class="main-menu-two__right">', content)
            if new_content != content:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {os.path.basename(fp)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(fp)}: {e}")
