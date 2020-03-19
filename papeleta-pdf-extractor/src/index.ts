import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { OCR } from './ocr';
import { USE_OCR } from './settings';

const originalImage = path.resolve(__dirname, '../static/gov.jpg');

const N_COLUMNS = 7;
const CELL_WIDTH = 385;
const STARTING_X = 195;
const PERCENTAGE_DELTA = 0.01;

let c = 1;

const dir = 'output';

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

// const data = [];

const main = async () => {
  while (c <= N_COLUMNS) {
    const outputImage = path.resolve(__dirname, `../output/img-${c}.jpg`);
    const delta = (c - 1) * (CELL_WIDTH * PERCENTAGE_DELTA);
    const left = Math.trunc(STARTING_X + (c - 1) * CELL_WIDTH + delta);
    const right = Math.trunc(STARTING_X + c * CELL_WIDTH + delta);

    const buffer = await sharp(originalImage)
      .extract({ left, top: 365, width: right - left, height: 255 })
      .toBuffer();

    fs.writeFileSync(outputImage, buffer);

    if (USE_OCR) {

      const resp = await OCR(outputImage);

      const ocrText = resp.ParsedResults[0].ParsedText;

      console.log(ocrText);
    }

    let logoFilename = path.resolve(__dirname, `../output/logo-${c}.jpg`);

    if (c <= 4) {
      const logoBuffer = await sharp(originalImage)
        .extract({
          left: left + 130,
          top: 370,
          width: right - left - 265,
          height: 110,
        })
        .toBuffer();
      fs.writeFileSync(logoFilename, logoBuffer);
    } else {
      logoFilename = '';
    }

    c += 1;
  }
};

main();
