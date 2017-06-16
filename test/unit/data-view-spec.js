const {
  expect
} = require('chai');
const DataSet = require('../../src/data-set');
const DataView = require('../../src/data-view');

describe('DataView', () => {
  it('Constructor', () => {
    expect(DataView).to.be.a('function');
    expect(new DataView(new DataSet())).to.be.an('object');
  });
});

