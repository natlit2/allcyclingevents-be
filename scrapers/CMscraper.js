const puppeteer = require("puppeteer");
const Event = require("../models/eventModel");
const connectDB = require("../dbinit");
const moment = require("moment");

async function scrapeEvent(url) {
  connectDB();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector(".container", { visible: true });
    await page.screenshot({ path: "cm.png" });
    console.log("the page is up");

    ////to get 1 specific link
    const linkSelector = await page.waitForXPath(
      "/html/body/div[3]/div[2]/div[2]/div[2]/div/div/div[2]/div[1]/div/div/a"
    );
    const eventLink = await linkSelector.getProperty("href");
    const link = await eventLink.toString();
    console.log(`the event link: ${link}`);

    // const Urls = Array.from(eventLink).map((el) => el.href);
    // console.log(`the event link is: ${Urls}`);

    //scrape the image link
    const imglinkSelector =
      "body > div:nth-child(4) > div:nth-child(3) > div.col-md-9 > div:nth-child(3) > div > div:nth-child(7) > div > a > img";
    const imgLink = await page.$eval(imglinkSelector, (el) => el.src);
    console.log(`IMAGE LINK IS: ${imgLink}`);

    //scrape the date element
    const [dateElement] = await page.$x(
      "/html/body/div[3]/div[2]/div[2]/div[2]/div/div/div[2]/div[2]/div[1]/dl/dd"
    );
    const datetime = await dateElement.getProperty("textContent");
    const eventDate = await datetime.jsonValue();
    console.log(`THE EVENT DATE IS: ${eventDate}`);

    // //format the date

    // const formatDate = (str) => {
    //   const toArr = str.split(".");
    //   return `${toArr[2]}-${toArr[1]}-${toArr[0].replace(".", "")}`;
    // };

    //format the evetn date! use moment?
    const formatedDate = moment(eventDate, "DD.MM.YYYY").format();
    console.log(`THE FORMATED DATE IS : ${formatedDate}`);

    // // add 2 hours to the formated date to create the endDate
    const endDate = moment(formatedDate).add(2, "h");

    console.log("end:", endDate);

    //for await (const eventLink of eventLinks) {

    //scrape the title
    const [titleElement] = await page.$x(
      "/html/body/div[3]/div[2]/div[2]/div[2]/div/div/div[2]/div[1]/div/div/a/h3/text()"
    );
    const txt = await titleElement.getProperty("textContent");
    const eventTitle = await txt.jsonValue();

    console.log(`THE EVENT TITLE IS: ${eventTitle}`);

    // // check if there is an event already in the DB title && date
    const found = await Event.findOne({
      title: eventTitle,
      start: formatedDate,
    });
    if (found) return console.log("Event already exists");

    const newEvent = await Event.create({
      title: eventTitle,
      start: formatedDate,
      end: endDate,
      link: link,
      imgLink: imgLink,
    });
    console.log(`New event created with id ${newEvent._id}`);
  } catch (err) {
    console.log(`Oooops...there was an Error on the event page: ${err}`);
  }
  browser.close();
  //return;
}
scrapeEvent("https://criticalmass.in/berlin/");
