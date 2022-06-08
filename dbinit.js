const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected ${conn.connection.host}`);
};

connectDB();

module.exports = connectDB;
