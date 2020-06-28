import puppeteer from 'puppeteer';

// const BASE_URL = 'http://localhost:8000/generate-ballot';
const BASE_URL = 'https://paravotar.org/generate-ballot';

type GenerateBallotParams = {
  uuid: string;
  params: string;
};

export default async function generateBallotPdf({
  uuid,
  params,
}: GenerateBallotParams) {
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
