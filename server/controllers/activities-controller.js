const Activity = require("../models/activities-model");

const getActivities = async (req, res) => {
  try {
    const { category, cost, isCollaborative } = req.query;

    const validQueryParams = ["category", "cost", "isCollaborative"];
    const invalidParams = Object.keys(req.query).filter(
      (param) => !validQueryParams.includes(param)
    );
    if (invalidParams.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid query parameter" });
    }

    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (cost) {
      filter.cost = cost;
    }
    if (isCollaborative) {
      filter.isCollaborative = isCollaborative;
    }

    const activities = await Activity.find(filter);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const postActivity = async (req, res) => {
  try {
    const { activity_name, category, isCollaborative, cost } = req.body;
    if (
      !activity_name ||
      !category ||
      isCollaborative === undefined ||
      cost === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const existingActivity = await Activity.findOne({
      activity_name: activity_name,
      category: category,
      isCollaborative: isCollaborative,
      cost: cost,
    });

    if (existingActivity) {
      return res.status(400).json({
        success: false,
        message: "Activity already exists in our database",
      });
    }

    const newActivity = new Activity({
      activity_name: activity_name,
      category: category,
      isCollaborative: isCollaborative,
      cost: cost,
    });

    const savedActivity = await newActivity.save();
    res.status(201).json({ success: true, data: savedActivity });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

module.exports = { getActivities, postActivity };
