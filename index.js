require('dotenv').config();
const express = require('express');
const locationsApi=require("./routes/locationsApi")

const app = express();
app.use(express.json())
app.use("/api/locations",locationsApi)

const port = process.env.port || 3001;

app.listen(port, () => {
  console.log('listening')
})

app.get("/", (req,res) => {
    res.send("Welcome to PingPong API")
})

