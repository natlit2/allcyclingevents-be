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

  //for each link in the array scrape the title, event img and event date
  for await (const eventLink of eventLinks) {
    console.log(`THIS IS THE EVENT LINK: ${eventLink}`);
    const eventPage = await browser.newPage();
    try {
      await eventPage.goto(eventLink);

      //scrape the title
      const [titleElement] = await eventPage.$x(
        '//*[@id="events-detail"]/div/div/div[1]/div[1]/div/div/div[1]/h2'
        //add error if page not returned
      ); //else do the below code
      const txt = await titleElement.getProperty("textContent");
      const eventTitle = await txt.jsonValue();
      console.log(`THE EVENT TITLE IS: ${eventTitle}`);

      //add here the scraper for the event date

      const [dateElement] = await eventPage.$x(
        '//*[@id="events-detail"]/div/div/div[1]/div[1]/div/div/div[1]/p/time'
      );
      const datetime = await dateElement.getProperty("textContent");
      const eventDate = await datetime.jsonValue();
      console.log(`THE EVENT DATE IS: ${eventDate}`);

      //add here the scraper for the event image

      const imglinkSelector =
        "#events-detail > div > div > div.col-xs-12.mod_eventreader.block > div.event.layout_full.block > figure > img";
      const imgLink = await eventPage.$eval(imglinkSelector, (el) => el.src);
      console.log(`IMAGE LINK IS: ${imgLink}`);

      await Event.create({
        // title: txt,
        title: eventTitle,
        date: eventDate,
        link: eventLink,
        imgLink: imgLink,
      });
    } catch (err) {
      console.log("the page did NOT load");
    }
  }
  // save the event link, title, imglink, and date intoa mongoose object and save to mongo

  browser.close();
}
scrapeAllEvents("https://www.mellowpark.de/events.html");
