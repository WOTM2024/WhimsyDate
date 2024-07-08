const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
  },
  vegetarian: {
    type: Boolean,
    required: true,
  },
  vegan: {
    type: Boolean,
    required: true,
  },
  meat: {
    type: Boolean,
    required: true,
  },
  allergies: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Food", FoodSchema);
