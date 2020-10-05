import { BUCKET_NAME } from "../constants";
import { S3 } from '../lib/aws';

// 3 minutes of ttl.
const TTL_IN_MS = 3 * 60 * 1000;

type UploadBallotsParams = {uuid: string, pdf: Buffer};

export default function uploadBallot({uuid, pdf}: UploadBallotsParams) {
  let now = Date.now();
  let expiresIn = now + TTL_IN_MS;
  let uploadConfig = {
    Bucket: BUCKET_NAME,
    Key: `${uuid}.pdf`,
    Body: pdf,
    Expires: new Date(expiresIn),
  };

  return new Promise((resolve, reject) => {
    S3.upload(uploadConfig, {}, err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}
