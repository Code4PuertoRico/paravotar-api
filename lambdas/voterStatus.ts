import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpErrorHandler from '@middy/http-error-handler';
import AWS from 'aws-sdk';

const S3 = new AWS.S3();
const ceeUrl = "http://consulta.ceepur.org";
const bucket = "paravotar";

const precintsFile = "precints.json";
const countiesFile = "counties.json";
const papeletasFile = "papeletas.json";

const folder = "/papeletas/2016";

const handler = async (event: any) => {
  try {
    const executablePath = await chromium.executablePath;

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath
    });

    const voterId = _.get(event, "queryStringParameters.voterId", null);

    if (!voterId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'invalid or missing voterId' })
      };
    }

    const page = await browser.newPage();
    await page.goto(ceeUrl);

    await page.evaluate(n => {
      (document.querySelector('input[name="txtNumElectoral"]') as HTMLInputElement).value = n;
    }, voterId);

    await page.$eval('input[name="btnConsulta"]', el => (el as HTMLInputElement).click());

    await page.waitFor(2000);

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


    const precintos = JSON.parse((await S3.getObject({
      Bucket: bucket,
      Key: precintsFile,
      ResponseContentType: 'application/json'
    }).promise()).Body.toString());

    const counties = JSON.parse((await S3.getObject({
      Bucket: bucket,
      Key: countiesFile,
      ResponseContentType: 'application/json'
    }).promise()).Body.toString());

    const papeletas = JSON.parse((await S3.getObject({
      Bucket: bucket,
      Key: papeletasFile,
      ResponseContentType: 'application/json'
    }).promise()).Body.toString());

    const p = _.get(precintos, data.precinto, null);

    let legislativo = p.papeleta.split('/');

    legislativo = `${folder}/${_.lowerCase(decodeURIComponent(legislativo[legislativo.length - 1].split('.').slice(0, -1).join('.'))).split(' ').join('-')}`;

    let municipal = counties[_.camelCase(p.pueblo)].split('/');

    municipal = `${folder}/${_.lowerCase(decodeURIComponent(municipal[municipal.length - 1].split('.').slice(0, -1).join('.'))).split(' ').join('-')}`;

    let estatal = papeletas[0].papeletaLink.split('/');

    estatal = `${folder}/${_.lowerCase(decodeURIComponent(estatal[estatal.length - 1].split('.').slice(0, -1).join('.'))).split(' ').join('-')}`;

    const payload = {
      ...data,
      pueblo: p.pueblo,
      papeletas: {
        legislativo,
        municipal,
        estatal,
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify(payload, null, 2)
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e)
    };
  }
};

export const getVoterStatus = middy(handler)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
