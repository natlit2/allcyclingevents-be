const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const connectDB = require("./dbinit");
const events = require("./routes/eventRoute");
const cors = require("cors");
const scheduler = require("./scrapersScheduler");

//the 2 lines below are for post and put requests
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

//here we deside how the route would be called
connectDB();
app.use(cors());
app.use("/events", events);

//the error handler needs to be fixed, the code is working but a time out error is logged anyway
app.get("/", (req, res, next) => {
  setTimeout(() => {
    try {
      throw new Error("your request has timed out and no results were found");
    } catch (err) {
      next(err);
    }
  }, 1000);
  res.send("Allcyclingevents-berlin server is up and running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const runScheduler = () => scheduler;
