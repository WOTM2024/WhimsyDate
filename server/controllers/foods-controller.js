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
    const { food, vegetarian, vegan, meat, allergies } = req.body;

    if (
      !food ||
      typeof vegetarian !== "boolean" ||
      typeof vegan !== "boolean" ||
      typeof meat !== "boolean" ||
      typeof allergies !== "boolean"
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingFoodOption = await Food.findOne({
      food: food,
      vegetarian: vegetarian,
      vegan: vegan,
      meat: meat,
      allergies: allergies,
    });

    if (existingFoodOption) {
      return res.status(400).json({
        success: false,
        message: "Food option already exists",
      });
    }

    const newFoodOption = new Food({
      food: food,
      vegetarian: vegetarian,
      vegan: vegan,
      meat: meat,
      allergies: allergies,
    });

    const savedFood = await newFoodOption.save();

    res.status(201).json({ success: true, data: savedFood });
  } catch (error) {
    res.status(409).json({ success: false, data: {}, error: error.message });
  }
};

const patchByFoodId = async (req, res) => {
  try {
    const existingFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!existingFood) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    res.status(200).json({ success: true, data: existingFood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getFoods, postFoods, patchByFoodId };
