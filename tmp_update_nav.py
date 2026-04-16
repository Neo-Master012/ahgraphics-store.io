import glob
import re
import os

html_files = glob.glob('c:/Users/Matrix/Pictures/01-html-file-20260409T130550Z-3-001/01-html-file/*.html')

# Just use "Portfolio" as the only link per the request
nav_replacement = '''<ul class="main-menu__list">
                                <li>
                                    <a href="portfolio.html">Portfolio</a>
                                </li>
                            </ul>'''

for fp in html_files:
    try:
        with open(fp, 'r', encoding='utf-8') as f:
            content = f.read()

        # Regular expression to match the entire main-menu__list block
        pattern = re.compile(r'<ul\s+class="main-menu__list">.*?</ul>', re.DOTALL)
        
        if pattern.search(content):
            new_content = pattern.sub(nav_replacement, content)
            if new_content != content:
                with open(fp, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {os.path.basename(fp)}")
    except Exception as e:
        print(f"Error processing {os.path.basename(fp)}: {e}")
