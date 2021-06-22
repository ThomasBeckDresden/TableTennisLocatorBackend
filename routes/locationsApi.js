const { Pool } = require("pg");
const express = require("express");

const app = express();
const pool = new Pool();

app.get("/", (req, res) =>{
    pool
    .query("SELECT * FROM locations")
    .then(data => res.status(200).send(data.rows))
    .catch(err => res.sendStatus(500))
  })

module.exports = app;