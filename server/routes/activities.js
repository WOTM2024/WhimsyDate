const express = require("express");
const { getActivities, postActivities } = require("../controllers/activities-controller");

activities_router = express.Router();

activities_router.get("/", getActivities);
activities_router.post("/add", postActivities);

module.exports = activities_router;