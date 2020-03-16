const fs = require('fs');
const path = require('path');
const FILE_PATH = path.join(__dirname, 'storage.json');

function get() {
  const file = fs.readFileSync(FILE_PATH, 'UTF-8');
  return JSON.parse(file);
}

function set(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'UTF-8');
}

module.exports = {
  get,
  set,
};
