const Food = require("../models/foods-model");

const getFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        res.status(200).json({ success: true, data: foods });
    } catch (error) {
        res.status(409).json({ success: false, data: [], error: error.message });
    }
};

const postFoods = async (req, res) => {
    try {
        if (!Array.isArray(req.body)) {
            return res.status(400).json({ success: false, message: "Input should be an array" });
        }
        const [ foods ] = req.body;

        if (!foods.food) {
            return res.status(400).json({ success: false, message: "Don't forget to add the name of the food!" });
        }

        await Food.updateOne(
            { food: foods.food },
            {
                $set: {
                    vegetarian: foods.vegetarian,
                    vegan: foods.vegan,
                    meat: foods.meat,
                    allergies: foods.allergies
                }
            },
            { upsert: true }
        );

        res.status(201).json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(409).json({ success: false, data: [], error: error.message });
    }
};

module.exports = { getFoods, postFoods };
