from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
import json
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://192.168.20.79:8000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "notatapp-api"

def sjekk_api_key(x_api_key: str = Header()):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Ugyldig API-nøkkel")

aktive_tokens = {}

DATA_FIL = "data.json"

def les_data():
    with open(DATA_FIL, "r") as f:
        return json.load(f)

def skriv_data(data):
    with open(DATA_FIL, "w") as f:
        json.dump(data, f, indent=2)

def hent_bruker(x_token: str = Header()):
    bruker = aktive_tokens.get(x_token)
    if not bruker:
        raise HTTPException(status_code=401, detail="Ikke logget inn")
    return bruker

class Notat(BaseModel):
    tittel: str
    innhold: str

class TodoListe(BaseModel):
    tittel: str
    oppgaver: list

@app.get("/", response_class=HTMLResponse)
def hent_index():
    return FileResponse("index.html")

@app.get("/script.js")
def hent_script():
    return FileResponse("script.js")

@app.get("/style.css")
def hent_style():
    return FileResponse("style.css")

@app.post("/login")
def login(data: dict):
    d = les_data()
    for bruker in d["brukere"]:
        if bruker["brukernavn"] == data.get("brukernavn") and bruker["passord"] == data.get("passord"):
            token = str(uuid.uuid4())
            aktive_tokens[token] = bruker["brukernavn"]
            return {"token": token}
    raise HTTPException(status_code=401, detail="Feil brukernavn/passord")

@app.post("/registrer")
def registrer(data: dict):
    d = les_data()

    for bruker in d["brukere"]:
        if bruker["brukernavn"] == data.get("brukernavn"):
            raise HTTPException(status_code=400, detail="Bruker finnes")

    d["brukere"].append({
        "brukernavn": data.get("brukernavn"),
        "passord": data.get("passord")
    })

    skriv_data(d)
    return {"status": "opprettet"}

@app.get("/notater")
def hent_notater(api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    return [n for n in d["notater"] if n.get("eier") == bruker]

@app.post("/notater")
def nytt_notat(data: Notat, api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    d["notater"].append({
        "tittel": data.tittel,
        "innhold": data.innhold,
        "eier": bruker
    })
    skriv_data(d)
    return {"status": "lagret"}

@app.delete("/notater/{i}")
def slett_notat(i: int, api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    notater = [n for n in d["notater"] if n.get("eier") == bruker]

    if i >= len(notater):
        raise HTTPException(status_code=404)

    to_delete = notater[i]
    d["notater"].remove(to_delete)

    skriv_data(d)
    return {"status": "slettet"}

@app.patch("/notater/{i}")
def endre_notat(i: int, data: Notat, api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    notater = [n for n in d["notater"] if n.get("eier") == bruker]

    if i >= len(notater):
        raise HTTPException(status_code=404)

    original = notater[i]
    for n in d["notater"]:
        if n == original:
            n["tittel"] = data.tittel
            n["innhold"] = data.innhold

    skriv_data(d)
    return {"status": "oppdatert"}

@app.get("/todolister")
def hent_todolister(api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    return [t for t in d["todolister"] if t.get("eier") == bruker]

@app.post("/todolister")
def ny_todoliste(data: TodoListe, api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    d["todolister"].append({
        "tittel": data.tittel,
        "oppgaver": data.oppgaver,
        "eier": bruker
    })
    skriv_data(d)
    return {"status": "lagret"}

@app.delete("/todolister/{i}")
def slett_todoliste(i: int, api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    lister = [t for t in d["todolister"] if t.get("eier") == bruker]

    if i >= len(lister):
        raise HTTPException(status_code=404)

    to_delete = lister[i]
    d["todolister"].remove(to_delete)

    skriv_data(d)
    return {"status": "slettet"}

@app.patch("/todolister/{i}")
def endre_todoliste(i: int, data: dict, api_key: str = Depends(sjekk_api_key), bruker: str = Depends(hent_bruker)):
    d = les_data()
    lister = [t for t in d["todolister"] if t.get("eier") == bruker]

    if i >= len(lister):
        raise HTTPException(status_code=404)

    original = lister[i]
    for t in d["todolister"]:
        if t == original:
            t.update(data)

    skriv_data(d)
    return {"status": "oppdatert"}