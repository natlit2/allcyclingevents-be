const express = require("express");
const app = express.Router();
const { getAllEvents } = require("../controllers/eventController");

app.route("/").get(getAllEvents);

module.exports = app;
