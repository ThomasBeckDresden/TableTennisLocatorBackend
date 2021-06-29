const express = require("express");
const format = require("pg-format");
const db = require("../db/client");
const checkEntryExists = require("../utils/checkEntryExists");
const app = express();

app.get("/posts", (req, res) => {
  db.query("SELECT * FROM locations")
    .then((data) => res.status(200).send(data.rows))
    .catch((err) => res.sendStatus(500));
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const getOneLocation = {
    text: `
    SELECT * FROM locations WHERE id=$1;"
    `,
    values: [id],
  };
  db.query(getOneLocation)
    .then((data) => res.send(data.rows))
    .catch((err) => res.sendStatus(500));
});

// POST for GET search results -> data can only be sent with axios POST
app.post("/search", (req, res) => {
  const {
    data: { column, query },
  } = req.body;
  console.log(column, query);

  // var format = require('pg-format');
  // var sql = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10')
  //const { query } = req.body; http://www.google.com/hi/there ? qs1=you & qs2=tube
  const getSearchResults = format(
    "SELECT * FROM locations WHERE %I LIKE '%%%s%%'",
    column,
    query
  );

  db.query(getSearchResults)
    .then((data) => res.send(data.rows))
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
}); // e.g /search/city?=berlin

// POST
app.post("/", (req, res) => {
  const {
    tags,
    title,
    adress,
    longitude,
    latitude,
    condition,
    popularity,
    picturesDescription,
    picturesUrl,
    description,
    supplies,
  } = req.body;

  const postNewLocation = {
    text: `INSERT INTO locations (createdAt,updatedAt,tags,title,adress,longitude,latitude,condition,popularity,picturesDescription,picturesUrl,description,supplies)
      VALUES (
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11
      )
      RETURNING *`,
    values: [
      tags,
      title,
      adress,
      longitude,
      latitude,
      condition,
      popularity,
      picturesDescription,
      picturesUrl,
      description,
      supplies,
    ],
  };

  db.query(postNewLocation)
    .then((data) => res.send(data.rows))
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});

// PUT
app.put("/:id", checkEntryExists, (req, res) => {
  const existingEntry = req.entry;
  const requestedChange = req.body;

  let updatedEntry = {};

  for (prop in existingEntry) {
    updatedEntry[prop] = requestedChange[prop] || existingEntry[prop];
  }

  console.log(updatedEntry);

  //   UPDATE t
  // SET c1 = new_value,
  // c2 = new_value
  // WHEREcondition;
  // Update values in the column

  const updateLocation = {
    text: `UPDATE locations 
    SET tags=$1,
    title=$2,
    adress=$3,
    longitude=$4,
    latitude=$5,
    condition=$6,
    popularity=$7,
    picturesDescription=$8,
    picturesUrl=$9,
    description=$10,
    supplies=$11
    WHERE id = $12
    RETURNING *`,
    values: [
      updatedEntry.tags,
      updatedEntry.title,
      updatedEntry.adress,
      updatedEntry.longitude,
      updatedEntry.latitude,
      updatedEntry.condition,
      updatedEntry.popularity,
      updatedEntry.picturesDescription,
      updatedEntry.picturesUrl,
      updatedEntry.description,
      updatedEntry.supplies,
      updatedEntry.id,
    ],
  };

  db.query(updateLocation)
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.send("There was a database error");
      console.log(e);
    });
});

module.exports = app;

// INSERT INTO locations (createdAt,updatedAt,tags,title,adress,longitude,latitude,condition,popularity,picturesDescription,picturesUrl,description,supplies)
//  VALUES (
// "2021-06-16T08:36:33.285Z",
// "2021-06-16T08:38:48.776Z",
// "null",
// "Leopoldplatz",
// "U-Bhf Leopoldplatz,
// hinter der Kirche, neben dem Fußballfeld Leopoldplatz, 13347 Berlin, Deutschland",
// "13.35988",
// "52.54751",
// "in perfect condition for a nice match with friends",
// "it gets more popular each summer ",
// "null",
// "//images.ctfassets.net/tt8h7hqmyhxy/1xitquZKKe0OScNiyX2fzr/a23230e375d82b007052c6cd9111fb9c/Sprengelkiez-Project-Strasse-770x514.jpg",
// "In the middle of \"Leo\" (the beloved Leopoldplatz) – and yet very green. Both tables are close to the soccerfield. And you can find a third table a bit further at the back. Close by: Café Motte for a short energy kick or Lino’s Barbecue for after the match.",
// "Pommes"
// );
