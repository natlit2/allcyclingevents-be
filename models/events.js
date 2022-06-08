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
    required: false,
  },
});

module.exports = mongoose.model("Event", EventSchema);
