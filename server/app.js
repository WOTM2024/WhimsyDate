const express = require("express");
const apiRoutes = require("./routes/api");

require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", apiRoutes);

app.use((req, res, next) => {
  res.status(404).json({ msg: "Invalid endpoint, please try again" });
  next();
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: "Internal server error", error: err.message });
});

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("Connection to DB established");
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

module.exports = app;
