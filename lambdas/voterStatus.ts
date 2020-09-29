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

import config from './lib/aws';

const S3 = new AWS.S3(config);
const ceeUrl = "http://consulta.ceepur.org";
const bucket = "paravotar";

const precintsFile = "precints.json";
const countiesFile = "counties.json";
const papeletasFile = "papeletas.json";

const folder = "/papeletas/2016";

const getConsulta = async (event: any) => {
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
      "V2vPTtz9H36XXWyAe/vVVKT1wVVu5DwXGFTND5rDaC4hTm2monjkiL+lD4w/Ue8SD/MPrBJgwuaLtmIIsh07O5sBtSWpiigN3MDTG8tU4s0=",
    __VIEWSTATEGENERATOR: "669660C9",
    __EVENTVALIDATION:
      "Xhpss61UphBcy0HQqyx9jfoy9SimyMWMbZvqsD5l67Z47PpRx1lNDHhh3OKPVM1tw7s07hyIoCFKo2qK+avvhkz64z1hwfmdM/apTSgUsrl7ZJcv1pk9HfIKovrW5qN9sHhMHHsDw+BcVWoq6n+Li4Nr8kNiKehaa2J4uYsgMZ65SmDaoWX7pJrAuE52cYhhOSI8Lix60FckIc7Ud/fG/exBTLH9wHQRvhSv1T/ThVlbHLwYAZHbztNfpxy6+/UD9mWzsVmzmWhuQgW7AsuXww==",
    txtNumElectoral: voterId,
    btnConsulta: "Buscar",
    txtNumeroElectoral: "",
    txtFechaNacimiento: "",
    txtPrecinto: "",
    txtUnidad: "",
    txtEstatus: "",
  };

  let resp;

  try {
    resp = await axios({
      method: "post",
      url: ceeUrl,
      data: qs.stringify(formURLFields),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: "Failed to fetch from consulta.ceepur.org",
    };
  }

  const root = parse(resp.data);

  const data = {
    numeroElectoral: voterId,
    precinto: _.padStart(
      root.querySelector("#txtPrecinto").rawAttributes.value,
      3,
      "0"
    ),
    unidad: root.querySelector("#txtUnidad").rawAttributes.value,
    estatus: root.querySelector("#txtEstatus").rawAttributes.value,
    fechaDeNacimiento: root.querySelector("#txtFechaNacimiento").rawAttributes
      .value,
  };

  if (!data.precinto) {
    return {
      statusCode: 404,
      body: "Voter Id not found",
    };
  }

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

  if (!p) {
    return {
      statusCode: 400,
      body: "Unable to find ballots for precint " + data.precinto,
    };
  }

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
};

export const consulta = middy(getConsulta)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
