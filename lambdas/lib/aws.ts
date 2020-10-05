import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// AWS config singleton
export const S3 = new AWS.S3({
  accessKeyId: process.env.PV_AWS_ACCESS_KEY,
  secretAccessKey: process.env.PV_AWS_SECRET_KEY,
})
