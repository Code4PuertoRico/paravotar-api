import fs from 'fs';

import dotenv from 'dotenv';
import AWS from 'aws-sdk';

dotenv.config();

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'us-east-2',
});

const BUCKET_NAME = 'ballots';
// 3 minutes of ttl.
const TTL_IN_MS = 3 * 60 * 1000;

export default function uploadBallot(uuid: string) {
  let now = Date.now();
  let expiresIn = now + TTL_IN_MS;
  let ballot = fs.readFileSync(`./static/${uuid}.pdf`);
  let uploadConfig = {
    Bucket: BUCKET_NAME,
    Key: `${uuid}.pdf`,
    Body: ballot,
    Expires: new Date(expiresIn),
  };

  return new Promise((resolve, reject) => {
    S3.upload(uploadConfig, {}, err => {
      if (err) {
        return reject(err);
      }

      S3.getSignedUrl(
        'getObject',
        {
          Bucket: BUCKET_NAME,
          Key: `${uuid}.pdf`,
          Expires: 180,
        },
        (err, signedData) => {
          if (err) {
            return reject(err);
          }

          return resolve(signedData);
        }
      );
    });
  });
}
