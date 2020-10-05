import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";
import qs from "qs";
import axios from "axios";
import { parse } from "node-html-parser";

const ceeUrl = "https://consulta.ceepur.org";

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

  return {
    statusCode: 200,
    body: JSON.stringify(data, null, 2),
  };
};

export const consulta = middy(getConsulta)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
