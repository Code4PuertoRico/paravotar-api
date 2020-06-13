import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";
import AWS from "aws-sdk";
import qs from "qs";
import axios from "axios";
import { parse } from "node-html-parser";

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
      executablePath,
    });

    const voterId = _.get(event, "queryStringParameters.voterId", null);

    if (!voterId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "invalid or missing voterId" }),
      };
    }
    
    const page = await browser.newPage();
    await page.goto(ceeUrl);

    await page.evaluate((n) => {
      (document.querySelector(
        'input[name="txtNumElectoral"]'
      ) as HTMLInputElement).value = n;
    }, voterId);

    await page.$eval('input[name="btnConsulta"]', (el) =>
      (el as HTMLInputElement).click()
    );

    await page.waitFor(2000);

    const rawData = await page.evaluate(() => {
      return Array.from(document.querySelector("#info").children)
        .reduce((acum, curr) => acum.concat(curr), [])
        .map((t) => t.innerText)
        .reduce(
          (acum, curr) => ({
            ...acum,
            [curr.split(":")[0]]: curr.split(":")[1].trim(),
          }),
          {}
        );
    });

    const data = Object.keys(rawData)
      .map((k) => ({
        [_.camelCase(k)]: rawData[k],
      }))
      .reduce((acum, curr) => {
        return {
          ...acum,
          ...curr,
        };
      }, {});

    const precintos = JSON.parse(
      (
        await S3.getObject({
          Bucket: bucket,
          Key: precintsFile,
          ResponseContentType: "application/json",
        }).promise()
      ).Body.toString()
    );

    const counties = JSON.parse(
      (
        await S3.getObject({
          Bucket: bucket,
          Key: countiesFile,
          ResponseContentType: "application/json",
        }).promise()
      ).Body.toString()
    );

    const papeletas = JSON.parse(
      (
        await S3.getObject({
          Bucket: bucket,
          Key: papeletasFile,
          ResponseContentType: "application/json",
        }).promise()
      ).Body.toString()
    );

    const p = _.get(precintos, data.precinto, null);

    let legislativo = p.papeleta.split("/");

    legislativo = `${folder}/${_.lowerCase(
      decodeURIComponent(
        legislativo[legislativo.length - 1].split(".").slice(0, -1).join(".")
      )
    )
      .split(" ")
      .join("-")}`;

    let municipal = counties[_.camelCase(p.pueblo)].split("/");

    municipal = `${folder}/${_.lowerCase(
      decodeURIComponent(
        municipal[municipal.length - 1].split(".").slice(0, -1).join(".")
      )
    )
      .split(" ")
      .join("-")}`;

    let estatal = papeletas[0].papeletaLink.split("/");

    estatal = `${folder}/${_.lowerCase(
      decodeURIComponent(
        estatal[estatal.length - 1].split(".").slice(0, -1).join(".")
      )
    )
      .split(" ")
      .join("-")}`;

    const payload = {
      ...data,
      pueblo: p.pueblo,
      papeletas: {
        legislativo,
        municipal,
        estatal,
      },
    };

    return {
      statusCode: 200,
      body: JSON.stringify(payload, null, 2),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};

export const getVoterStatus = middy(handler)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());

