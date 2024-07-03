const TvShow = require("../models/tv-shows-model");

const getTvShows = async (req, res) => {
  try {
    const { genre } = req.query;
    let filteredGenre = {};

    if (genre) {
      filteredGenre.genre = genre;
    }

    const tvShows = await TvShow.find(filteredGenre);
    res.status(200).json({ success: true, data: tvShows });
  } catch (error) {
    res.status(409).json({ sucess: false, data: [], error: error });
  }
};

const postTvShows = async (req, res) => {
  try {
    const tvShows = req.body;

    if (!Array.isArray(tvShows)) {
      return res
        .status(400)
        .json({ sucess: false, message: "Input should be an array" });
    }

    const savedTvShows = await TvShow.insertMany(tvShows);
    res.status(201).json({ sucess: true, data: savedTvShows });
  } catch (error) {
    res.status(409).json({ sucess: false, data: [], error: error });
  }
};

module.exports = { getTvShows, postTvShows };
