const mongoose = require("mongoose");

const Users = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  user_films: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Movie"
  },
  user_activities: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Activity"
  },
  user_food_choices: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Food"
  },
  user_tv_shows: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "TVShow"
  }
});

module.exports = mongoose.model("Users", Users);