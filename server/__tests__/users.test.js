const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Users = require("../models/users-model");
const { create } = require("../models/tv-shows-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
async function createDummyUser() {
  const userData = {
    username: "Tom",
    fb_id: "123456",
    user_activities: ["6685484eb3b5bf698cc8c252"]
  }
  let user = await Users.findOne({
    username: userData.username,
    fb_id: userData.fb_id,
  });
  if (!user) {
    user = await Users.create({
      username: userData.username,
      fb_id: userData.fb_id,
      user_activities: userData.user_activities
    });
    return user
  }
}

let deletableUser;

  beforeEach(async () => {
    const user = await createDummyUser()
    deletableUser = user;
  });

afterEach(async ()=>{
  await Users.deleteMany({ username: "Tom" })
  await Users.deleteMany({ username: "Bobby" })
})

afterAll(async () => {
  await Users.deleteMany({ username: "Pam" });
  await mongoose.connection.close();
});

describe("GET: /users", () => {
  test("200: responds with an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            fb_id: expect.any(String),
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
      .get("/api/notAnEndpoint")
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
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          __v: 0,
          _id: expect.any(String),
          fb_id: expect.any(String),
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
      .post("/api/users")
      .send(multipleUserOption)
      .expect(400)
      .then(() => {
        return request(app)
          .post("/api/users")
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
      .post("/api/users")
      .send(multipleUserOption)
      .expect(400)
      .then(() => {
        return request(app)
          .post("/api/users")
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
  test("200: Deletes a user and responds with a success message", () => {
    const userToDelete = { fb_id:  deletableUser.fb_id };
    return request(app)
      .delete(`/api/users/${userToDelete.fb_id}/delete`)
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.message).toBe(`${deletableUser.username} has been deleted from our records`);
      })
      .then(() => {
        return Users.findOne({ fb_id: deletableUser.fb_id });
      })
      .then((user) => {
        expect(user).toBeNull();
      });
  });
});


describe("GET: /:user_id", () => {
  test("200: returns a unique user based on  fb_id", () => {
    return request(app)
      .get(`/api/users/${deletableUser.fb_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          fb_id: deletableUser.fb_id,
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
      .get(`/api/users/${deletableUser.fb_id}/categories`)
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
        .get(`/api/users/${deletableUser.fb_id}/user_activities`)
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
                })
            });
        })   
     })
})

describe("POST: :user_id/:category", ()=>{
  test("200: returns an array that has been updated to show the new list of entries on the account after an entry has been added", async ()=>{
    const entryId = {entryId: "6685484eb3b5bf698cc8c259"}
    const response = await request(app)
      .post(`/api/users/${deletableUser.fb_id}/user_activities`)
      .send(entryId)
      .expect(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toContain("6685484eb3b5bf698cc8c259");
  })
})

describe("PATCH /users/:user_id/:category", () => {
  test("200: successfully removes an entry from the user's category", async () => {
    const entryId = {entryId :"6685484eb3b5bf698cc8c252"}
    const response = await request(app)
    .patch(`/api/users/${deletableUser.fb_id}/user_activities`)
    .send(entryId)
    .expect(200)
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe(`That option has been removed from user_activities`);
    });
  })

  

describe("PATCH: /users/:user_id/username", () => {
  test("200: Returns an array of the user's information with their new username", () => {
    const newUsername = [
      {
        newUsername: "Bobby",
      },
    ];
    return request(app)
      .patch(`/api/users/${deletableUser.fb_id}/username`)
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
      .patch(`/api/users/${deletableUser.fb_id}/username`)
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
      .patch(`/api/users/${deletableUser.fb_id}/username`)
      .send(newUsername)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("incorrect type");
      });
  });
});
