import middy from "@middy/core";
import cors from "@middy/http-cors";
// import doNotWaitForEmptyEventLoop from "@middy/do-not-wait-for-empty-event-loop";
import httpErrorHandler from "@middy/http-error-handler";

import _ from "lodash";
import AWS from "aws-sdk";
import {nanoid} from 'nanoid';

const SQS = new AWS.SQS();

async function createTask(id: string, votes: string) {
  return new Promise((resolve, reject) => {
    SQS.sendMessage({
      MessageBody: JSON.stringify({ id, votes }),
      // TODO: Create SQS task in AWS.
      QueueUrl: ''
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

    const taskId = nanoid();
    const payload = {
      taskId
    }

    // Create SQS task.
    await createTask(taskId, votes);

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
