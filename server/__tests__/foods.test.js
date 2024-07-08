const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Food = require("../models/foods-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  await Food.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET: /api/foods", () => {
  test("200: responds with an array of all foods", async () => {
    await Food.create([
      {
        food: "Rio's Steakhouse",
        vegetarian: false,
        vegan: false,
        meat: true,
        allergies: true,
      },
    ]);
    return request(app)
      .get("/api/foods")
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
            allergies: expect.any(Boolean),
          });
        });
      });
  });

  test("404: ERROR - responds with an error when endpoint does not exist", () => {
    return request(app)
      .get("/api/notAnEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint, please try again");
      });
  });
});

describe("POST: /api/foods", () => {
  test("201: should be able to post a new food option", () => {
    const newFood = {
      food: "Tofu Express",
      vegetarian: true,
      vegan: true,
      meat: false,
      allergies: false,
    };
    return request(app)
      .post("/api/foods")
      .send(newFood)
      .expect(201)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          food: newFood.food,
          vegetarian: newFood.vegetarian,
          vegan: newFood.vegan,
          meat: newFood.meat,
          allergies: newFood.allergies,
        });
      });
  });

  test("400: ERROR - responds with an error when required fields are missing", () => {
    const missingInfo = [
      {
        vegetarian: true,
        vegan: true,
        meat: false,
      },
    ];
    return request(app)
      .post("/api/foods")
      .send(missingInfo)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing required fields");
      });
  });

  test("400: should get 400 BAD Request when inserting duplicates", async () => {
    const toInsert = new Food({
      food: "Tofu Express",
      vegetarian: true,
      vegan: true,
      meat: false,
      allergies: false,
    });
    await toInsert.save();

    const duplicateFood = {
      food: "Tofu Express",
      vegetarian: true,
      vegan: true,
      meat: false,
      allergies: false,
    };
    return request(app)
      .post("/api/foods")
      .send(duplicateFood)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("Food option already exists");
      });
  });
});

describe("PATCH /api/foods/:id", () => {
  test("PATCH:200 - should be able to update the existing food option", async () => {
    const toInsert = new Food({
      food: "Rio's Steakhouse",
      vegetarian: false,
      vegan: false,
      meat: true,
      allergies: true,
    });
    await toInsert.save();

    return request(app)
      .patch(`/api/foods/${toInsert._id}`)
      .send({ food: "Rio's Fabulous Steakhouse" })
      .expect(200)
      .then(({ body }) => {
        expect(body.data).toMatchObject({
          food: "Rio's Fabulous Steakhouse",
          vegetarian: false,
          vegan: false,
          meat: true,
          allergies: true,
        });
        expect(body.data.food).toEqual("Rio's Fabulous Steakhouse");
      });
  });
});
