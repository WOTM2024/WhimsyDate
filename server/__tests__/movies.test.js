const request = require("supertest");
const app = require("../app.js");

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
      .get("/api/non-existent endpoint")
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
    const newMovie = [
      {
        title: "John Wick",
        genre: "Action",
      },
    ];

    return request(app)
      .post("/api/movies")
      .send(newMovie)
      .expect(201)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data[0]).toMatchObject({
          _id: expect.any(String),
          movie_id: expect.any(Number),
          title: newMovie[0].title,
          genre: newMovie[0].genre,
        });
        console.log(body);
      });
  });
});
