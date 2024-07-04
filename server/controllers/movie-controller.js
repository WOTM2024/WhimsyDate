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

const postMovies = async (req, res) => {
  try {
    const movies = req.body;

    if (!Array.isArray(movies)) {
      return res
        .status(400)
        .json({ success: false, message: "Input should be an array" });
    }

    const moviesToInsert = [];

    for (let movie of movies) {
      if (!movie.title || !movie.genre) {
        return res.status(400).json({
          success: false,
          message: "Every movie must have a title and genre",
        });
      }

      const existingMovie = await Movie.findOne({ title: movie.title });
      if (existingMovie) {
        continue;
      }
      moviesToInsert.push(movie);
    }

    const savedMovies = await Movie.insertMany(moviesToInsert);

    res.status(201).json({ success: true, data: savedMovies });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

module.exports = { postMovies, getMovies };
