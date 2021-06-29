require("dotenv").config();
const express = require("express");
const cors = require("cors");
const locationsApi = require("./routes/locationsApi");
const morgan = require("morgan");

const app = express();
app.use(morgan("tiny"));
app.use(express.json());
app.use(cors());
app.use("/api/locations", locationsApi);

const port = process.env.port || 3001;

app.listen(port, () => {
  console.log("listening");
});

app.get("/", (req, res) => {
  res.send("Welcome to PingPong API");
});
