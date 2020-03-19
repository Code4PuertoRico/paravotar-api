import dotenv from 'dotenv';

dotenv.config();

export const OCR_API_KEY = process.env.OCR_API_KEY;

export const USE_OCR = process.env.USE_OCR === 'true';
