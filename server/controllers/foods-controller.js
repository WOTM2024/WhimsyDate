const Food = require("../models/foods-model");

const getFoods = async (req, res) =>{
    try {
        const foods = await Food.find();
        console.log(foods)
        res.status(200).json({ success: true, data: foods });
    } catch (error){
        res.status(409).json({ success: false, data: [], error: error });
    }
};

const postFoods = async (req, res) => {
    try {
        const { food, vegetarian, vegan, meat, allergies } = req.body;

        const newFood = new Food({
            food,
            vegetarian,
            vegan,
            meat,
            allergies,
        })

        const savedFood = await newFood.save();
        res.status(201).json({ success: true, data: savedFood });
    } catch  (error) {
        res.status(409).json({ success: false, data: [], error: error });
    }
}

module.exports = { getFoods, postFoods }
