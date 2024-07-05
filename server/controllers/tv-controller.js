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

const postTvShow = async (req, res) => {
  try {
    const { show, genre } = req.body;

    if (!show || !genre) {
      return res.status(400).json({
        success: false,
        message: "Every TV show must have a show name and genre",
      });
    }

    const existingTvShow = await TvShow.findOne({
      show: show,
      genre: genre,
    });

    if (existingTvShow) {
      return res.status(400).json({
        success: false,
        message: "TV show already exists",
      });
    }

    const newTvShow = new TvShow({
      show: show,
      genre: genre,
    });

    const savedTvShow = await newTvShow.save();
    res.status(201).json({ success: true, data: savedTvShow });
  } catch (error) {
    res.status(409).json({ success: false, data: {}, error: error.message });
  }
};

module.exports = { getTvShows, postTvShow };
