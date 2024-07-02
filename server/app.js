const express = require("express");
const movies = require("./routes/films");
const users = require("./routes/users");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/movies", movies);
app.use("/users", users);


mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connection to DB established");
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

app.listen(9091, () => {
  console.log("Server running on port 9091...");
});
