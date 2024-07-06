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

describe("POST: /users", () => {
  test("201: Adds a new user", () => {
    const newUser = [
      {
        username: "Pam",
        fb_id: "DGS-sduvhi2iuasdb8",
      },
    ];

    return request(app)
      .post("/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data[0]).toMatchObject({
          __v: 0,
          _id: expect.any(String),
          user_activities: expect.any(Array),
          user_films: expect.any(Array),
          user_food_choices: expect.any(Array),
          user_tv_shows: expect.any(Array),
          username: "Pam",
        });
      });
  });

  test("400: ERROR - responds with an error when the user enters an empty username", () => {
    const multipleUserOption = [
      {
        username: "",
      },
    ];

    return request(app)
      .post("/users")
      .send(multipleUserOption)
      .expect(400)
      .then(() => {
        return request(app)
          .post("/users")
          .send(multipleUserOption)
          .expect(400)
          .then(({ body }) => {
            expect(body.success).toBe(false);
            expect(body.message).toBe(
              "Bad Request - please enter a username with one or more characters"
            );
          });
      });
  });

  test("400: ERROR - responds with an error when an empty fb_id is provided", () => {
    const multipleUserOption = [
      {
        username: "Pam",
        fb_id: undefined,
      },
    ];

    return request(app)
      .post("/users")
      .send(multipleUserOption)
      .expect(400)
      .then(() => {
        return request(app)
          .post("/users")
          .send(multipleUserOption)
          .expect(400)
          .then(({ body }) => {
            expect(body.success).toBe(false);
            expect(body.message).toBe(
              "Bad Request - fb_id is an empty string or undefined"
            );
          });
      });
  });
});

describe("DELETE: /users/delete", () => {
  let deletableId;

  beforeEach(async () => {
    const deletableUser = await Users.find({ username: "Pam" });
    deletableId = deletableUser[0]._id;
  });

  test("200: Deletes a user and responds with a success message", () => {
    const userToDelete = { _id: deletableId };
    return request(app)
      .delete("/users/delete")
      .send(userToDelete)
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.message).toBe(`Pam has been deleted from our records`);
      })
      .then(() => {
        return Users.findById(deletableId);
      })
      .then((user) => {
        expect(user).toBeNull();
      });
  });
});

describe("GET: /:user_id", () => {
  test("200: returns a unique user based on a _id", () => {
    return request(app)
      .get("/users/6688fdbb59ec800803bd42f7")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          username: expect.any(String),
          user_activities: expect.any(Array),
          user_food_choices: expect.any(Array),
          user_films: expect.any(Array),
          user_tv_shows: expect.any(Array),
        });
      });
  });
  test("404: ERROR - responds with an error when user _id does not exist", () => {
    return request(app)
      .get("/111222333444555666777888999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint, please try again");
      });
  });
});

describe("GET: :user_id/categories", () => {
  test("200: Returns an array of the categories on a users profile", () => {
    return request(app)
      .get("/users/6688fdbb59ec800803bd42f7/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toContain(
          "user_activities",
          "user_films",
          "user_food_choices",
          "user_tv_shows"
        );
      });
  });
});

describe("GET: :user_id/:category", () => {
  test("200: Returns entries in a given category based on a user's profile", () => {
    return request(app)
      .get("/users/6688fdbb59ec800803bd42f7/user_activities")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((entry) => {
          expect(entry).toMatchObject({
            _id: expect.any(String),
            activity_name: expect.any(String),
            category: expect.any(String),
            isCollaborative: expect.any(Boolean),
            cost: expect.any(Boolean),
          });
        });
      });
  });
});

describe("PATCH: /users/:user_id/username", () => {
  test("200: Returns an array of the user's information with their new username", () => {
    const newUsername = [
      {
        newUsername: "Bobby",
      },
    ];
    return request(app)
      .patch("/users/6689409253bcad9607a78a30/username")
      .send(newUsername)
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          __v: 0,
          _id: expect.any(String),
          user_activities: expect.any(Array),
          user_films: expect.any(Array),
          user_food_choices: expect.any(Array),
          user_tv_shows: expect.any(Array),
          username: "Bobby",
        });
      });
  });
  test("400: Returns an error message of malformed body/missing required fields when username is not given", () => {
    const newUsername = [
      {
        newUsername: "",
      },
    ];
    return request(app)
      .patch("/users/6689409253bcad9607a78a30/username")
      .send(newUsername)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("malformed body/missing required fields");
      });
  });
  test("400: Returns an error message of incorrect type", () => {
    const newUsername = [
      {
        newUsername: NaN,
      },
    ];
    return request(app)
      .patch("/users/6689409253bcad9607a78a30/username")
      .send(newUsername)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("incorrect type");
      });
  });
});
