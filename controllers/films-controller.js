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
    const { name } = req.body;
    const { genre } = req.body;

    const newMovie = new Movie({
      name: name,
      genre: genre,
    });

    const savedMovie = await newMovie.save();
    res.status(201).json({ success: true, data: savedMovie });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

module.exports = { postMovies, getMovies };
