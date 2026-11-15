import re
import threading
from collections import Counter

from fastapi import HTTPException, Request
from pydantic import BaseModel

try:
    from babel import Locale

    _NAMES = Locale("en").territories
except Exception:
    _NAMES = {}

_ID = re.compile(r"^[A-Za-z0-9_.+-]{1,80}$")
_LOCK = threading.Lock()
_BY_COUNTRY = Counter()


class FlagIn(BaseModel):
    target_id: str


def country_of(request: Request) -> str:
    # The hosting platform adds the visitor's country as a two-letter code.
    # We keep only the country name; the IP address is never stored.
    for header in ("cf-ipcountry", "x-vercel-ip-country"):
        code = (request.headers.get(header) or "").strip().upper()
        if len(code) == 2 and code.isalpha() and code not in ("XX", "T1"):
            return _NAMES.get(code, code)
    return "Unknown"


def register_flags(app):
    @app.post("/flags")
    def submit_flag(body: FlagIn, request: Request):
        if not _ID.match(body.target_id):
            raise HTTPException(422, "Invalid target_id.")
        country = country_of(request)
        with _LOCK:
            _BY_COUNTRY[country] += 1
        return {"ok": True}

    @app.get("/flags/summary")
    def flags_summary():
        with _LOCK:
            return [{"country": c, "count": n} for c, n in _BY_COUNTRY.most_common()]
