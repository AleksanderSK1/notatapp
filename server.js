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
