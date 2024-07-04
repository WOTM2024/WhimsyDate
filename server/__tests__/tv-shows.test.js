const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const TvShow = require("../models/tv-shows-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await TvShow.deleteMany({ show: "Outlander", genre: "Drama" });
  await mongoose.connection.close();
});

describe("GET/tvshows", () => {
  test("200:responds with an array of tv shows", () => {
    return request(app)
      .get("/tvshows")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((tvshow) => {
          expect(tvshow).toMatchObject({
            show: expect.any(String),
            genre: expect.any(String),
          });
        });
      });
  });
  test("404: should return 404 for non-existent endpoint", () => {
    return request(app)
      .get("/abc")
      .then((response) => {
        expect(response.status).toBe(404);
      });
  });
  test("200:should return tv show by genre", () => {
    return request(app)
      .get("/tvshows?genre=Drama")
      .expect(200)
      .then(({ body }) => {
        body.data.forEach((tvshow) => {
          expect(tvshow.genre).toBe("Drama");
        });
      });
  });
});

describe("POST:/", () => {
  test("201: should be able to post a new tv show", () => {
    const newTvshow = [
      {
        show: "Outlander",
        genre: "Drama",
      },
    ];
    return request(app)
      .post("/tvshows")
      .send(newTvshow)
      .expect(201)
      .then(({ body }) => {
        console.log(body);
        expect(body.success).toBe(true);
        expect(body.data[0]).toMatchObject({
          show: newTvshow[0].show,
          genre: newTvshow[0].genre,
        });
      });
  });
  test("400:Error - responds with an error when required fields are missing", () => {
    const newTvshow = [
      {
        show: "The Crown",
      },
    ];
    return request(app)
      .post("/tvshows")
      .send(newTvshow)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe(
          "Every TV show must have a show name and genre"
        );
      });
  });
});
