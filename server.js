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
  
  app.listen(8000, "0.0.0.0", () => {
    console.log("Server kjører på port 8000");
  });