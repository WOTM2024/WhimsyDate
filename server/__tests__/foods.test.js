const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
    return db.end();
});

beforeEach(() => {
    console.log("seeding!");
    return seed(data);
});

describe("GET: /foods", () => {
    test("200: responds with an array of all foods", () => {
        return request(app)
            .get("/foods")
            .expect(200)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.data).toBeInstanceOf(Array);
                body.data.forEach((food) => {
                    expect(food).toMatchObject({
                        food: expect.any(String),
                        vegetarian: expect.any(Boolean),
                        vegan: expect.any(Boolean),
                        meat: expect.any(Boolean),
                        allergies: expect.any(Boolean)
                    });
                });
            });
    });

    test("404: ERROR - responds with an error when endpoint does not exist", () => {
        return request(app)
            .get("/nonexistent-endpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Not Found");
            });
    });
});
