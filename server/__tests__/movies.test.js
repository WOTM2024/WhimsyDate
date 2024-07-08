const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Movie = require("../models/movies-model.js");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await Movie.deleteMany({ title: "Jumanji", genre: "Adventure" });
  await mongoose.connection.close();
});

describe("GET:/movies", () => {
  test("200: responds with an array of movies", () => {
    return request(app)
      .get("/api/movies")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((movie) => {
          expect(movie).toMatchObject({
            title: expect.any(String),
            genre: expect.any(String),
          });
        });
      });
  });
  test("404: should return 404 for non-existent endpoint", () => {
    return request(app)
      .get("/non-existent endpoint")
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });

  test("200: should returnn movies by genre", () => {
    return request(app)
      .get("/api/movies?genre=Sci-Fi")
      .expect(200)
      .then(({ body }) => {
        body.data.forEach((movie) => {
          expect(movie.genre).toBe("Sci-Fi");
        });
      });
  });
});

describe("POST:/", () => {
  test("201: should be able to post a new movie", () => {
    const newMovie = {
      title: "Jumanji",
      genre: "Adventure",
    };
    return request(app)
      .post("/api/movies")
      .send(newMovie)
      .expect(201)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          title: newMovie.title,
          genre: newMovie.genre,
        });
      });
  });
  test("400:Error - responds with an error when required fields are missing", () => {
    const newMovie = { title: "Planet of the Apes" };
    return request(app)
      .post("/api/movies")
      .send(newMovie)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("Movie must have a title and genre");
      });
  });
  test("400: should get 400 BAD Request when inserting duplicates", () => {
    const newMovie = {
      title: "Jumanji",
      genre: "Adventure",
    };
    return request(app)
      .post("/api/movies")
      .send(newMovie)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("Movie already exists");
      });
  });
});
