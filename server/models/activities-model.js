const mongoose = require("mongoose");

const Activities = new mongoose.Schema({
  activity_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  isCollaborative: {
    type: Boolean,
    required: true
  },
  cost: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model("Activities", Activities);