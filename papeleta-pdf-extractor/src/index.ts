import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { getOCRText } from './ocr';
import { USE_OCR } from './settings';
import { config } from './config/2020/arroyo/municipal';

const originalImage = path.resolve(__dirname, config.filePath);

const OUTPUT_DIR = path.resolve(__dirname, '../output');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
}

const { CELL_WIDTH, N_COLUMNS, PERCENTAGE_DELTA, STARTING_X, rows } = config;

const main = async () => {
  const data = [];

  for (let i = 0; i < rows.length; i++) {
    const rowData = [];
    let c = 1;
    const {
      MAIN_TOP,
      MAIN_HEIGHT,
      N_LOGO,
      LOGO_TOP,
      LOGO_HEIGHT,
      LOGO_LEFT_DELTA,
      LOGO_RIGHT_DELTA,
      IMAGE_NAME_PREFIX,
      hasLogos,
    } = rows[i];

    while (c <= N_COLUMNS) {
      const cell: { [key: string]: any } = {};
      const slicedImagePath = path.resolve(
        __dirname,
        `${OUTPUT_DIR}/${IMAGE_NAME_PREFIX}-img-${c}.jpg`
      );

      const delta = (c - 1) * (CELL_WIDTH * PERCENTAGE_DELTA);
      const left = Math.trunc(STARTING_X + (c - 1) * CELL_WIDTH + delta);
      const right = Math.trunc(STARTING_X + c * CELL_WIDTH + delta);

      const buffer = await sharp(originalImage)
        .extract({
          left,
          top: MAIN_TOP,
          width: right - left,
          height: MAIN_HEIGHT,
        })
        .toBuffer();

      fs.writeFileSync(slicedImagePath, buffer);

      cell.img = slicedImagePath;

      if (USE_OCR) {
        const resp = await getOCRText(slicedImagePath);

        const ocrText = resp.ParsedResults[0].ParsedText;

        cell.ocrResult = ocrText;
      }

      let logoFilePath = path.resolve(
        __dirname,
        `${OUTPUT_DIR}/${IMAGE_NAME_PREFIX}-logo-${c}.jpg`
      );

      if (hasLogos && c <= N_LOGO!) {
        const logoBuffer = await sharp(originalImage)
          .extract({
            left: left + LOGO_LEFT_DELTA!,
            top: LOGO_TOP!,
            width: right - left - LOGO_RIGHT_DELTA!,
            height: LOGO_HEIGHT!,
          })
          .toBuffer();
        fs.writeFileSync(logoFilePath, logoBuffer);

        cell.logoImg = logoFilePath;
      } else {
        logoFilePath = '';
      }

      rowData.push(cell);

      c += 1;
    }

    data.push(rowData);
  }

  console.log(JSON.stringify(data, null, 2));

  fs.writeFileSync(
    path.resolve(__dirname, `${OUTPUT_DIR}/data.json`),
    JSON.stringify(data, null, 2)
  );
};

main();
