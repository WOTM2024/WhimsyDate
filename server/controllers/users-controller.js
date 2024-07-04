const Users = require("../models/users-model");
const Activities = require("../models/activities-model");
const Food = require("../models/foods-model");
const Films = require("../models/movies-model");
const Tv_Shows = require("../models/tv-shows-model");

const getUsers = async (req, res) => {
  try {
    const users = await Users.find();

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const postUser = async (req, res) => {
  try {
    const { username } = req.body[0];

    const user_activities = await Activities.distinct("_id", {}, {});
    const user_food_choices = await Food.distinct("_id", {}, {});
    const user_films = await Films.distinct("_id", {}, {});
    const user_tv_shows = await Tv_Shows.distinct("_id", {}, {});

    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ success: false, message: "Input should be an array" });
    }

    const savedUser = await Users.updateOne(
      { username },
      {
        $set: {
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
    console.log(error);
    res.status(409).json({ success: false, data: [], error: error });
  }
};

module.exports = { getUsers, postUser };
