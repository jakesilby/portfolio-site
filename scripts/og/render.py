"""Re-render the og cards in /images/og/ from case.html and site.html.

Serves the repo root on a local port so the templates load the real
tokens.css and fonts, screenshots them in headless Chrome at 1200x630
(DSF 1), and writes the PNGs. Case study cards only re-render the left
700px text panel; the poster panel on the right (the hairline at x=700
and everything after it) is copied from the existing PNG, so it never
changes. See README.md.
"""
import functools
import http.server
import pathlib
import subprocess
import tempfile
import threading
import urllib.parse

from PIL import Image

CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
ROOT = pathlib.Path(__file__).resolve().parents[2]
OG = ROOT / 'images' / 'og'

# Card file name -> (H1 with its line break, work grid outcome line).
# Keep both in step with the case study H1s and components/work-grid.js.
CASES = {
    'onepulse-connect': ('OnePulse Connect<br>design system',
        'The token and component system every OnePulse Connect screen was designed from.'),
    'linking-documents-prescriptions': ('Linking documents<br>&amp; prescriptions',
        'A linking interaction for pharmacy staff, redesigned after the first version failed testing.'),
    'pre-infusion-assessment-flow': ('Pre-infusion<br>assessment flow',
        'A framework for clinical assessments, tested against a 43-question form with hard safety stops.'),
    'carbon-token-audit': ('Auditing Carbon<br>for token drift',
        'How much hardcoded spacing shows up in a mature, production design system.'),
}


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve():
    handler = functools.partial(QuietHandler, directory=str(ROOT))
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def shot(url, size, path):
    subprocess.run([CHROME, '--headless=new', '--hide-scrollbars',
                    '--force-device-scale-factor=1', '--virtual-time-budget=3000',
                    f'--window-size={size}', f'--screenshot={path}', url],
                   check=True, capture_output=True)


def main():
    server = serve()
    base = f'http://127.0.0.1:{server.server_port}/scripts/og'
    with tempfile.TemporaryDirectory() as tmp:
        for name, (title, desc) in CASES.items():
            left = pathlib.Path(tmp) / f'{name}.png'
            query = urllib.parse.urlencode({'t': title, 'd': desc})
            shot(f'{base}/case.html?{query}', '700,630', left)
            card = Image.open(OG / f'{name}.png').convert('RGB')
            card.paste(Image.open(left).convert('RGB').crop((0, 0, 700, 630)), (0, 0))
            card.save(OG / f'{name}.png', optimize=True)
            print('wrote', name)
    shot(f'{base}/site.html', '1200,630', OG / 'site.png')
    print('wrote site')
    server.shutdown()


if __name__ == '__main__':
    main()
