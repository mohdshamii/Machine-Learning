# scripts/audit_and_fix_css.py
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'
CSS_FILE = SRC / 'styles' / 'index.css'

def extract_classes():
    classes = set()
    for p in SRC.rglob('*.tsx'):
        text = p.read_text(encoding='utf-8')
        # match string literals in className or template literals
        matches = re.findall(r'className\s*=\s*(?:["\']([^"\']+)["\']|{`([^`]+)`}|{([^}]+)})', text)
        for m in matches:
            for group in m:
                if not group:
                    continue
                # split tokens
                tokens = re.findall(r'[a-zA-Z0-9_\-\.\/:\#\[\]]+', group)
                for t in tokens:
                    if (t.startswith(('dark:', 'sm:', 'md:', 'lg:', 'xl:', 'hover:', 'focus:', 'group-hover:')) or
                        any(t.startswith(prefix) for prefix in ['text-', 'bg-', 'p-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-', 'm-', 'mx-', 'my-', 'mt-', 'mb-', 'ml-', 'mr-', 'w-', 'h-', 'min-', 'max-', 'border', 'rounded', 'flex', 'grid', 'gap-', 'space-', 'shadow', 'font-', 'overflow-', 'cursor-', 'transition-', 'duration-', 'ease-', 'z-', 'top-', 'bottom-', 'left-', 'right-', 'inset-', 'translate-', '-translate-', 'backdrop-', 'select-', 'tracking-', 'leading-', 'truncate', 'hidden', 'block', 'inline', 'sticky', 'fixed', 'absolute', 'relative'])):
                        classes.add(t)
    return classes

if __name__ == '__main__':
    all_classes = extract_classes()
    print(f'Total extracted class tokens: {len(all_classes)}')
    for c in sorted(all_classes):
        print(c)
