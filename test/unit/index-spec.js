const expect = require('chai').expect;
const isRenderer = require('is-electron-renderer');
const DataSet = require('../../build/data-set');

describe('index', () => {
  it('DataSet', () => {
    expect('DataSet').to.be.a('string');
    expect(DataSet).to.be.a('function');
  });
});

after(() => {
  if (isRenderer && window.__coverage__) {
    const { remote } = require('electron');
    const fs = remote.require('fs');
    const path = remote.require('path');
    fs.writeFileSync(path.resolve(process.cwd(), './test/coverage/coverage.json'), JSON.stringify(window.__coverage__));
  }
});
