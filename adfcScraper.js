const puppeteer = require("puppeteer");

async function scrapeEvent(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [titleElement] = await page.$x('//*[@id="content"]/div[4]/div[1]/a/h2');
  const txt = await titleElement.getProperty("textContent");
  const eventTitle = await txt.jsonValue();

  console.log({ eventTitle });

  browser.close();
}

scrapeEvent("http://adfc-berlin.de/aktiv-werden/bei-demonstrationen.html");
