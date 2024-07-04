const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Users = require("../models/users-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await Users.deleteMany({ username: "Pam" });
  await mongoose.connection.close();
});

describe("GET: /users", () => {
  test("200: responds with an array of all users", () => {
    return request(app)
      .get("/users")
      .expect(200)
      .then(({ body }) => {
        console.log(body);
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            user_activities: expect.any(Array),
            user_food_choices: expect.any(Array),
            user_films: expect.any(Array),
            user_tv_shows: expect.any(Array),
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
describe("POST: /users/add", () => {
  test("201: Adds a new user", () => {
    const newUser = [
      {
        username: "Pam",
      },
    ];

    return request(app)
      .post("/users/add")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        console.log(body);
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          acknowledged: expect.any(Boolean),
          modifiedCount: expect.any(Number),
          upsertedId: expect.any(String),
          upsertedCount: expect.any(Number),
          matchedCount: expect.any(Number),
        });
      });
  });

  test.only("409: ERROR - responds with an error when the username is already in the database", () => {
    const multipleUserOption = [
      {
        username: "",
      },
    ];

    return request(app)
      .post("/users/add")
      .send(multipleUserOption)
      .expect(409)
      .then(() => {
        return request(app)
          .post("/users/add")
          .send(multipleUserOption)
          .expect(409)
          .then(({ body }) => {
            console.log(body);
            expect(body.success).toBe(false);
            expect(body.message).toBe("Username should not be an empty string");
          });
      });
  });
});
