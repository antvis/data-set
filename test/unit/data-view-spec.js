const DataView = require('../../build/data-set').DataView;
const expect = require('chai').expect;

describe('Constructor', () => {
  it('DataView', () => {
    expect(DataView).to.be.a('function');
    expect(new DataView()).to.be.an('object');
  });
});

