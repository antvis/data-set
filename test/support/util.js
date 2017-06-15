const isRenderer = require('is-electron-renderer');
const {
  remote
} = require('electron');
let fs;
let path;
if (isRenderer) {
  fs = remote.require('fs');
  path = remote.require('path');
} else {
  fs = require('fs');
  path = require('path');
}

module.exports = {
  readFileSync(pathname) {
    return fs.readFileSync(path.resolve(process.cwd(), pathname), 'utf8');
  }
}
