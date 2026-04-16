import os

target = '''                                <li>
                                    <a href="about.html">About</a>
                                </li>'''

replacement = '''                                <li>
                                    <a href="about.html">About</a>
                                </li>
                                <li>
                                    <a href="packages.html">Packages</a>
                                </li>'''

html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'index.html'] # index.html already updated!

for f in html_files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            if target in content and replacement not in content:
                content = content.replace(target, replacement)
                with open(f, 'w', encoding='utf-8') as outfile:
                    outfile.write(content)
                print(f"Updated {f}")
    except Exception as e:
        print(f"Error {f}: {e}")

# now append to css
css_file = 'assets/css/module-css/slider.css'
css_payload = '''

.main-slider__img-box--secondary {
    z-index: 10;
    display: flex;
    align-items: flex-end;
}
.main-slider__img-box--secondary img {
    max-height: calc(100vh - 120px) !important;
    padding-top: 80px;
}
'''
with open(css_file, 'a', encoding='utf-8') as f:
    f.write(css_payload)
print("CSS updated")
