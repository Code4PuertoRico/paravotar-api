import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

// AWS config singleton
export default new AWS.Config({
  credentials: new AWS.Credentials({
    accessKeyId: process.env.PV_AWS_ACCESS_KEY,
    secretAccessKey: process.env.PV_AWS_SECRET_KEY,
  }),
  region: process.env.PV_AWS_REGION,
})
