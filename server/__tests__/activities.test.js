const request = require("supertest");
const express = require("express");
const activitiesRouter = require("../routes/activities");
const Activity = require("../models/activities-model");

jest.mock("../models/activities-model");

const app = express();
app.use(express.json());
app.use("/activities", activitiesRouter);

//Middleware to be added to app to catch 404
app.use((req, res, next) => {
  res.status(404).json({ msg: "Non existant endpoint, please try again" });
});

const mockActivities = [
  {
    activity_name: "Kayaking",
    category: "Outdoor Persuits",
    isCollaborative: true,
    cost: false,
  },
  {
    activity_name: "Monopoly",
    category: "Board Games",
    isCollaborative: true,
    cost: false,
  },
  {
    activity_name: "Pool",
    category: "Pub Games",
    isCollaborative: true,
    cost: true,
  },
  {
    activity_name: "Rust",
    category: "Gaming",
    isCollaborative: true,
    cost: false,
  },
  {
    activity_name: "Karting",
    category: "Outdoor Persuits",
    isCollaborative: true,
    cost: true,
  },
  {
    activity_name: "Bowling",
    category: "Indoor Sports",
    isCollaborative: true,
    cost: true,
  },
  {
    activity_name: "Salsa Dancing",
    category: "Indoor Sports",
    isCollaborative: true,
    cost: true,
  },
  {
    activity_name: "Climbing",
    category: "Outdoor Persuits",
    isCollaborative: true,
    cost: true,
  },
  {
    activity_name: "Kitesurfing",
    category: "Outdoor Persuits",
    isCollaborative: false,
    cost: true,
  },
  {
    activity_name: "Axe Throwing",
    category: "Indoor Sports",
    isCollaborative: true,
    cost: true,
  },
  {
    activity_name: "Limbo",
    category: "Indoor Sports",
    isCollaborative: true,
    cost: false,
  },
  {
    activity_name: "Spelunking",
    category: "Outdoor Persuits",
    isCollaborative: true,
    cost: false,
  },
];

describe("Activities endpoints testing", () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("GET: /activities", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test("200: responds with an array of all activities", async () => {
      Activity.find.mockResolvedValue(mockActivities);

      const res = await request(app).get("/activities").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(mockActivities.length);
      res.body.data.forEach((activity) => {
        expect(activity).toMatchObject({
          activity_name: expect.any(String),
          category: expect.any(String),
          isCollaborative: expect.any(Boolean),
          cost: expect.any(Boolean),
        });
      });
    });
    test("200: responds with an array of activities filtered by category", async () => {
      const filteredActivities = mockActivities.filter(
        (activity) => activity.category === "Indoor Sports"
      );

      Activity.find.mockResolvedValue(filteredActivities);

      const res = await request(app)
        .get("/activities?category=Board%20Games")
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(filteredActivities.length);
      res.body.data.forEach((activity) => {
        expect(activity.category).toBe("Indoor Sports");
      });
    });
    test("200: responds with an array of activities filtered by cost", async () => {
      const filteredActivities = mockActivities.filter(
        (activity) => activity.cost === false
      );

      Activity.find.mockResolvedValue(filteredActivities);

      const res = await request(app).get("/activities?cost=false").expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(filteredActivities.length);
      res.body.data.forEach((activity) => {
        expect(activity.cost).toBe(false);
      });
    });
    test("200: responds with an array of activities filtered by wether or not they are collaborative or not", async () => {
      const filteredActivities = mockActivities.filter(
        (activity) => activity.isCollaborative === false
      );

      Activity.find.mockResolvedValue(filteredActivities);

      const res = await request(app)
        .get("/activities?isCollaborative=false")
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(filteredActivities.length);
      res.body.data.forEach((activity) => {
        expect(activity.isCollaborative).toBe(false);
      });
    });
    test("200: responds with an array of activities filtered by category cost and IsCollaborative", async () => {
      const filteredActivities = mockActivities.filter(
        (activity) =>
          activity.category === "Board Games" &&
          activity.cost === false &&
          activity.isCollaborative === true
      );

      Activity.find.mockResolvedValue(filteredActivities);

      const res = await request(app)
        .get(
          "/activities?category=Board%20Games&cost=false&isCollaborative=true"
        )
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.data).toHaveLength(filteredActivities.length);
      res.body.data.forEach((activity) => {
        expect(activity.category).toBe("Board Games");
        expect(activity.cost).toBe(false);
        expect(activity.isCollaborative).toBe(true);
      });
    });
    test("400: responds with an error for invalid query parameters", async () => {
      const res = await request(app)
        .get("/activities?invalidQuery=nonsense")
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Invalid query parameter");
    });
    test("404: responds with an error if the endpoint doesn't exist", async () => {
      const res = await request(app).get("/madeUpEndpoint").expect(404);

      expect(res.body.msg).toBe("Non existant endpoint, please try again");
    });
  });
  describe("POST: /activities/add", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });
    test("201: Adds a new activity and responds with the new activity", async () => {
      const newActivities = [
        {
          activity_name: "chess",
          category: "Board Games",
          isCollaborative: true,
          cost: false,
        },
      ];

      Activity.insertMany.mockResolvedValue(newActivities);

      const res = await request(app)
        .post("/activities/add")
        .send(newActivities)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0]).toMatchObject({
        activity_name: "chess",
        category: "Board Games",
        isCollaborative: true,
        cost: false,
      });
    });
    test("400: responds with an error if required fields are missing", async () => {
      const missingRequiredField = [
        {
          category: "Board Games",
          isCollaborative: false,
          cost: false,
        },
      ];

      const res = await request(app)
        .post("/activities/add")
        .send(missingRequiredField)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Missing required fields");
    });
    test("409: responds with an error if the activity is already present in the database", async () => {
      const duplicateActivity = [
        {
          activity_name: "Kayaking",
          category: "Outdoor Persuits",
          isCollaborative: true,
          cost: false,
        },
      ];

      Activity.findOne.mockResolvedValue(duplicateActivity[0]);

      const res = await request(app)
        .post("/activities/add")
        .send(duplicateActivity)
        .expect(409);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe(
        "This option already exists! Please use that one."
      );
    });
  });
});
