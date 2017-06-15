const DataSet = require('../../src/data-set');
const DataView = require('../../src/data-view');
const expect = require('chai').expect;

describe('DataView', () => {
  it('Constructor', () => {
    expect(DataView).to.be.a('function');
    expect(new DataView(new DataSet())).to.be.an('object');
  });
});

