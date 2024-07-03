const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");
const Food = require('../models/foods-model');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION);
});

afterAll(async () => {
    await Food.deleteMany({});
    await mongoose.connection.close();
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
            .get("/notAnEndpoint")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid endpoint, please try again");
            });
    });
});

describe("POST: /foods/add", () => {
    test("201: Adds a food option and responds with the new food option", () => {
        const newFood = [
            {
                food: "Tofu Express",
                vegetarian: true,
                vegan: true,
                meat: false,
                allergies: false
            }
        ];
        return request(app)
            .post("/foods/add")
            .send(newFood)
            .expect(201)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.data[0]).toMatchObject({
                    food: "Tofu Express",
                    vegetarian: true,
                    vegan: true,
                    meat: false,
                    allergies: false
                });
            });
    });
    test("400: ERROR - responds with an error when required fields are missing", () => {
        const missingInfo = [
            {
                vegetarian: true,
                vegan: true,
                meat: false
            }
        ];
        return request(app)
            .post("/foods/add")
            .send(missingInfo)
            .expect(400)
            .then(({ body }) => {
                expect(body.success).toBe(false);
                expect(body.message).toBe("Don't forget to add the name of the food!");
            });
    });
    test("409: ERROR - responds with an error when the food option is already in the database", () => {
        const multipleFoodOption = [
            {
            food: "Rio's Steakhouse",
            vegetarian: false,
            vegan: false,
            meat: true,
            allergies: true
            }
        ];

        return request(app)
            .post("/foods/add")
            .send(multipleFoodOption)
            .expect(409)
            .then(({ body }) => {
                expect(body.success).toBe(false);
                expect(body.message).toBe("This option already exists in our database, please use that instead of adding it again.");
                });

    });

});
