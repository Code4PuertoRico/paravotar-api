const fs = require("fs");
const path = require("path");
const _ = require('lodash');

const FILE_PATH = path.resolve(__dirname, "../output/papeletas.json");

const data = JSON.parse(fs.readFileSync(FILE_PATH));

const precints = data
  .slice(1)
  .map(town =>
    town.legislativas.reduce(
      (acum, curr) => ({
        ...acum,
        [curr.precinto]: { papeleta: curr.papeletaLink, pueblo: town.pueblo }
      }),
      {}
    )
  ).reduce((acum, curr) => {
    const key = Object.keys(curr)[0];
    return {
      ...acum,
      [key]: curr[key],
    }
  }, {});

fs.writeFileSync(path.resolve(__dirname, `../output/precints.json`), JSON.stringify(precints, null, 2));
