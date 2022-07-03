const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");
const moment = require("moment");
const document = require("puppeteer");
// startup puppeteer

async function scrapeAllEvents(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector(".list-group", { visible: true });
    const eventLinks = await page.evaluate(() => {
      const listGroup = document.querySelectorAll(".list-group a");
      console.log(listGroup);
      let links = [];
      for (const link of listGroup) {
        links.push(link.getAttribute("href"));
      }
      return links;
    });

    //console.log(eventLinks);

    for await (const eventLink of eventLinks) {
      const baseURL = "https://touren-termine.adfc.de";
      const fullEventLink = baseURL + eventLink;
      const eventPage = await browser.newPage();
      console.log(`Full Event Link: ${fullEventLink}`);
      await eventPage.goto(fullEventLink);

      //scrape the title
      await eventPage.waitForSelector("h1", {
        timeout: 10000,
      });
      const titleEl = await eventPage.evaluate(() => {
        const selectTitleEl = document.querySelector("h1").innerText;
        return selectTitleEl;
      });
      console.log(`THE EVENT TILTE IS: ${titleEl}`);

      const dateElement = await eventPage.evaluate(() => {
        const selectDateElement = document.querySelectorAll("dd")[1].innerText;
        return selectDateElement;
      });
      console.log(`The Event Date is: ${dateElement}`);

      //Make sure to parse and reformat the date before saving to the DB
      //get the date from the Event element take only what you need and reformat it with moment
      // Destructure date here
      //Split the date
      const destructuredDateArr = dateElement.split(". ");
      const destDateArrStartTime = destructuredDateArr[2].split(" - ");
      //console.log(`the destructured date is: ${destructuredDateArr}`);
      //console.log(`date startTime: ${destDateArrStartTime[0]}`);
      const dateToFormat =
        destructuredDateArr[1] + " " + destDateArrStartTime[0];
      //console.log(`this is the date to format:  ${dateToFormat}`);
      //extract the date from the title
      //take the last item in the array(the date) save to a variable and pass it to the date formater
      //const eventDayDate = destructuredDateArr[1];
      //console.log(eventDayDate);
      //const eventMntYrTymDate = destructuredDateArr[2];
      //console.log(eventMntYrTymDate);

      //reformat the date here

      //format the evetn date! use moment?

      const formatedDate =
        moment(dateToFormat, "DD.MMMM.YYYY HH:mm").format() !== "Invalid date"
          ? moment(dateToFormat, "DD.MMMM.YYYY HH:mm").format()
          : moment(dateToFormat, "DD.MMMM.YYYY HH:mm").format();

      console.log(`THE FORMATED DATE IS : ${formatedDate}`);
      // add 2 hours to the formated date to create the endDate
      const endDate = moment(formatedDate).add(2, "h");

      console.log("end:", endDate);

      //scrape the image links from the main events page the same way as the links
      await eventPage.waitForSelector("img.pswp__img", { visible: true });
      await eventPage.screenshot({ path: "1.png" });
      const imgElement = await eventPage.evaluate(() => {
        const selectImgElement = document.querySelectorAll("img.pswp__img");
        const imgUrls = Array.from(selectImgElement).map((v) => v.src);
        return imgUrls[0];
      });
      console.log(`THIS IS THE IMAGE URL: ${imgElement}`);

      // check if there is an event already in the DB title && date
      const found = await Event.findOne({
        title: titleEl,
        start: formatedDate,
      });
      if (found) return console.log("Event already exists");

      // save the event link, title, imglink, and date intoa mongoose object and save to mongo
      const newEvent = await Event.create({
        title: titleEl,
        start: formatedDate,
        end: endDate,
        link: fullEventLink,
        imgLink: imgElement,
      });

      console.log(`New event created with id ${newEvent._id}`);
    }
  } catch (err) {
    console.log(err);
  }

  browser.close();
  return;
}

scrapeAllEvents(
  "https://touren-termine.adfc.de/suche?beginning=2022-06-29&eventType=Radtour&includeSubsidiary=true&unitKey=154"
);