const getConsulta = async (event: any) => {
  try {
    const voterId = _.get(event, "queryStringParameters.voterId", null);

    if (!voterId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "invalid or missing voterId" }),
      };
    }

    const formURLFields = {
      __LASTFOCUS: "",
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      __VIEWSTATE:
        "/wEPDwUKLTc2MTgyNzkwOQ9kFgICAw9kFhgCAQ8WBB4HVmlzaWJsZWgeCWlubmVyaHRtbGVkAgkPDxYCHgRUZXh0BQc2MjgwMTI3ZGQCCw8PFgIfAgUDMDkxZGQCDQ8PFgIfAgUCMTdkZAIPDw8WAh8CBQIwMGRkAhEPDxYCHwIFATBkZAITDw8WAh8CBQEwZGQCFQ8PFgIfAgUGQWN0aXZvZGQCFw8PFgIfAgUKMTk5My0xMi0wNmRkAhkPDxYCHwIFIkFOVElHVUEgRVNDLiBUT03DgVMgVkVSQSBBWUFMQSAoQylkZAIbDw8WAh8CBTJDYWxlIFZpc3RhIEFsZWdyZQ0KU2VjdG9yIFJlY2lvDQpCby4gR3VhcmRhcnJheWENCmRkAh0PFgIeBXN0eWxlBRN2aXNpYmlsaXR5OnZpc2libGU7ZGQDx2mFW2+8WtZoHhPK5YX0xDjvIYo3+Ig0oxmnJtYyfA==",
      __VIEWSTATEGENERATOR: "D331ABD5",
      __EVENTVALIDATION:
        "/wEdAARI4r8pLoWjAaafYdmWTMsvl9GE8278cv5ov9KdHyz433R5BDbtDklKFpN5EFaQZ2XKDGwmTBj5Fh/jxJBlxFQPFq8A93fTSOdMKdXLd4aI92UDT4CMtaw0TGJ2frZ61L4=",
      txtNumElectoral: voterId,
    };

    const resp = await axios({
      method: "post",
      url: "http://consulta.ceepur.org",
      data: qs.stringify(formURLFields),
      headers: {
        "content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const root = parse(resp.data);

    const data = {
      numeroElectoral: voterId,
      precinto: root.querySelector("#lblPrecinto").text,
      unidad: root.querySelector("#lblUnidad").text,
      colegio: root.querySelector("#lblColegio").text,
      pagina: root.querySelector("#lblPagina").text,
      linea: root.querySelector("#lblLinea").text,
      estatus: root.querySelector("#lblStatus").text,
      fechaDeNacimiento: root.querySelector("#lblFechaNac")
        .text,
      centroDeVotacion: root.querySelector("#lblCentro")
        .text,
      direccion: root.querySelector("#lblDir").text,
    };

    const precintos = JSON.parse(
      (
        await S3.getObject({
          Bucket: bucket,
          Key: precintsFile,
          ResponseContentType: "application/json",
        }).promise()
      ).Body.toString()
    );

    const counties = JSON.parse(
      (
        await S3.getObject({
          Bucket: bucket,
          Key: countiesFile,
          ResponseContentType: "application/json",
        }).promise()
      ).Body.toString()
    );

    const papeletas = JSON.parse(
      (
        await S3.getObject({
          Bucket: bucket,
          Key: papeletasFile,
          ResponseContentType: "application/json",
        }).promise()
      ).Body.toString()
    );

    const p = _.get(precintos, data.precinto, null);

    let legislativo = p.papeleta.split("/");

    legislativo = `${folder}/${_.lowerCase(
      decodeURIComponent(
        legislativo[legislativo.length - 1].split(".").slice(0, -1).join(".")
      )
    )
      .split(" ")
      .join("-")}`;

    let municipal = counties[_.camelCase(p.pueblo)].split("/");

    municipal = `${folder}/${_.lowerCase(
      decodeURIComponent(
        municipal[municipal.length - 1].split(".").slice(0, -1).join(".")
      )
    )
      .split(" ")
      .join("-")}`;

    let estatal = papeletas[0].papeletaLink.split("/");

    estatal = `${folder}/${_.lowerCase(
      decodeURIComponent(
        estatal[estatal.length - 1].split(".").slice(0, -1).join(".")
      )
    )
      .split(" ")
      .join("-")}`;

    const payload = {
      ...data,
      pueblo: p.pueblo,
      papeletas: {
        legislativo,
        municipal,
        estatal,
      },
    };

    return {
      statusCode: 200,
      body: JSON.stringify(payload, null, 2),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
};

export const consulta = middy(getConsulta)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
