const request = require("supertest");
const app = require("../app");

// const mongoose = require("mongoose");
// const TvShow = require("../models/tv-shows-model");

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
});
