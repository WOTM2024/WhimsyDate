const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    food: {
        type: String,
        required: true,
    },
    vegetarian: {
        type: Boolean,
        required: false,
    },
    vegan: {
        type: Boolean,
        required: false,
    },
    meat: {
        type: Boolean,
        required: false,
    },
    allergies: {
        type: Boolean,
        required: false,
    }
})

module.exports = mongoose.model("Food", FoodSchema)