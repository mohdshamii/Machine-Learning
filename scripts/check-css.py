import re, glob

classes = set()
for path in glob.glob('src/**/*.tsx', recursive=True):
    content = open(path, encoding='utf-8').read()
    for m in re.finditer(r'className=["\']([^"\']+)["\']', content):
        for c in m.group(1).split():
            classes.add(c)

css_content = open('src/styles/index.css', encoding='utf-8').read()
missing = []
for c in sorted(classes):
    pattern = re.escape(c)
    if not re.search(r'\.' + pattern + r'(?:[^\w\-]|$)', css_content):
        missing.append(c)

print(f"Total missing: {len(missing)}")
for item in missing:
    print(item)
