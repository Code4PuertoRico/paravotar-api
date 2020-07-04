import middy from "@middy/core";
import cors from "@middy/http-cors";
// import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";

import generateBallotPdf from './ballot-generator/generate-ballot-pdf';
import uploadBallot from './ballot-generator/upload-ballot';

import _ from "lodash";
import AWS from "aws-sdk";
import dotenv from 'dotenv';
import {nanoid} from 'nanoid';

dotenv.config();

const SQS = new AWS.SQS({
  accessKeyId: process.env.PV_AWS_ACCESS_KEY,
  secretAccessKey: process.env.PV_AWS_SECRET_KEY,
  region: process.env.PV_AWS_REGION,
});

async function createTask(uuid: string, votes: string) {
  return new Promise((resolve, reject) => {
    SQS.sendMessage({
      MessageBody: JSON.stringify({ uuid, votes }),
      // TODO: Change for real queue url
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/952144174923/GenerateBallotQueue'
    }, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data)
    })
  })
}

const createBallotGenerationTask = async (event: any) => {
  try {
    const reqBody = JSON.parse(_.get(event, 'body', null));
    const votes = _.get(reqBody, "votes", null);

    if (!votes) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "invalid or missing votes" }),
      };
    }

    const uuid = nanoid();

    // Create SQS task.
    await createTask(uuid, votes);

    const payload = {
      uuid
    }

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

export const createBallotTask = middy(createBallotGenerationTask)
  .use(cors())
  .use(httpErrorHandler());

async function generatePdf(event, context) {
  const record = event.Records[0];
  const body = JSON.parse(_.get(record, 'body', {}));
  const uuid = _.get(body, "uuid", null);
  const votes = _.get(body, "votes", null);

  const pdf = await generateBallotPdf(votes);
  const url = await uploadBallot({uuid, pdf});

  console.log({ url })

  context.done(null, '');
}

export const generatePdfHandler = generatePdf

