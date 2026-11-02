"""Local voice-take picker: listen to every Gooya take per sentence, choose one, rebuild the scene VO.

  python tools/vo_picker.py            # http://127.0.0.1:8765
Choices are written to work/vo_v2/picks.json as "override" and used by `vo_pipeline.py assemble`.
"""
import json, os, sys, threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import unquote, urlparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import vo_pipeline as vp

PICKS = os.path.join(vp.WORK, "picks.json")
SCENE_VO = os.path.join(vp.PROJ, "video", "assets", "vo_norm", "v2")
PAGE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "vo_picker.html")
lock = threading.Lock()


class H(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def send(self, code, body, ctype="application/json"):
        data = body if isinstance(body, bytes) else body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def file(self, path, ctype):
        if not os.path.isfile(path):
            return self.send(404, "{}")
        self.send(200, open(path, "rb").read(), ctype)

    def do_GET(self):
        p = unquote(urlparse(self.path).path)
        if p == "/":
            return self.file(PAGE, "text/html; charset=utf-8")
        if p == "/data":
            picks = json.load(open(PICKS, encoding="utf-8"))
            order = [(s["id"], len(vp.sentences(s["fa"]))) for s in vp.SCRIPT]
            return self.send(200, json.dumps({"picks": picks, "order": order}, ensure_ascii=False))
        if p.startswith("/take/"):
            return self.file(os.path.join(vp.WORK, "takes", os.path.basename(p)), "audio/flac")
        if p.startswith("/scene/"):
            return self.file(os.path.join(SCENE_VO, os.path.basename(p)), "audio/wav")
        self.send(404, "{}")

    def do_POST(self):
        p = urlparse(self.path).path
        body = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
        with lock:
            if p == "/choose":
                picks = json.load(open(PICKS, encoding="utf-8"))
                picks[body["key"]]["override"] = body["file"]
                json.dump(picks, open(PICKS, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
                return self.send(200, '{"ok":true}')
            if p == "/assemble":
                vp.stage_assemble()
                return self.send(200, '{"ok":true}')
        self.send(404, "{}")


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"VO picker on http://127.0.0.1:{port}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
