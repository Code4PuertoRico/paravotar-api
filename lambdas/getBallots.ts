import _ from "lodash";
import middy from "@middy/core";
import cors from "@middy/http-cors";
import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";
import { S3 } from "./lib/aws";

const bucket = "paravotar";

const folder = "/papeletas/2020";

const getBallotsByTown = async (event: any) => {
  const townId = _.get(event, "queryStringParameters.townId", null);

  if (!townId) {
    return {
      statusCode: 404,
      body: "Voter Id not found",
    };
  }

  const folders = await S3.listObjectsV2({
    Bucket: bucket,
    MaxKeys: 200,
    Delimiter: "/",
    Prefix: folder,
  }).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(folders, null, 2),
  }

};

export const ballotsByTown = middy(getBallotsByTown)
  .use(cors())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler());
