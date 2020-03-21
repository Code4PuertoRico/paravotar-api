const puppeteer = require("puppeteer");
const _ = require("lodash");

let ceeUrl = "http://consulta.ceepur.org";

const getVoterStatus = async voterNumber => {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(ceeUrl);

    await page.evaluate(n => {
      document.querySelector('input[name="txtNumElectoral"]').value = n;
    }, voterNumber);

    await page.$eval('input[name="btnConsulta"]', el => el.click());

    const rawData = await page.evaluate(() => {
      return Array.from(document.querySelector("#info").children)
        .reduce((acum, curr) => acum.concat(curr), [])
        .map(t => t.innerText)
        .reduce(
          (acum, curr) => ({
            ...acum,
            [curr.split(":")[0]]: curr.split(":")[1].trim()
          }),
          {}
        );
    });

    const data = Object.keys(rawData)
      .map(k => ({
        [_.camelCase(k)]: rawData[k]
      }))
      .reduce((acum, curr) => {
        return {
          ...acum,
          ...curr
        };
      }, {});

    return data;
  } catch (e) {
    console.log(e);
    process.exit();
  } finally {
    browser.close();
  }
};

getVoterStatus("6280140").then((result) => {
    console.log(JSON.stringify(result, null, 2))
});
