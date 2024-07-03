const mongoose = require("mongoose");
const Counter = require("./counter-schema");

const Movie = new mongoose.Schema({
  movie_id: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Movie", Movie);
