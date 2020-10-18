import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";
import { S3 } from "./lib/aws";

const bucket = "paravotar";

const fileName = "centros-de-votacion.json"

const getVoterCenter = async (event: any) => {
  const unidad = _.get(event, "queryStringParameters.unidad", null);
  const precinto = _.get(event, "queryStringParameters.precinto", null);

  if (!unidad || !precinto) {
    return {
      statusCode: 400,
      body: "Missing parameters",
    };
  }

  try {
    const resp = await S3.getObject({
      Bucket: bucket,
      Key: fileName
    }).promise();

    const data = JSON.parse(resp.Body.toString());

    const center = data.find(d => d.Pre === parseInt(precinto, 10) && d.UE === parseInt(unidad, 10))

    if (!center) {
        return {
            statusCode: 404,
            body: "Center not found",
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(center, null, 2),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

export const voterCenter = middy(getVoterCenter)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
