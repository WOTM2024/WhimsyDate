const mongoose = require("mongoose");

const TvShow = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("TvShow", TvShow);
