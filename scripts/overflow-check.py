# Usage: python3 scripts/overflow-check.py /learn/ /mentorship/ ...  (needs `npx astro preview --port 4329` running)
import sys
from playwright.sync_api import sync_playwright
bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(); m = b.new_page(viewport={'width': 390, 'height': 844})
    for path in sys.argv[1:]:
        m.goto('http://localhost:4329' + path); m.wait_for_timeout(300)
        w = m.evaluate('document.documentElement.scrollWidth')
        print(path, 'OK' if w <= 390 else f'OVERFLOW {w}px'); bad += w > 390
        m.screenshot(path='/tmp/claude-0/ov' + path.strip('/').replace('/', '_') + '.png', full_page=False)
    b.close()
sys.exit(1 if bad else 0)
