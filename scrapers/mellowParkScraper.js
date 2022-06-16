const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");

async function scrapeEvent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  //scrape the title
  const [titleElement] = await page.$x(
    '//*[@id="events"]/div/div/div[1]/div[3]/div/h3/a'
  );

  //get the title -> this works
  const txt = await titleElement.getProperty("textContent");
  const eventTitle = await txt.jsonValue();

  console.log(`the event title is: ${eventTitle}`);
  //////scrape the link to the event

  ////to get 1 specific link -> this does not work need to fix the selector
  const selector = "a.getAttribute('href')";
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
scrapeEvent("https://www.mellowpark.de/events.html");
