const express = require("express");
const {
  getActivities,
  postActivity,
} = require("../controllers/activities-controller");

activities_router = express.Router();

activities_router.get("/", getActivities);
activities_router.post("/", postActivity);

module.exports = activities_router;
