const mongoose = require("mongoose");

const TvShow = new mongoose.Schema({
  show: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TvShow", TvShow);
