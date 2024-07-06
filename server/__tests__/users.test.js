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

  test("400: ERROR - responds with an error when the user enters an empty username", () => {
    const multipleUserOption = [
      {
        username: "",
      },
    ];

    return request(app)
      .post("/users/add")
      .send(multipleUserOption)
      .expect(400)
      .then(() => {
        return request(app)
          .post("/users/add")
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

describe("GET: /:user_id", ()=>{
    test("200: returns a unique user based on a _id", ()=>{
        return request(app)
        .get("/users/6687c07f772a0d0c7edeb0dd")
        .expect(200)
        .then(({ body })=>{
            expect(body.success).toBe(true);
            expect(body.data).toMatchObject({
                username: expect.any(String),
                user_activities: expect.any(Array),
                user_food_choices: expect.any(Array),
                user_films: expect.any(Array),
                user_tv_shows: expect.any(Array),
            })
        })
    })
    test("404: ERROR - responds with an error when user _id does not exist", () => {
        return request(app)
          .get("/111222333444555666777888999")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid endpoint, please try again");
          });
    });
})

describe("GET: :user_id/categories", () => {
  test("200: Returns an array of the categories on a users profile", () => {
    return request(app)
      .get("/users/6687c07f772a0d0c7edeb0dd/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toContain(
          "user_activities",
          "user_films",
          "user_food_choices",
          "user_tv_shows",
        );
      });
  });
});

describe("GET: :user_id/:category", () => {
    test("200: Returns entries in a given category based on a user's profile", () => {
      return request(app)
        .get("/users/6687c083772a0d0c7edeb0e9/user_activities")
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


describe("PATCH /users/:user_id/:category", () => {
  test.only("200: successfully removes an entry from the user's category", async () => {
    const entryId = {entryId :"6685484eb3b5bf698cc8c252"}
    request(app)
    .patch("/users/6687c083772a0d0c7edeb0e9/user_activities")
    .send(entryId)
    .expect(200)
    .then(({ body }) => {
        console.log(body)
        expect(body.success).toBe(true);
        expect(body.data).not.toContain(entryId.entryId);
    });
  })
  test("409: returns error when entry is not in user's category", async () => {
    const entryId = { entryId: "Cats" };
    request(app)
    .patch("/users/6687c083772a0d0c7edeb0e9/user_activities")
    .send(entryId)
    .expect(409)
    .then(({ body }) => {
      console.log(body)
      expect(body.success).toBe(false);
      expect(body.message).toBe("This entry is not in your profile yet");
    });
  })
})
  
// describe("POST: :user_id/:category", ()=>{
//   test("200: returns an array that has been updated to show the new list of entries on the account after an entry has been added", ()=>{
//     const entryId = {entryId: "6685484eb3b5bf698cc8c252"}
//     return request(app)
//       .post("/users/6687c07f772a0d0c7edeb0dd/user_activities")
//       .send(entryId)
//       .expect(200)
//       .then(({ body })=>{
//         expect(body.success).toBe(true)
//         console.log(body)
//         expect(response.body.data).toContain("6685484eb3b5bf698cc8c252");
//       })
//   })
//   test("409: ERROR returns message when the user attempts to add an event that is already in their category", ()=>{
//     const entryId = {entryId: "6685484eb3b5bf698cc8c252"}
//     return request(app)
//       .post("/users/6687c07f772a0d0c7edeb0dd/user_activities")
//       .send(entryId)
//       .expect(409)
//       .then(({ body })=>{
//         console.log(body)
//         expect(body.success).toBe(false)
//         expect(body.message).toBe("You already have this entry on your profile")
//       })
//   })
// })



