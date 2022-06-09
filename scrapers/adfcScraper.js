const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");

async function scrapeEvent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  //scrape the title
  const [titleElement] = await page.$x('//*[@id="content"]/div[4]/div[1]/a/h2');
  const txt = await titleElement.getProperty("textContent");
  const eventTitle = await txt.jsonValue();

  console.log({ eventTitle });
  // saving the data in mongo
  new Event({ title: txt, eventTitle }).save();

  //scrape the link to the event

  browser.close();
}
scrapeEvent("http://adfc-berlin.de/aktiv-werden/bei-demonstrationen.html");

//esport the function to server.js
//module.exports = scrapeEvent;
