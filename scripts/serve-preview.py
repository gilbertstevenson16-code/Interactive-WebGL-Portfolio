"""Serve the exported site with correct directory routes and WASM MIME types."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=3151)
parser.add_argument('--directory', default=str(Path(__file__).resolve().parent))
args = parser.parse_args()
SimpleHTTPRequestHandler.extensions_map.update({'.wasm': 'application/wasm', '.ktx2': 'image/ktx2', '.woff2': 'font/woff2'})
print(f'Preview: http://127.0.0.1:{args.port}', flush=True)
ThreadingHTTPServer(('127.0.0.1', args.port), partial(SimpleHTTPRequestHandler, directory=args.directory)).serve_forever()
