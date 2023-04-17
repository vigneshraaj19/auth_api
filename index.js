// external
const bodyParser = require('body-parser');
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ConnectDb = require("./config/db");
const userdata = require("./auth/userdata");

// app init
const app = express();
// middleware

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());


// run db
ConnectDb();

app.use("/api/auth", userdata);

// // root route
app.get("/", (req, res) =>
{ 
  res.send("Apps worked successfully");
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
