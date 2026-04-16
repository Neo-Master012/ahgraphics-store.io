import glob
import re

files = glob.glob('c:/Users/Matrix/Pictures/01-html-file-20260409T130550Z-3-001/01-html-file/*.html')

replacements = [
    (r'123 Main Street, Apt 4BNew \s*<br>\s* York, NY 10001USA', r'Lahore, Pakistan'),
    (r'Lorem Ipsum is simply dummy text of the', r'We provide premium tools and services to scale your'),
    (r'introduction of Letraset sheets featuring Lorem Ipsum passages, and it has continued', r'expert knowledge and proven digital resources, ensuring consistent quality and performance'),
    (r'which includes different versions of Lorem Ipsum.', r'tailored to fit modern creative workflows and agencies.'),
    (r'Florida, New York', r'Lahore, Pakistan'),
    (r'typesetting unchanged\. It was popularised in the sheets containing lorem ipsum', r'providing reliable tool access for creators worldwide'),
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
