const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
//const connectDB = require("../dbinit");

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
    "#events > div > div > div.mod_eventlist.col-xs-12.block > div > div > div.teaser > p.more > a";
  const eventLinks = await page.$$eval(linkSelector, (arr) =>
    arr.map((el) => el.href)
  );
  // console.log(`THE EVENTS LINKS ARE: ${eventLinks}`);

  //for each link in the array scrape the title, event img and event date
  for await (const eventLink of eventLinks) {
    console.log(`THIS IS THE EVENT LINK: ${eventLink}`);
    const eventPage = await browser.newPage();
    try {
      await eventPage.goto(eventLink);

      //scrape the title
      const [titleElement] = await eventPage.$x(
        '//*[@id="events-detail"]/div/div/div[1]/div[1]/div/div/div[1]/h2'
      );
      const txt = await titleElement.getProperty("textContent");
      const eventTitle = await txt.jsonValue();
      console.log(`THE EVENT TITLE IS: ${eventTitle}`);

      //here the scraper for the event date

      const [dateElement] = await eventPage.$x(
        '//*[@id="events-detail"]/div/div/div[1]/div[1]/div/div/div[1]/p/time'
      );
      const datetime = await dateElement.getProperty("textContent");
      const eventDate = await datetime.jsonValue();
      console.log(`THE EVENT DATE IS: ${eventDate}`);

      //here the scraper for the event image

      const imglinkSelector =
        "#events-detail > div > div > div.col-xs-12.mod_eventreader.block > div.event.layout_full.block > figure > img";
      const imgLink = await eventPage.$eval(imglinkSelector, (el) => el.src);
      console.log(`IMAGE LINK IS: ${imgLink}`);

      const formatDate = (str) => {
        const toArr = str.split(" ");
        let month;
        switch (toArr[1]) {
          case "Jan":
            month = "01";
            break;
          case "Feb":
            month = "02";
            break;
          case "Mär":
            month = "03";
            break;
          case "Apr":
            month = "04";
            break;
          case "Mai":
            month = "05";
            break;
          case "Jun":
            month = "06";
            break;
          case "Jul":
            month = "07";
            break;
          case "Aug":
            month = "08";
            break;
          case "Sep":
            month = "09";
            break;
          case "Okt":
            month = "10";
            break;
          case "Nov":
            month = "11";
            break;
          case "Dez":
            month = "12";
            break;
          default:
            break;
        }
        return `${toArr[2]}-${month}-${toArr[0].replace(".", "")}`;
      };

      const startDate = new Date(
        eventDate.includes("–")
          ? formatDate(eventDate.substring(0, eventDate.indexOf("–")))
          : formatDate(eventDate)
      );

      const endDate = new Date(
        eventDate.includes("–")
          ? formatDate(
              eventDate
                .substring(eventDate.indexOf("–") + 1, eventDate.length)
                .trim()
            )
          : new Date(startDate).setHours(startDate.getHours() + 2)
      );

      console.log("start:", startDate);
      console.log("end:", endDate);

      // check if there is an event already in the DB title && date
      const found = await Event.findOne({
        title: eventTitle,
        start: startDate,
      });
      if (found) return console.log("Event already exists");

      // save the event link, title, imglink, and date intoa mongoose object and save to mongo
      const newEvent = await Event.create({
        title: eventTitle,
        start: startDate,
        end: endDate,
        link: eventLink,
        imgLink: imgLink,
      });
      console.log(`New event created with id ${newEvent._id}`);
    } catch (err) {
      console.log(err);
    }
  }
  browser.close();
  return;
}
scrapeAllEvents("https://www.mellowpark.de/events.html");
