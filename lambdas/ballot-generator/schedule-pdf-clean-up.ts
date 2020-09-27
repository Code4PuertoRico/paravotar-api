import AWS from 'aws-sdk'

import config from '../lib/aws';

const SQS = new AWS.SQS(config)

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
