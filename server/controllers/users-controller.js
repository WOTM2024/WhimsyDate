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

    if (username.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Bad Request - please enter a username with one or more characters",
      });
    }

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
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;
    const [userToDelete] = await Users.find({ _id });
    await Users.deleteOne({ _id });
    res
      .status(200)
      .json({
        success: true,
        message: `${userToDelete.username} has been deleted from our records`,
      });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

module.exports = { postUser, getUsers, deleteUser };
