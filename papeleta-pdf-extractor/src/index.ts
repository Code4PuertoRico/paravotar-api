import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { getOCRText } from './ocr';
import { USE_OCR } from './settings';
// import { config } from './config/2020/luquillo/100-legislativa';
import { getConfigLegislative, ConfigType } from './config/2020';

const municipio = '';
const precinto = '';

const config = getConfigLegislative(
  ConfigType.Legislative,
  municipio,
  precinto
);

const originalImage = path.resolve(__dirname, config.filePath);

const OUTPUT_DIR = path.resolve(
  __dirname,
  `../output/${config.outputRootFolder}`
);
const IMAGE_OUTPUT_DIR = path.resolve(
  __dirname,
  `../output/${config.outputRootFolder}/images`
);
console.log('Validating output folders.');
if (!fs.existsSync(OUTPUT_DIR)) {
  console.log(`Creating ${OUTPUT_DIR}`);
  fs.mkdirSync(OUTPUT_DIR);
}
if (!fs.existsSync(IMAGE_OUTPUT_DIR)) {
  console.log(`Creating ${IMAGE_OUTPUT_DIR}`);
  fs.mkdirSync(IMAGE_OUTPUT_DIR);
}

const { CELL_WIDTH, N_COLUMNS, PERCENTAGE_DELTA, STARTING_X, rows } = config;

const main = async () => {
  const data = [];

  console.log(`Processing ${path.basename(originalImage)}`);
  console.log(
    `Rows to process: ${rows.length}, Columns to process: ${N_COLUMNS}`
  );

  for (let i = 0; i < rows.length; i++) {
    console.log(`Processing row ${i} of ${rows.length}`);

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
      console.log(`Processing column ${c} of ${N_COLUMNS}`);

      const cell: { [key: string]: any } = {};
      const slicedImagePath = path.resolve(
        __dirname,
        `${IMAGE_OUTPUT_DIR}/${IMAGE_NAME_PREFIX}-img-${c}.jpg`
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
        console.log(`Waiting on OCR for ${path.basename(slicedImagePath)}`);

        const resp = await getOCRText(slicedImagePath);

        console.log('OCR done.');

        const ocrText = resp.ParsedResults[0].ParsedText;

        cell.ocrResult = ocrText;
      }

      console.log(`Processing logos for row: ${i} and column; ${c}`);
      let logoFilePath = path.resolve(
        __dirname,
        `${IMAGE_OUTPUT_DIR}/${IMAGE_NAME_PREFIX}-logo-${c}.jpg`
      );

      if (hasLogos && c <= N_LOGO!) {
        console.log(`Processing logo ${c} of ${N_LOGO}`);
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

  fs.copyFileSync(
    originalImage,
    path.join(OUTPUT_DIR, `/${path.basename(originalImage)}`)
  );
};

main();
