const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Users = require("../models/users-model");
const Couples = require("../models/couples-model");

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Couples.deleteMany({});
});

///////////////////////////////////////////
// GET
//////////////////////////////////////////
describe("GET: /couples", () => {
  test("200: responds with an array of all couples", async () => {
    const dummyData = await createDummyUsers(
      { username: "user1", fb_id: "user_1" },
      { username: "user2", fb_id: "user_2" }
    );
    await createDummyCouple(dummyData[0], dummyData[1]);
    return request(app)
      .get("/couples")
      .expect(200)
      .then(({ body }) => {
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((couple) => {
          expect(couple).toMatchObject({
            user_one: expect.any(String),
            user_two: expect.any(String),
            couple_activities: expect.any(Array),
            couple_food_choices: expect.any(Array),
            couple_films: expect.any(Array),
            couple_tv_shows: expect.any(Array),
          });
        });
      });
  });
});

describe("GET: /couples/:couple_id", () => {
  test("200: responds with the couple details when the couple is found", async () => {
    const dummyData = await createDummyUsers(
      { username: "user1", fb_id: "user_1" },
      { username: "user2", fb_id: "user_2" }
    );
    const coupleId = await createDummyCouple(dummyData[0], dummyData[1]);

    return request(app)
      .get(`/couples/${coupleId}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.data).toMatchObject({
          _id: coupleId.toString(),
          user_one: dummyData[0].toString(),
          user_two: dummyData[1].toString(),
          couple_activities: expect.any(Array),
          couple_food_choices: expect.any(Array),
          couple_films: expect.any(Array),
          couple_tv_shows: expect.any(Array),
        });
      });
  });

  test("404: responds with an error message when the couple is not found", async () => {
    const invalidId = new mongoose.Types.ObjectId();

    return request(app)
      .get(`/couples/${invalidId}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("couple not found");
      });
  });
});

///////////////////////////////////////////
// POST
//////////////////////////////////////////
describe("POST: /couples/add", () => {
  test("201: Creates a couple and responds with the new couple", async () => {
    const dummyData = await createDummyUsers(
      { username: "user1", fb_id: "user_1" },
      { username: "user2", fb_id: "user_2" }
    );
    const newCouple = {
      userOneId: dummyData[0].toString(),
      userTwoId: dummyData[1].toString(),
    };
    return request(app)
      .post("/couples/add")
      .send(newCouple)
      .expect(201)
      .then(async ({ body }) => {
        expect(body.data).toMatchObject({
          user_one: newCouple.userOneId,
          user_two: newCouple.userTwoId,
          couple_activities: expect.any(Array),
          couple_food_choices: expect.any(Array),
          couple_films: expect.any(Array),
          couple_tv_shows: expect.any(Array),
        });
      });
  });

  test("400: Responds with an error when trying to add a duplicate couple", async () => {
    const dummyData = await createDummyUsers(
      { username: "user1", fb_id: "user_1" },
      { username: "user2", fb_id: "user_2" }
    );
    createDummyCouple(dummyData[0], dummyData[1]);
    const duplicateCouple = {
      userOneId: dummyData[0].toString(),
      userTwoId: dummyData[1].toString(),
    };
    return request(app)
      .post("/couples/add")
      .send(duplicateCouple)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("couple already exists");
      });
  });
});

///////////////////////////////////////////
// DELETE
//////////////////////////////////////////
describe("DELETE: /couples/delete", () => {
  test("200: Deletes a couple and responds with a success message", async () => {
    const dummyData = await createDummyUsers(
      { username: "user1", fb_id: "user_1" },
      { username: "user2", fb_id: "user_2" }
    );
    const coupleId = await createDummyCouple(dummyData[0], dummyData[1]);
    return request(app)
      .delete("/couples/delete")
      .send({ id: coupleId })
      .expect(200)
      .then(async ({ body }) => {
        expect(body.message).toBe("couple deleted successfully");
        const deletedCouple = await Couples.findById(coupleId);
        expect(deletedCouple).toBeNull();
      });
  });

  test("404: Responds with an error when the couple does not exist", async () => {
    const invalidId = new mongoose.Types.ObjectId();
    return request(app)
      .delete("/couples/delete")
      .send({ id: invalidId })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("couple not found");
      });
  });
});

///////////////////////////////////////////
// Create dummy users and couple
//////////////////////////////////////////
async function createDummyUsers(user1, user2) {
  let userOne = await Users.findOne({
    username: user1.username,
    fb_id: user1.fb_id,
  });
  if (!userOne) {
    userOne = await Users.create({
      username: user1.username,
      fb_id: user1.fb_id,
    });
  }
  const userOneID = userOne._id;

  let userTwo = await Users.findOne({
    username: user2.username,
    fb_id: user2.fb_id,
  });
  if (!userTwo) {
    userTwo = await Users.create({
      username: user2.username,
      fb_id: user2.fb_id,
    });
  }
  const userTwoID = userTwo._id;

  return [userOneID, userTwoID];
}

async function createDummyCouple(userOneID, userTwoID) {
  const couple = await Couples.create({
    user_one: userOneID,
    user_two: userTwoID,
  });
  return couple._id;
}
