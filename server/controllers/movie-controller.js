const Movie = require("../models/movies-model");
const Counter = require("../models/counter-schema");

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

    const updatedMovies = await Promise.all(
      movies.map(async (movie) => {
        const counter = await Counter.findOneAndUpdate(
          { model: "Movie" },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        movie.movie_id = counter.seq;
        return movie;
      })
    );

    const savedMovies = await Movie.insertMany(updatedMovies);
    res.status(201).json({ success: true, data: savedMovies });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

module.exports = { postMovies, getMovies };
