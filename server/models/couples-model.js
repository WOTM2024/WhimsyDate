const mongoose = require("mongoose");

const Couples = new mongoose.Schema({
  user_one: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  user_two: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  couple_activities: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Activities",
  },
  couple_food_choices: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Food",
  },
  couple_films: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Movie",
  },
  couple_tv_shows: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "TvShows",
  },
});

module.exports = mongoose.model("Couples", Couples);
