const Users = require("../models/users-model");
const Couples = require("../models/couples-model");

const getCouples = async (req, res) => {
  try {
    const couples = await Couples.find();
    res.status(200).json({ success: true, data: couples });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCoupleById = async (req, res) => {
  const { couple_id } = req.params;

  try {
    const couple = await Couples.findById(couple_id);

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: "couple not found",
      });
    }

    res.status(200).json({ success: true, data: couple });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const postCouple = async (req, res) => {
  const { userOneId, userTwoId } = req.body;

  try {
    const userOne = await Users.findById(userOneId).lean().exec();
    const userTwo = await Users.findById(userTwoId).lean().exec();

    if (!userOne || !userTwo) {
      return res.status(404).json({
        success: false,
        message: "one or both users not found",
      });
    }
    //https://www.mongodb.com/docs/manual/reference/operator/query/or/
    const existingCouple = await Couples.findOne({
      $or: [
        { user_one: userOneId, user_two: userTwoId },
        { user_one: userTwoId, user_two: userOneId },
      ],
    })
      .lean()
      .exec();
    if (existingCouple) {
      return res.status(400).json({ success: false, message: "couple already exists" });
    }

    const combinedActivities = Array.from(new Set([...userOne.user_activities, ...userTwo.user_activities]));
    const combinedFoodChoices = Array.from(new Set([...userOne.user_food_choices, ...userTwo.user_food_choices]));
    const combinedFilms = Array.from(new Set([...userOne.user_films, ...userTwo.user_films]));
    const combinedTVShows = Array.from(new Set([...userOne.user_tv_shows, ...userTwo.user_tv_shows]));

    const couple = new Couples({
      user_one: userOneId,
      user_two: userTwoId,
      couple_activities: combinedActivities,
      couple_food_choices: combinedFoodChoices,
      couple_films: combinedFilms,
      couple_tv_shows: combinedTVShows,
    });

    await couple.save();

    res.status(201).json({ success: true, data: couple });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteCouple = async (req, res) => {
  const { id } = req.body;

  try {
    const couple = await Couples.findById(id);

    if (!couple) {
      return res.status(404).json({
        success: false,
        message: "couple not found",
      });
    }

    await Couples.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "couple deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { getCouples, postCouple, deleteCouple, getCoupleById };
