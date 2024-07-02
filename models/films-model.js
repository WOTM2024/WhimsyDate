const mongoose = require("mongoose");

const Media = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

const Movie = new mongoose.Schema({
  movie: {
    type: [Media],
    required: true,
  },
});

module.exports = mongoose.model("Movie", Movie);
