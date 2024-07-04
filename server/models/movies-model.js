const mongoose = require("mongoose");

const Movie = new mongoose.Schema({
  movie_id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Movie", Movie);
