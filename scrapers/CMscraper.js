const puppeteer = require("puppeteer");
const Event = require("../models/event");
const db = require("../dbinit"); //this will run the db connection once this scraper is triggered

async function scrapeEvent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [dateElement] = await page.$x(
    '//*[@id="fergcorp_milestone-2"]/div/div[1]/span'
  );
  const txt = await dateElement.getProperty("textContent");
  const date = await txt.jsonValue();

  console.log({ date });
  //this saves the data in mongo
  new Event({ date: txt, date }).save();

  browser.close();
}

scrapeEvent("http://criticalmass-berlin.org/");
