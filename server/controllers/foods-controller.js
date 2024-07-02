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
        const foods = req.body;
        
        if (!Array.isArray(req.body)) {
            return res
              .status(400)
              .json({ success: false, message: "Input should be an array" });
          }
          
        

        const savedFood = await Food.insertMany(foods);
        res.status(201).json({ success: true, data: savedFood });
    } catch  (error) {
        console.log(error)
        res.status(409).json({ success: false, data: [], error: error });
    }
}

module.exports = { getFoods, postFoods }