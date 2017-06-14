const DataSet = require('../../build/data-set');
const expect = require('chai').expect;

describe('DataSet', () => {
  it('Constructor', () => {
    expect(DataSet).to.be.a('function');
    expect(new DataSet()).to.be.an('object');
  });
});
