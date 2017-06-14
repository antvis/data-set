const DataView = require('../../src/data-view');
const expect = require('chai').expect;

describe('DataView', () => {
  it('Constructor', () => {
    expect(DataView).to.be.a('function');
    expect(new DataView()).to.be.an('object');
  });
});

