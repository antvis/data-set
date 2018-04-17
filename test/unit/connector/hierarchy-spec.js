const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../src/index');
const flare = require('../../fixtures/flare.json');

describe('View.source(): hierarchy', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('hierarchy')).to.be.a('function');
    expect(getConnector('tree')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(flare, {
        type: 'hierarchy'
      });
    }).to.not.throw();
  });
});
