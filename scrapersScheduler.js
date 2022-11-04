// import adfcScraper from "./scrapers/newAdfcScraper";
// import cmScraper from "./scrapers/CMscraper";
// import eventBriteScraper from "./scrapers/eventbriteScraper";
// import mellowParkScraper from "./scrapers/newMellowParkScraper";

const adfcScraper = require("./scrapers/newAdfcScraper");
const cmScraper = require("./scrapers/CMscraper");
const eventBriteScraper = require("./scrapers/eventbriteScraper");
const mellowParkScraper = require("./scrapers/newMellowParkScraper");

const schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();
rule.hour = 12;

const job = schedule.scheduleJob(rule, function () {
  console.log("The answer to life, the universe, and everything!");
  adfcScraper();
  cmScraper();
  eventBriteScraper();
  mellowParkScraper();
  return job;
});
schedule.gracefulShutdown();
module.exports = schedule;
