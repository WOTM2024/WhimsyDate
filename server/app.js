const express = require("express");
const movies = require("./routes/films");
const foods = require("./routes/foods")
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/movies", movies);

app.use("/foods", foods)

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connection to DB established");
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

app.listen(9092, () => {
  console.log("Server running on port 9092...");
});
