const DataSet = require('../../build/data-set');
const expect = require('chai').expect;

describe('Constructor', () => {
  it('DataSet', () => {
    expect(DataSet).to.be.a('function');
    expect(new DataSet()).to.be.an('object');
  });
});

