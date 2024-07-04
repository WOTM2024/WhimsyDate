const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  username: {
    type: String,
    ref: "Users",
  },
  user_activities: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Activities",
  },
  user_food_choices: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Food_choices",
  },
  user_films: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Movie",
  },
  user_tv_shows: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Tv_shows",
  },
});

module.exports = mongoose.model("Users", Users);
