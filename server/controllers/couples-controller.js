const Couples = require("../models/couples-model");
const Activities = require("../models/activities-model");
const Food = require("../models/foods-model");
const Films = require("../models/movies-model");
const Tv_Shows = require("../models/tv-shows-model");
const Users = require("../models/users-model");

const getCouples = async (req, res) => {
  try {
    const couples = await Couples.find();
    res.status(200).json({ success: true, data: Couples });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

const postUser = async (req, res) => {
  try {
    const { userOneName, userTwoName } = req.body;

    if (req.body.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Bad Request - please enter two usernames",
      });
    }

    const userOne = await Users.find({ username: userOneName });
    const userTwo = await Users.find({ username: userTwoName });

    if (!userOne || !userTwo) {
      return res.status(400).json({
        success: false,
        message: "Bad Request - please enter two valid usernames",
      });
    }

    const couple = [userOne._id, userTwo._id];
    const user_activities = await Activities.distinct("_id", {}, {});
    const user_food_choices = await Food.distinct("_id", {}, {});
    const user_films = await Films.distinct("_id", {}, {});
    const user_tv_shows = await Tv_Shows.distinct("_id", {}, {});

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ success: false, message: "Input should be an array" });
    }

    const savedUser = await Users.updateOne(
      {
        $set: {
          couple,
          user_activities,
          user_food_choices,
          user_films,
          user_tv_shows,
        },
      },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

module.exports = { postUser, getCouples };
