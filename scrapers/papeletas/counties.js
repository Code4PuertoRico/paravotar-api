const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const FILE_PATH = path.resolve(__dirname, "../output/papeletas.json");

const data = JSON.parse(fs.readFileSync(FILE_PATH));

const counties = data
  .slice(1)
  .map(town => ({ [town.pueblo]: town.municipalLink }))
  .reduce((acum, curr) => {
    const key = Object.keys(curr)[0];
    return {
      ...acum,
      [key]: curr[key]
    };
  }, {});

fs.writeFileSync(
  path.resolve(__dirname, `../output/counties.json`),
  JSON.stringify(counties, null, 2)
);
