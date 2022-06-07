const puppeteer = require("puppeteer");

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

  browser.close();
}

scrapeEvent("http://criticalmass-berlin.org/");
