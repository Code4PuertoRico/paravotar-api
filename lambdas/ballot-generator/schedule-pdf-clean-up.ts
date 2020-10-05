import AWS from 'aws-sdk'

import { SQS } from '../lib/aws';

export default async function schedulePdfCleanUp(uuid: string) {
  return new Promise((resolve, reject) => {
    SQS.sendMessage({
      MessageBody: JSON.stringify({ uuid }),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/214416850928/BallotCleanUpQueue',
      DelaySeconds: 180 // Wait 3 minutes before processing
    }, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data)
    })
  })
}
