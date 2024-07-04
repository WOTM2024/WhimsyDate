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
    console.log(activities);
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const postActivities = async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ success: false, message: "Input should be an array" });
    }
    const [activities] = req.body;

    if (
      !activities.activity_name ||
      !activities.category ||
      activities.isCollaborative === undefined ||
      activities.cost === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    await Activity.updateOne(
      { activity_name: activities.activity_name },
      {
        $set: {
          category: activities.category,
          isCollaborative: activities.isCollaborative,
          cost: activities.cost,
        },
      },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: activities });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

module.exports = { getActivities, postActivities };