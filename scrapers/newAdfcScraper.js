const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
//const connectDB = require("../dbinit");
const moment = require("moment");
const document = require("puppeteer");
// startup puppeteer

async function scrapeAllEvents(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector(".list-group", { timeout: 10000 });
    const eventLinks = await page.evaluate(() => {
      const listGroup = document.querySelectorAll(".list-group a");
      console.log(listGroup);
      let links = [];
      for (const link of listGroup) {
        links.push(link.getAttribute("href"));
      }
      return links;
    });

    console.log(eventLinks);

    /*  const eventLinks = await page.$$eval(linkSelector, (arr) =>
      arr.map((el) => el.href)
    ); */
  } catch (err) {
    console.log(err);
  }

  browser.close();
  return;
}

scrapeAllEvents(
  "https://touren-termine.adfc.de/suche?beginning=2022-06-29&eventType=Radtour&includeSubsidiary=true&unitKey=154"
);
