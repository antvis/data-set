const {
  expect
} = require('chai');
const DataSet = require('../../src/data-set');

describe('DataSet', () => {
  it('Constructor', () => {
    expect(DataSet).to.be.a('function');
    expect(new DataSet()).to.be.an('object');
  });
});
