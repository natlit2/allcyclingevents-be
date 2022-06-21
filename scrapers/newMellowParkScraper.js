const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");

// the new scraper should acrape all teh links first
// keep in an array... see ocmments below

async function scrapeAllEvents(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url);
  } catch (err) {
    console.log("the page did NOT load");
  }

  //get all links from the event page and save them in an array

  const linkSelector =
    "#events > div > div > div.mod_eventlist.col-xs-12.block > div > div > div.teaser > p.more > a";
  const eventLinks = await page.$$eval(linkSelector, (arr) =>
    arr.map((el) => el.href)
  );
  console.log(`THE EVENTS LINKS ARE: ${eventLinks}`);

  // const eventLinks = await page.evaluate(() =>
  //   Array.from(document.querySelectorAll("a[href]"), (a) =>
  //     a.getAttribute("href")
  //   )
  // );

  //for each link in the array scrape the title, event img and event date

  // save the event link, title, imglink, and date intoa mongoose object and save to mongo
}
scrapeAllEvents("https://www.mellowpark.de/events.html");
