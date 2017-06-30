const {
  expect
} = require('chai');
const {
  DataSet,
  DataView,
  getTransform
} = require('../../../../index');
const geoWorld = require('../../../fixtures/countries-geo.json');

describe('DataView.transform(): geo.projection', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = new DataView(dataSet);
    dataView.source(geoWorld, {
      type: 'geo'
    });
  });

  it('api', () => {
    expect(getTransform('geo.projection')).to.be.a('function');
  });

  it('default', () => {
    dataView.transform({
      type: 'geo.projection',
      projection: 'geoAzimuthalEqualArea',
      as: [ '_x', '_y', 'centroid' ]
    });
  });
});
