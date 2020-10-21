const fs = require('fs');
const path = require('path');

const uppercaseFirst = (s) => {
  return `${s.charAt(0).toUpperCase()}${s.substr(1, s.length)}`
}

const folders = fs.readdirSync(path.resolve('./')).filter(f => f.includes('legislativa'))

const result = folders.map(f => {
  const split = f.split('-')
  let town;

  if (split.length === 4) {
    town = `${uppercaseFirst(split[0])} ${uppercaseFirst(split[1])}`
  } else {
    town = uppercaseFirst(split[0])
  }

  const precint = split[split.length - 1];

  return {
    label: `${town} - ${precint}`,
    value: precint,
  }
})

console.log(JSON.stringify(result, null, 2))
