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
        const foods = req.body;

        if (!Array.isArray(req.body)) {
            return res.status(400).json({ success: false, message: "Input should be an array" });
        }

        for (let food of foods) {
            if (!food.food) {
                return res.status(400).json({ success: false, message: "Don't forget to add the name of the food!" } );
            }
        }

        const existingFoodOptions = await Food.find();
        if(existingFoodOptions.length > 0){
            for(let i = 0; i < existingFoodOptions.length; i++){
                if(existingFoodOptions[i].food===foods[0].food){
                    return res.status(409).json({ success: false, message: "This option already exists in our database, please use that instead of adding it again."})
                }
            }
        }
        
        const savedFood = await Food.insertMany(foods);
        res.status(201).json({ success: true, data: savedFood });
    } catch (error) {
        console.log(error)
        res.status(409).json({ success: false, data: [], error: error.message });
    }
}

module.exports = { getFoods, postFoods }
