from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, FileResponse
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "notatapp-api"
aktive_tokens = {}

def sjekk_api_key(x_api_key: str = Header()):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Ugyldig API-nøkkel")

def sjekk_login(x_token: str = Header()):
    if x_token not in aktive_tokens:
        raise HTTPException(status_code=401, detail="Ikke logget inn")

DATA_FIL = "data.json"

def les_data():
    with open(DATA_FIL, "r") as f:
        return json.load(f)

def skriv_data(data):
    with open(DATA_FIL, "w") as f:
        json.dump(data, f, indent=2)

class Notat(BaseModel):
    tittel: str
    innhold: str

class TodoListe(BaseModel):
    tittel: str
    oppgaver: list

@app.post("/login")
def login(data: dict):
    d = les_data()
    for bruker in d["brukere"]:
        if bruker["brukernavn"] == data.get("brukernavn") and bruker["passord"] == data.get("passord"):
            token = "logget-inn"
            aktive_tokens[token] = bruker["brukernavn"]
            return {"token": token}
    raise HTTPException(status_code=401, detail="Feil brukernavn/passord")

@app.get("/")
def hent_index():
    return FileResponse("index.html", media_type="text/html")

@app.get("/script.js")
def hent_script():
    return FileResponse("script.js", media_type="application/javascript")

@app.get("/style.css")
def hent_style():
    return FileResponse("style.css", media_type="text/css")

@app.get("/notater")
def hent_notater(api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    return les_data()["notater"]

@app.post("/notater")
def nytt_notat(data: Notat, api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    d = les_data()
    d["notater"].append({"tittel": data.tittel, "innhold": data.innhold})
    skriv_data(d)
    return {"status": "lagret"}

@app.patch("/notater/{i}")
def endre_notat(i: int, data: Notat, api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    d = les_data()
    if i >= len(d["notater"]):
        raise HTTPException(status_code=404, detail="Notat ikke funnet")
    d["notater"][i].update({"tittel": data.tittel, "innhold": data.innhold})
    skriv_data(d)
    return {"status": "oppdatert"}

@app.delete("/notater/{i}")
def slett_notat(i: int, api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    d = les_data()
    if i >= len(d["notater"]):
        raise HTTPException(status_code=404, detail="Notat ikke funnet")
    d["notater"].pop(i)
    skriv_data(d)
    return {"status": "slettet"}

@app.get("/todolister")
def hent_todolister(api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    return les_data()["todolister"]

@app.post("/todolister")
def ny_todoliste(data: TodoListe, api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    d = les_data()
    d["todolister"].append({"tittel": data.tittel, "oppgaver": data.oppgaver})
    skriv_data(d)
    return {"status": "lagret"}

@app.patch("/todolister/{i}")
def endre_todoliste(i: int, data: dict, api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    d = les_data()
    if i >= len(d["todolister"]):
        raise HTTPException(status_code=404, detail="Todoliste ikke funnet")
    d["todolister"][i].update(data)
    skriv_data(d)
    return {"status": "oppdatert"}

@app.delete("/todolister/{i}")
def slett_todoliste(i: int, api_key: str = Depends(sjekk_api_key), token: str = Depends(sjekk_login)):
    d = les_data()
    if i >= len(d["todolister"]):
        raise HTTPException(status_code=404, detail="Todoliste ikke funnet")
    d["todolister"].pop(i)
    skriv_data(d)
    return {"status": "slettet"}