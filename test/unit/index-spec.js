const expect = require('chai').expect;
const isRenderer = require('is-electron-renderer');
const dataSet = require('../../build/data-set');

describe('sample', () => {
  it('dataSet', () => {
    expect('dataSet').to.be.a('string');
    expect(dataSet).to.be.an('object');
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
