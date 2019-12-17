const {
  expect
} = require('chai');
const DataSet = require('../../lib/index');

describe('index', () => {
  it('DataSet', () => {
    expect('DataSet').to.be.a('string');
    expect(DataSet).to.be.a('function');
  });
});
