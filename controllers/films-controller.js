const Movie = require("../models/films-model");

const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    console.log(movies);
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const postMovies = async (req, res) => {
  try {
    const movies = req.body;

    if (!Array.isArray(movies)) {
      return res
        .status(400)
        .json({ success: false, message: "Input should be an array" });
    }

    const savedMovies = await Movie.insertMany(movies);
    res.status(201).json({ success: true, data: savedMovies });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

module.exports = { postMovies, getMovies };
