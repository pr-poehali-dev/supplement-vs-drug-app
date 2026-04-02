import os
import json
import psycopg
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

DB_URL = os.environ.get("DATABASE_URL", "")

def get_products(product_id=None):
    with psycopg.connect(DB_URL) as conn:
        with conn.cursor() as cur:
            if product_id:
                cur.execute(
                    "SELECT id, name, type, short_description, composition, hint, image_url, category FROM t_p51459210_supplement_vs_drug_a.quiz_products WHERE id = %s",
                    (product_id,)
                )
                row = cur.fetchone()
                if not row:
                    return None
                cols = [desc[0] for desc in cur.description]
                return dict(zip(cols, row))
            else:
                cur.execute(
                    "SELECT id, name, type, short_description, composition, hint, image_url, category FROM t_p51459210_supplement_vs_drug_a.quiz_products ORDER BY id"
                )
                rows = cur.fetchall()
                cols = [desc[0] for desc in cur.description]
                return [dict(zip(cols, row)) for row in rows]

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)
        product_id = params.get("id", [None])[0]

        try:
            if product_id:
                product = get_products(int(product_id))
                if product is None:
                    self.send_response(404)
                    self._send_cors_headers()
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Not found"}).encode())
                    return
                body = json.dumps(product)
            else:
                products = get_products()
                body = json.dumps({"products": products})

            self.send_response(200)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(body.encode())
        except Exception as e:
            print(f"Error: {e}")
            self.send_response(500)
            self._send_cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, format, *args):
        pass
