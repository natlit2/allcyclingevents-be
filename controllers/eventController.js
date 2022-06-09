// const { json } = require("express/lib/response");
// const { find } = require("../models/event");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");
//import your scraper
const getAllEvents = async (req, res) => {
  //first scrape
  try {
    const events = await Event.find();
    res.status(200).json({
      Events: events,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err,
    });
  }
};

module.exports = { getAllEvents };
