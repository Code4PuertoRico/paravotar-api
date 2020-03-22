const fs = require('fs');
const path = require('path');
const puppeteer = require("puppeteer");

const ceeUrlPage1 =
  "http://ww2.ceepur.org/es-pr/Eventos%20Electorales/Paginas/Papeletas-Modelo---Elecciones-Generales-2016.aspx";

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.goto(ceeUrlPage1);

    const page1Data = await page.evaluate(async () => {
      const data = [];

      function delay(time) {
        return new Promise(function(resolve) {
          setTimeout(resolve, time);
        });
      }

      // Open all drop downs
      const rows = Array.from(
        document.querySelector("#onetidDoclibViewTbl0").children
      );

      for (let j = 0; j < rows.length; j++) {
        const el = rows[j];
        if (el && el.innerText.includes(":")) {
          el.querySelector("a").click();
        }
        await delay(500);
      }

      const list = Array.from(
        document.querySelector("#onetidDoclibViewTbl0").children
      ).filter(e => e && !e.innerText.includes(":"));

      const gobernadorYComisionado = {
        text: list[2].querySelector("tr").innerText,
        papeletaLink: list[2].querySelector("tr").querySelector("a").href
      };

      data.push(gobernadorYComisionado);

      for (let i = 3; i < list.length; i++) {
        const municipal = Array.from(list[i].querySelectorAll("tr")).filter(
          e => e && e.innerText.includes("Municipal")
        )[0];

        const pueblo =
          municipal && municipal.innerText.replace("Municipal", "").trim();
        const municipalLink = municipal && municipal.querySelector("a").href;

        const legis = Array.from(list[i].querySelectorAll("tr")).filter(
          e => e && e.innerText.includes("Legislativa")
        );

        const legislativas = legis.map(e => {
          return {
            precinto:
              e &&
              e.innerText
                .replace("Legislativa", '')
                .replace(pueblo, '')
                .trim(),
            papeletaLink: e && e.querySelector("a").href
          };
        });

        data.push({
          pueblo,
          municipalLink,
          legislativas
        });

      }

      return data;
    });

    await page.click('img[alt="Siguiente"]');

    const page2Data = await page.evaluate(async () => {

      const data = [];

      function delay(time) {
        return new Promise(function(resolve) {
          setTimeout(resolve, time);
        });
      }

      await delay(2000);

      // Open all drop downs
      const rows = Array.from(
        document.querySelector("#onetidDoclibViewTbl0").children
      );

      for (let j = 0; j < rows.length; j++) {
        const el = rows[j];
        if (el && el.innerText.includes(":")) {
          el.querySelector("a").click();
        }
        await delay(500);
      }

      const list = Array.from(
        document.querySelector("#onetidDoclibViewTbl0").children
      ).filter(e => e && !e.innerText.includes(":"));

      for (let i = 0; i < list.length; i++) {
        const municipal = Array.from(list[i].querySelectorAll("tr")).filter(
          e => e && e.innerText.includes("Municipal")
        )[0];

        const pueblo =
          municipal && municipal.innerText.replace("Municipal", "").trim();
        const municipalLink = municipal && municipal.querySelector("a").href;

        const legis = Array.from(list[i].querySelectorAll("tr")).filter(
          e => e && e.innerText.includes("Legislativa")
        );

        const legislativas = legis.map(e => {
          return {
            precinto:
              e &&
              e.innerText
                .replace("Legislativa", '')
                .replace(pueblo, '')
                .trim(),
            papeletaLink: e && e.querySelector("a").href
          };
        });

        data.push({
          pueblo,
          municipalLink,
          legislativas
        });

      }
      return data;
    });

    await page.click('img[alt="Siguiente"]');

    const page3Data = await page.evaluate(async () => {

      const data = [];

      function delay(time) {
        return new Promise(function(resolve) {
          setTimeout(resolve, time);
        });
      }

      await delay(2000);

      // Open all drop downs
      const rows = Array.from(
        document.querySelector("#onetidDoclibViewTbl0").children
      );

      for (let j = 0; j < rows.length; j++) {
        const el = rows[j];
        if (el && el.innerText.includes(":")) {
          el.querySelector("a").click();
        }
        await delay(500);
      }

      const list = Array.from(
        document.querySelector("#onetidDoclibViewTbl0").children
      ).filter(e => e && !e.innerText.includes(":"));

      for (let i = 0; i < list.length; i++) {
        const municipal = Array.from(list[i].querySelectorAll("tr")).filter(
          e => e && e.innerText.includes("Municipal")
        )[0];

        const pueblo =
          municipal && municipal.innerText.replace("Municipal", "").trim();
        const municipalLink = municipal && municipal.querySelector("a").href;

        const legis = Array.from(list[i].querySelectorAll("tr")).filter(
          e => e && e.innerText.includes("Legislativa")
        );

        const legislativas = legis.map(e => {
          return {
            precinto:
              e &&
              e.innerText
                .replace("Legislativa", '')
                .replace(pueblo, '')
                .trim(),
            papeletaLink: e && e.querySelector("a").href
          };
        });

        data.push({
          pueblo,
          municipalLink,
          legislativas
        });

      }
      return data;
    });

    const data = page1Data.concat(page2Data).concat(page3Data);

    const OUTPUT_DIR = path.resolve(__dirname, '../output');

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFileSync(path.resolve(__dirname, `../output/papeletas.json`), JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(e);
    process.exit();
  } finally {
    browser.close();
  }
};

main();
