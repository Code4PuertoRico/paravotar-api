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
      "BGvFZPW/ZrpJW4HvulQKH31khalXuIbgYAmkgebro4ljbcBdCvdMXWljuaXzj2k5bkoMyfEpayW3uEAJATwOw3G8b5+3/NL6vyA0nDleQLSqSQuuQuf2RXuDROpX2i+hu7HKslv5vNN+TkGjPoMlZCuh/XMd+JYado3AM8KMGXYSSJGDxm14PyOdqDYNiOSL3Lw3spRaBknkRsh98YQiwA==",
    __VIEWSTATEGENERATOR: "A8C19350",
    __EVENTVALIDATION:
      "JwfxcY2PLyT5nmWyR16oER+6nGyMFZf4qkHb90dzKTi/+qNMzuhIFPjX2cIj3dJ8gpQULRjf1Hcf1o1LB+7DcS9uvvhdT43r8ST4z9KyKkrBrCYalaR4qHQ4kOgiEkt72wzUxVsH+DV2wFBa4qg2xvzJIfBdPoSTMFFwhfLWXItQd2z3I72et+Q55zQFuaIp+usvtF2BPXTHuKkqW8ccSQ0qCOmUDEgnQz46Q1/hlv1W5njy6QmK5Q3YbULb9icoK5XWRIR57E0eL+/4egolJlxQrtzUQZoBLV5xolSyy79k2OtlET85cFGHc2bnUzbDbapW0KPod/7DROxmnAbTPLRXjyr6iOI92Z92yb0O7J3YvdGYAFGJP7ex5yt3HPGKeEOCCf5Cp46nYVlxqNwqPw==",
    btnConsulta: "Buscar",
    txtNumElectoral: voterId,
    txtNumeroElectoral: "",
    txtFechaNacimiento: "",
    txtEstatus: "",
    txtCategoria: "",
    txtPrecinto: "",
    txtUnidad: "",
    txtColegio: "",
    txtPagina: "",
    txtLinea: "",
    txtCentro: "",
    txtDireccion: "",
    txtFechaVotacion: "",
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
