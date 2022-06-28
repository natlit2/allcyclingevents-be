const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
//const connectDB = require("../dbinit");
const moment = require("moment");

// startup puppeteer

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
    "#root > div > div.eds-structure__body > div > div > div > div.eds-fixed-bottom-bar-layout__content > div > main > div > div > section.search-base-screen__search-panel > div.search-results-panel-content > div > ul > li > div > div > div.search-event-card-rectangle-image > div > div > div > article > div.eds-event-card-content__content-container.eds-l-pad-right-4 > div > div > div.eds-event-card-content__primary-content > a";
  const eventLinks = await page.$$eval(linkSelector, (arr) =>
    arr.map((el) => el.href)
  );
  //console.log(`THE EVENTS LINKS ARE: ${eventLinks}`);

  //   //for each link in the array scrape the title, event img and event date
  for await (const eventLink of eventLinks) {
    console.log(`THIS IS THE EVENT LINK: ${eventLink}`);
    const eventPage = await browser.newPage();
    try {
      await eventPage.goto(eventLink);

      //scrape the title
      const [titleElement] = await eventPage.$x(
        "/html/body/main/div[1]/div[4]/div/div[1]/div/div[2]/div/div[2]/h1"
      );
      const txt = await titleElement.getProperty("textContent");
      const eventTitle = await txt.jsonValue();
      console.log(`THE EVENT TITLE IS: ${eventTitle}`);

      //       //here the scraper for the event date

      const [dateElement] = await eventPage.$x(
        "/html/body/main/div[1]/div[4]/div/div[2]/section[1]/div/div[1]/section[1]/div[2]/div[2]/time/p[1]"
      );
      const datetime = await dateElement.getProperty("textContent");
      const eventDate = await datetime.jsonValue();
      console.log(`THE EVENT DATE IS: ${eventDate}`);

      //format the evetn date! use moment?
      try {
        const formatedDate =
          moment(eventDate, "ddd.MMMM.DD.YYYY").format() !== "Invalid date"
            ? moment(eventDate, "ddd.MMMM.DD.YYYY").format()
            : moment(eventDate, "ddd.DD.MMMM.YYYY").format();

        console.log(`THE FORMATED DATE IS : ${formatedDate}`);
        // add 2 hours to the formated date to create the endDate
        const endDate = moment(formatedDate).add(2, "h");

        console.log("end:", endDate);

        //       //here the scraper for the event image

        const imglinkSelector =
          "#event-page > main > div.js-hidden-when-expired.event-listing.event-listing--has-image > div.g-grid.g-grid--page-margin-manual > div > div.listing-hero-details__main-container.fx--fade-in.fx--delay-4 > div > div.g-cell.g-cell-1-1.g-cell-lg-8-12.g-cell--no-gutters.listing-hero--image-container > div > picture > img";
        const imgLink = await eventPage.$eval(imglinkSelector, (el) => el.src);
        console.log(`IMAGE LINK IS: ${imgLink}`);

        // check if there is an event already in the DB title && date
        const found = await Event.findOne({
          title: eventTitle,
          start: formatedDate,
        });
        if (found) return console.log("Event already exists");

        // save the event link, title, imglink, and date intoa mongoose object and save to mongo
        const newEvent = await Event.create({
          title: eventTitle,
          start: formatedDate,
          end: endDate,
          link: eventLink,
          imgLink: imgLink,
        });

        console.log(`New event created with id ${newEvent._id}`);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }
  browser.close();
  return;
}

scrapeAllEvents("https://www.eventbrite.com/d/online/cycling/");
