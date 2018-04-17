const {
  expect
} = require('chai');
const {
  DataSet,
  getConnector
} = require('../../../src/index');
const geoWorld = require('../../fixtures/countries-geo.json');

describe('View.source(): geojson', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getConnector('geo')).to.be.a('function');
    expect(getConnector('geojson')).to.be.a('function');
    expect(getConnector('GeoJSON')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo'
      });
    }).to.not.throw();
  });
});
