import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';
import { OCR_API_KEY } from './settings';

export const getOCRText = (
  filename: string,
  overlay = false,
  apiKey = OCR_API_KEY,
  language = 'spa'
) => {
  const form = new FormData();

  form.append(
    'file',
    fs.readFileSync(path.resolve(__dirname, filename)),
    'slice.jpg'
  );
  form.append('language', language);
  form.append('isOverlayRequired', `${overlay}`);

  return fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      ...form.getHeaders(),
      apikey: apiKey,
    },
    body: form,
  }).then(res => res.json())
  .catch(e => console.log(e));
};
