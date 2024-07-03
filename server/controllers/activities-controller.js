const Activity = require("../models/activities-model")


const getActivities = async (req, res) => {
    try {
        
        const { category, cost, isCollaborative } = req.query;
        
        const validQueryParams = ['category', 'cost', 'isCollaborative'];
        const invalidParams = Object.keys(req.query).filter(param => !validQueryParams.includes(param));
        if(invalidParams.length > 0) {
            return res.status(400).json({ success: false, message: "Invalid query parameter"});
        }



        let filter = {};
        if(category) {
            filter.category = category;
        }
        if(cost) {
            filter.cost = cost;
        }
        if(isCollaborative) {
            filter.isCollaborative = isCollaborative;
        }

        
        const activities = await Activity.find(filter);
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

        for (const activity of activities) {
            if (!activity.activity_name || !activity.category || activity.isCollaborative === undefined || activity.cost === undefined) {
                return res.status(400).json({ success: false, message: "Missing required fields"});
            }
        }

        for(const activity of activities) {
            const existingActivity = await Activity.findOne({ activity_name: activity.activity_name });
            if (existingActivity) {
                return res.status(409).json({ success: false, message: "This option already exists! Please use that one."})
            }
        }

        const savedActivities = await Activity.insertMany(activities);
        res.status(201).json({ success: true, data: savedActivities});
    } catch (error) {
        res.status(409).json({ success: false, data: [], error: error})
    }
};

module.exports = { getActivities, postActivities };