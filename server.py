from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
 
app = FastAPI()
 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
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
 
 
@app.get("/notater")
def hent_notater():
    return les_data()["notater"]
 
@app.post("/notater")
def nytt_notat(data: Notat):
    d = les_data()
    d["notater"].append({"tittel": data.tittel, "innhold": data.innhold})
    skriv_data(d)
    return "lagret"
 
@app.patch("/notater/{i}")
def endre_notat(i: int, data: Notat):
    d = les_data()
    if i >= len(d["notater"]):
        raise HTTPException(status_code=404, detail="Notat ikke funnet")
    d["notater"][i].update({"tittel": data.tittel, "innhold": data.innhold})
    skriv_data(d)
    return "oppdatert"
 
@app.delete("/notater/{i}")
def slett_notat(i: int):
    d = les_data()
    if i >= len(d["notater"]):
        raise HTTPException(status_code=404, detail="Notat ikke funnet")
    d["notater"].pop(i)
    skriv_data(d)
    return "slettet"
 
 
@app.get("/todolister")
def hent_todolister():
    return les_data()["todolister"]
 
@app.post("/todolister")
def ny_todoliste(data: TodoListe):
    d = les_data()
    d["todolister"].append({"tittel": data.tittel, "oppgaver": data.oppgaver})
    skriv_data(d)
    return "lagret"
 
@app.patch("/todolister/{i}")
def endre_todoliste(i: int, data: dict):
    d = les_data()
    if i >= len(d["todolister"]):
        raise HTTPException(status_code=404, detail="Todoliste ikke funnet")
    d["todolister"][i].update(data)
    skriv_data(d)
    return "oppdatert"
 
@app.delete("/todolister/{i}")
def slett_todoliste(i: int):
    d = les_data()
    if i >= len(d["todolister"]):
        raise HTTPException(status_code=404, detail="Todoliste ikke funnet")
    d["todolister"].pop(i)
    skriv_data(d)
    return "slettet"