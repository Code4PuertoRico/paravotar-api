import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";
import { S3 } from "./lib/aws";

const bucket = "paravotar";

const folder = "papeletas/2020/";

const constructCDNUrl = (suffix: string) => {
  return `https://cdn.paravotar.org/${suffix}`;
};

const getBallotsByTown = async (event: any) => {
  const townId = _.get(event, "queryStringParameters.townId", null);

  if (!townId) {
    return {
      statusCode: 404,
      body: "Town Id not found",
    };
  }

  try {
    const resp = await S3.listObjectsV2({
      Bucket: bucket,
      MaxKeys: 200,
      Delimiter: "/",
      Prefix: folder,
    }).promise();

    const municipality = resp.CommonPrefixes.filter(({ Prefix }) =>
      Prefix.endsWith(`${townId}/`)
    );

    if (municipality.length === 0) {
      return {
        statusCode: 404,
        body: "Town Id not found",
      };
    }

    const state = resp.CommonPrefixes.filter(({ Prefix }) =>
      Prefix.endsWith("estatal/")
    )[0];
    const legislatives = resp.CommonPrefixes.filter(({ Prefix }) =>
      Prefix.includes(`${townId}-legislativa`)
    );

    const response = {
      estatal: state.Prefix,
      municipal: municipality[0].Prefix,
      legislativas: legislatives.map(({ Prefix }) => Prefix),
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response, null, 2),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

export const ballotsByTown = middy(getBallotsByTown)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());

const getBallotsByPrecint = async (event: any) => {
  const precintId = _.get(event, "queryStringParameters.precintId", null);

  if (!precintId) {
    return {
      statusCode: 404,
      body: "Precint Id not found",
    };
  }

  try {
    const resp = await S3.listObjectsV2({
      Bucket: bucket,
      MaxKeys: 200,
      Delimiter: "/",
      Prefix: folder,
    }).promise();

    const legislative = resp.CommonPrefixes.filter(({ Prefix }) =>
      Prefix.endsWith(`${precintId}/`)
    );

    if (legislative.length === 0) {
      return {
        statusCode: 404,
        body: "Precint Id not found",
      };
    }

    const state = resp.CommonPrefixes.filter(({ Prefix }) =>
      Prefix.endsWith("estatal/")
    )[0];

    const parts = legislative[0].Prefix.split('/');
    const name = parts[parts.length - 2].split('-')

    const townId = name.length > 3 ? name.slice(0, 2).join('-') : name[0]
    
    const municipality = resp.CommonPrefixes.filter(({ Prefix }) =>
      Prefix.endsWith(`${townId}/`)
    );
    

    const response = {
      estatal: state.Prefix,
      municipal: municipality[0].Prefix,
      legislativa: legislative[0].Prefix,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(response, null, 2),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

export const ballotsByPrecint = middy(getBallotsByPrecint)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());


  const getAllBallots = async (event: any) => {
  
    try {
      const resp = await S3.listObjectsV2({
        Bucket: bucket,
        MaxKeys: 200,
        Delimiter: "/",
        Prefix: folder,
      }).promise();
  
      const response = resp.CommonPrefixes.map(({ Prefix }) => Prefix);
  
      return {
        statusCode: 200,
        body: JSON.stringify(response, null, 2),
      };
    } catch (e) {
      console.log(e);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  };
  
  export const allBallots = middy(getAllBallots)
    .use(cors())
    .use(doNotWaitForEmptyEventLoop())
    .use(httpErrorHandler());
  