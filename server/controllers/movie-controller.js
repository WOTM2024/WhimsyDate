const Movie = require("../models/movies-model");

const getMovies = async (req, res) => {
  try {
    const { genre } = req.query;
    let filteredGenre = {};

    if (genre) {
      filteredGenre.genre = genre;
    }

    const movies = await Movie.find(filteredGenre);

    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

const postMovie = async (req, res) => {
  try {
    const { title, genre } = req.body;
    if (!title || !genre) {
      return res.status(400).json({
        success: false,
        message: "Movie must have a title and genre",
      });
    }

    const existingMovie = await Movie.findOne({
      title: title,
      genre: genre,
    });

    if (existingMovie) {
      return res.status(400).json({
        success: false,
        message: "Movie already exists",
      });
    }

    const newMovie = new Movie({
      title: title,
      genre: genre,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ success: true, data: savedMovie });
  } catch (error) {
    res.status(409).json({ success: false, data: {}, error: error.message });
  }
};

module.exports = { getMovies, postMovie };
