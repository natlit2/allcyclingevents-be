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

  //////scrape the link to the event

  // // to get all links on the page
  // const selector = "a.item-link";
  // const eventLinks = await page.$$eval(selector, (am) =>
  //   am.filter((e) => e.href).map((e) => e.href)
  // );
  //console.log(`ALL LINKS: ${eventLinks}`);

  ////to get 1 specific link
  const selector = "a.item-link";
  const eventLink = await page.$eval(selector, (el) => el.href);
  console.log(`the event link is: ${eventLink}`);

  //for await (const eventLink of eventLinks) {
  console.log(`THIS IS THE EVENT LINK: ${eventLink}`);
  const eventPage = await browser.newPage();
  try {
    await eventPage.goto(eventLink);

    ///////////////////////////////////////uncomment below
    //scrape the title
    const [titleElement] = await page.$x(
      '//*[@id="content"]/div[4]/div[1]/a/h2'
    );

    const txt = await titleElement.getProperty("textContent");
    const eventTitle = await txt.jsonValue();

    console.log(`the event title is: ${eventTitle}`);

    //saving the data in mongo
    await Event.create({
      title: eventTitle,
      date: eventDate,
      link: eventLink,
      imgLink: imgLink,
    });
  } catch (err) {
    console.log("the page did NOT load");
  }
  browser.close();
  //for loop closer}
}
scrapeEvent("http://adfc-berlin.de/aktiv-werden/bei-demonstrationen.html");
