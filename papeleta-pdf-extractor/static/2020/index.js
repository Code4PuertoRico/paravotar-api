const fs = require('fs');

const originalFiles = fs.readdirSync('./').filter(f => f.endsWith('.jpg'));
const renamedFiles = originalFiles
  .map(f => f.substr(0, f.length - 9))
  .map(f => f + '.jpg');

originalFiles.forEach((f, index) => {
  fs.renameSync(`./${f}`, `./${renamedFiles[index]}`)
})
