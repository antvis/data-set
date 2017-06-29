const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getConnector
} = require('../../../index');
const geoWorld = require('../../fixtures/countries-geo.json');

describe('DataView.source(): geojson', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
  });

  it('api', () => {
    expect(getConnector('geo')).to.be.a('function');
    expect(getConnector('geojson')).to.be.a('function');
    expect(getConnector('GeoJSON')).to.be.a('function');
  });

  it('geo', () => {
    dataView.source(geoWorld, {
      type: 'geo'
    });
  });
});
