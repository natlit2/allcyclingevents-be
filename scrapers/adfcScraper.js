const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");

async function scrapeEvent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url);
  } catch (err) {
    console.log("the page didn't load");
  }

  //scrape the title
  const [titleElement] = await page.$x('//*[@id="content"]/div[4]/div[1]/a/h2');

  const txt = await titleElement.getProperty("textContent");
  const eventTitle = await txt.jsonValue();

  console.log(`the event title is: ${eventTitle}`);
  //////scrape the link to the event
  ////to get 1 specific link
  const selector = "a.item-link";
  const eventLink = await page.$eval(selector, (el) => el.href);
  console.log(`the event link is: ${eventLink}`);

  //// to get all links on the page

  // const selector = "a.item-link";
  // const links = await page.$$eval(selector, (am) =>
  //   am.filter((e) => e.href).map((e) => e.href)
  // );
  // console.log(links);

  // saving the data in mongo
  new Event({
    title: txt,
    eventTitle,
    link: eventLink,
  }).save();
  browser.close();
}
scrapeEvent("http://adfc-berlin.de/aktiv-werden/bei-demonstrationen.html");
