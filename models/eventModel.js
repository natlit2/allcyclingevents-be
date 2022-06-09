const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  date: {
    type: String,
  },
  link: {
    type: String,
  },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
