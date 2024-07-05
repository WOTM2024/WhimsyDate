const request = require('supertest');
const app = require('../app');
const mongoose = require("mongoose");
const Food = require('../models/foods-model');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await Food.deleteMany({food: "Rio's Steakhouse", food: "Tofu Express"});
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

describe("POST: /foods", () => {
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
            .post("/foods")
            .send(newFood)
            .expect(201)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.data).toMatchObject({
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
            .post("/foods")
            .send(missingInfo)
            .expect(400)
            .then(({ body }) => {
                expect(body.success).toBe(false);
                expect(body.message).toBe("Don't forget to add the name of the food!");
            });
    });

    test("201: Will avoid duplicating food options on the database, instead updating the existing entry", () => {
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
            .post("/foods")
            .send(multipleFoodOption)
            .expect(201)
            .then(({ body }) => {
                expect(body.success).toBe(true);
                expect(body.data).toMatchObject({
                    food: "Rio's Steakhouse",
                    vegetarian: false,
                    vegan: false,
                    meat: true,
                    allergies: true
                });
            })
            .then(() => {
                return request(app)
                    .get("/foods")
                    .expect(200)
                    .then(({ body }) => {
                        const foodEntries = body.data.filter(food => food.food === "Rio's Steakhouse");
                        expect(foodEntries.length).toBe(1);
                        expect(foodEntries[0]).toMatchObject({
                            food: "Rio's Steakhouse",
                            vegetarian: false,
                            vegan: false,
                            meat: true,
                            allergies: true
                        });
                    });
            });
    });
});
