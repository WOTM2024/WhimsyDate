const Activity = require("../models/activities-model")

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        console.log(activities);
        res.status(200).json({ success: true, data: activities});
    } catch (error) {
        res.status(409).json({ success: false, data: [], error: error});
    }
};

const postActivities = async (req, res) => {
    try {
        const activities = req.body;

        if (!Array.isArray(activities)) {
            return res.status(400)
            .json({ success: false, message: "Input should be an array"});
        }

        const savedActivities = await Activity.insertMany(activities);
        res.status(201).json({ success: true, data: savedActivities});
    } catch (error) {
        res.status(409).json({ success: false, data: [], error: error})
    }
};

module.exports = { getActivities, postActivities };