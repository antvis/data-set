const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../index');
const flare = require('../../fixtures/flare.json');

describe('DataView.source(): hierarchy', () => {
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
        type: 'geo'
      });
    }).to.not.throw();
  });
});
