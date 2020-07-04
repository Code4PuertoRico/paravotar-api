import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const SQS = new AWS.SQS({
  accessKeyId: process.env.PV_AWS_ACCESS_KEY,
  secretAccessKey: process.env.PV_AWS_SECRET_KEY,
  region: process.env.PV_AWS_REGION,
})

export default async function schedulePdfCleanUp(uuid: string) {
  return new Promise((resolve, reject) => {
    SQS.sendMessage({
      MessageBody: JSON.stringify({ uuid }),
      // TODO: Change for real queue url
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/952144174923/BallotCleanUpQueue',
      DelaySeconds: 180 // Wait 3 minutes before processing
    }, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data)
    })
  })
}
