const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Activity = require("../models/activities-model");

//Middleware to be added to app to catch 404
app.use((req, res, next) => {
  res.status(404).json({ msg: "Non existant endpoint, please try again" });
});

beforeAll(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await Activity.deleteMany({
    activity_name: "chess",
    activity_name: "Kayaking",
  });
  await mongoose.connection.close();
});

describe("GET: /activities", () => {
  test("200: responds with an array of all activities", () => {
    return request(app)
      .get("/activities")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((activity) => {
          expect(activity).toMatchObject({
            activity_name: expect.any(String),
            category: expect.any(String),
            isCollaborative: expect.any(Boolean),
            cost: expect.any(Boolean),
          });
        });
      });
  });
  test("200: responds with an array of activities filtered by category", () => {
    return request(app)
      .get("/activities?category=Board%20Games")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((activity) => {
          expect(activity.category).toBe("Board Games");
        });
      });
  });
  test("200: responds with an array of activities filtered by cost", () => {
    return request(app)
      .get("/activities?cost=false")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((activity) => {
          expect(activity.cost).toBe(false);
        });
      });
  });
  test("200: responds with an array of activities filtered by wether or not they are collaborative or not", () => {
    return request(app)
      .get("/activities?isCollaborative=false")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((activity) => {
          expect(activity.isCollaborative).toBe(false);
        });
      });
  });
  test("200: responds with an array of activities filtered by category cost and IsCollaborative", () => {
    return request(app)
      .get("/activities?category=Board%20Games&cost=false&isCollaborative=true")
      .expect(200)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toBeInstanceOf(Array);
        body.data.forEach((activity) => {
          expect(activity.category).toBe("Board Games");
          expect(activity.cost).toBe(false);
          expect(activity.isCollaborative).toBe(true);
        });
      });
  });
  test("400: responds with an error for invalid query parameters", () => {
    return request(app)
      .get("/activities?invalidQuery=nonsense")
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("Invalid query parameter");
      });
  });
  test("404: responds with an error if the endpoint doesn't exist", () => {
    return request(app)
      .get("/madeUpEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid endpoint, please try again");
      });
  });
});
describe("POST: /activities", () => {
  test("201: Adds a new activity and responds with the new activity", () => {
    const newActivities = {
      activity_name: "Kayaking",
      category: "Water Sport",
      isCollaborative: true,
      cost: false,
    };
    console.log(newActivities, "<<<<<<<")
    return request(app)
      .post("/activities")
      .send(newActivities)
      .expect(201)
      .then(({ body }) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject({
          activity_name: newActivities.activity_name,
          category: newActivities.category,
          isCollaborative: newActivities.isCollaborative,
          cost: newActivities.cost,
        });
      });
  });

  test("400: responds with an error if required fields are missing", () => {
    const missingRequiredField = [
      {
        category: "Board Games",
        isCollaborative: false,
        cost: false,
      },
    ];

    return request(app)
      .post("/activities")
      .send(missingRequiredField)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
        expect(body.message).toBe("Missing required fields");
      });
  });
  test("400: Error - responds with a bad request when trying to insert duplicates", () => {
    const duplicateActivity = {
      activity_name: "Yahtzee",
      category: "Board Games",
      isCollaborative: true,
      cost: false,
    };

    return request(app)
      .post("/activities")
      .send(duplicateActivity)
      .expect(400)
      .then(({ body }) => {
        expect(body.success).toBe(false);
      });
  });
});
