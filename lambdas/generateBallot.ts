import middy from "@middy/core";
import cors from "@middy/http-cors";
// import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";

import _ from "lodash";
import {nanoid} from 'nanoid';

import { S3, SQS } from './lib/aws';
import schedulePdfCleanUp from "./ballot-generator/schedule-pdf-clean-up";
import generateBallotPdf from './ballot-generator/generate-ballot-pdf';
import uploadBallot from './ballot-generator/upload-ballot';
import { BUCKET_NAME } from "./constants";

async function createTask(uuid: string, votes: string, ballotType: string, ballotPath: string) {
  return new Promise((resolve, reject) => {
    SQS.sendMessage({
      MessageBody: JSON.stringify({ uuid, votes, ballotPath, ballotType }),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/214416850928/GenerateBallotQueue'
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
    const ballotType = _.get(reqBody, "ballotType", null);
    const ballotPath = _.get(reqBody, "ballotPath", null);

    if (!votes || !ballotPath || !ballotType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "invalid or missing parameters" }),
      };
    }

    const uuid = nanoid();

    // Create SQS task.
    await createTask(uuid, votes, ballotType, ballotPath);

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
  const ballotType = _.get(body, "ballotType", null);
  const ballotPath = _.get(body, "ballotPath", null);

  console.log('Generating Ballot...')

  const pdf = await generateBallotPdf(votes, ballotType, ballotPath);
  
  console.log('Uploading Ballot...')
  
  const url = await uploadBallot({uuid, pdf});
  await schedulePdfCleanUp(uuid);

  console.log({ url })

  context.done(null);
}

export const generatePdfHandler = generatePdf

async function deletePdf(uuid: string) {
  return new Promise((resolve, reject) => {
    S3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: `${uuid}.pdf`
    }, (err) => {
      if (err) {
        return reject(err)
      }

      return resolve();
    })
  })
}

async function cleanUpPdf(event, context) {
  const record = event.Records[0];
  const body = JSON.parse(_.get(record, 'body', {}));
  const uuid = _.get(body, "uuid", null);

  await deletePdf(uuid);

  context.done(null);
}

export const cleanUpPdfHandler = cleanUpPdf;

