const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../src/index');

describe('View.source(): geo-graticule', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('geo-graticule')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.source({
        type: 'geo-graticule'
      });
    }).to.not.throw();
  });
});
