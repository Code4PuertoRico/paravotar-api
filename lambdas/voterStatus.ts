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
      __EVENTTARGET: "",
      __EVENTARGUMENT: "",
      __VIEWSTATE:
        "j8e9Ob/a0bGuyuMpEyF8NXnyvV13igDM7a2M5Kq0eXZZ7GF2wZHN66rB9tUtHjzluJd29d5Nx/Q8xPSonfTaxJZ4Xc72qbuiuhDF9pZcxtHC0SomzwyVFIxd/SNz/YKx",
      __VIEWSTATEGENERATOR: "D331ABD5",
      __EVENTVALIDATION:
        "IcbJ6MBc2CH2sWiUW2edrQ5IKWiYYHDIPAMPZZZteP2OdYiVeH40S/UQTGXAG6mYxZol/GsBtqkeOKXVYFsY4xg7BUJjk31QN0/1HQwJUeHH7t+fRYXZKjWOFWelJO4h56mtJS4js8c80KnMY/eZomzavt+J4bWW4Q7HJagvkOwge/E/yjogoPO3xeh2yX8R/5H6A71WMzY1Y+ICAT2t3jfJWum3jOpWY0a/I7ZMDs9flYk/07f4kpNd/J00/Wo5SPEmATld062Jde3jleuKLfadz1oMXKvZG0yLcrFUnBgIs6sDhhuLgCaHCzUiJ2HtlpGnZr4dJL0jgvCJS2szA78BzGKn2xZaEOjfTxIEWo2ZXUohXJg9ACUqy+/qQQg3wQg4lcmkBVlvKC+GK7wy5g==",
      txtNumElectoral: voterId,
      btnConsulta: "Buscar",
      txtNumeroElectoral: "",
      txtFechaNacimiento: "",
      txtNombreEvento: "",
      txtFechaEvento: "",
      txtPrecinto: "",
      txtUnidad: "",
      txtColegio: "",
      txtEstatus: "",
      txtPagina: "",
      txtLinea: "",
      txtCentro: "",
      txtDireccion: "",
    };

    const resp = await axios({
      method: "post",
      url: "http://consulta.ceepur.org",
      data: qs.stringify(formURLFields),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const root = parse(resp.data);

    const data = {
      numeroElectoral: voterId,
      precinto: _.padStart(root.querySelector("#txtPrecinto").rawAttributes.value, 3, '0'),
      unidad: root.querySelector("#txtUnidad").rawAttributes.value,
      colegio: root.querySelector("#txtColegio").rawAttributes.value,
      pagina: root.querySelector("#txtPagina").rawAttributes.value,
      linea: root.querySelector("#txtLinea").rawAttributes.value,
      estatus: root.querySelector("#txtEstatus").rawAttributes.value,
      fechaDeNacimiento: root.querySelector("#txtFechaNacimiento").rawAttributes.value,
      centroDeVotacion: root.querySelector("#txtCentro").rawAttributes.value,
      direccion: root.querySelector("#txtDireccion").text,
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
