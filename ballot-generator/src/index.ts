import puppeteer from 'puppeteer';

// const BASE_URL = 'http://localhost:8000/generate-ballot';
const BASE_URL = 'https://paravotar.org/generate-ballot';

type BallotScreenshotParams = {
  uuid: string;
  params: string;
};

async function BallotScreenshot({ uuid, params }: BallotScreenshotParams) {
  try {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();

    // Consider the page to be loaded after 500ms without any network requests.
    await page.goto(`${BASE_URL}?${params}`, { waitUntil: 'networkidle0' });
    await page.waitFor('[data-state="success"]');

    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.evaluate(() => {
      let container = document.querySelector('[data-state="success"]');

      if (container) {
        let ballot = container.children[0];

        return {
          width: ballot.clientWidth,
        };
      }

      return { width: 2200 };
    });

    await page.pdf({
      path: `static/${uuid}.pdf`,
      printBackground: true,
      width: `${dimensions.width}px`,
    });

    await browser.close();
  } catch (err) {
    console.log(err);
  }
}

const uuid = '123';
const params =
  'ballotType=estatal&ballotPath=%2Fpapeletas%2F2016%2Fgobernador-y-comisionado-residente&votes=%5B%7B%22column%22%3A2%2C%22row%22%3A2%7D%2C%7B%22column%22%3A1%2C%22row%22%3A4%7D%2C%7B%22column%22%3A0%2C%22row%22%3A0%7D%5D';

BallotScreenshot({ uuid, params });
