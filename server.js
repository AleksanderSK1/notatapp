const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DATA_FIL = "data.json";

function lesData() {
  return JSON.parse(fs.readFileSync(DATA_FIL));
}

function skrivData(data) {
  fs.writeFileSync(DATA_FIL, JSON.stringify(data, null, 2));
}

app.get("/notater", (req, res) => {
    const data = lesData();
    res.json(data.notater);
  });
  
  app.post("/notater", (req, res) => {
    const data = lesData();
    data.notater.push(req.body);
    skrivData(data);
    res.send("lagret");
  });

  app.patch("/notater/:i", (req, res) => {
    const data = lesData();
    const i = +req.params.i;
    if (!data.notater[i]) return res.status(404).send("Notat ikke funnet");
    Object.assign(data.notater[i], req.body);
    skrivData(data);
    res.send("Oppdatert");
  });
  
  app.delete("/notater/:i", (req, res) => {
    const data = lesData();
    const i = +req.params.i;
    if (!data.notater[i]) return res.status(404).send("Notat ikke funnet");
    data.notater.splice(i, 1);
    skrivData(data);
    res.send("Slettet");
  });
  
  app.get("/todolister", (req, res) => {
    const data = lesData();
    res.json(data.todolister);
  });
  
  app.post("/todolister", (req, res) => {
    const data = lesData();
    data.todolister.push(req.body);
    skrivData(data);
    res.send("lagret");
  });

  app.patch("/todolister/:i", (req, res) => {
    const data = lesData();
    const i = +req.params.i;
    if (!data.todolister[i]) return res.status(404).send("Todoliste ikke funnet");
    Object.assign(data.todolister[i], req.body);
    skrivData(data);
    res.send("Oppdatert");
  });
  
  app.delete("/todolister/:i", (req, res) => {
    const data = lesData();
    const i = +req.params.i;
    if (!data.todolister[i]) return res.status(404).send("Todoliste ikke funnet");
    data.todolister.splice(i, 1);
    skrivData(data);
    res.send("Slettet");
  });
  
  app.listen(8000, "0.0.0.0", () => {
    console.log("Server kjører på port 8000");
  });