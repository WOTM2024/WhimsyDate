const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  user_films: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Movie"
  }
});

module.exports = mongoose.model("Users", Users);