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
    const tvshows = req.body;

    if (!Array.isArray(tvshows)) {
      return res
        .status(400)
        .json({ success: false, message: "Input should be an array" });
    }

    const tvshowsToInsert = [];

    for (let tvshow of tvshows) {
      if (!tvshow.show || !tvshow.genre) {
        return res.status(400).json({
          success: false,
          message: "Every TV show must have a show name and genre",
        });
      }

      const existingTvshow = await TvShow.findOne({ show: tvshow.show });
      if (existingTvshow) {
        continue;
      }
      tvshowsToInsert.push(tvshow);
    }
    console.log(tvshowsToInsert);

    const savedTvshows = await TvShow.insertMany(tvshowsToInsert);

    res.status(201).json({ success: true, data: savedTvshows });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

module.exports = { getTvShows, postTvShows };
