const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');
const geoWorld = require('../../../fixtures/countries-geo.json');

describe('DataView.transform(): geo.projection', () => {
  const dataSet = new DataSet();
  let dataView;

  beforeEach(() => {
    dataView = dataSet.createView('test');
  });

  it('api', () => {
    expect(getTransform('geo.projection')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.transform({
        type: 'geo.projection',
        projection: 'geoAiry',
        as: [ 'x', 'y', 'centroid' ]
      });
    }).to.throw();
    expect(() => {
      dataView.source(geoWorld, {
        type: 'geo'
      }).transform({
        type: 'geo.projection',
        as: [ 'x', 'y', 'centroid' ]
      });
    }).to.throw();
  });

  it('geo', () => {
    dataView.source(geoWorld, {
      type: 'geo'
    }).transform({
      type: 'geo.projection',
      projection: 'geoAiry',
      as: [ 'x', 'y', 'centroid' ]
    });
    const features = dataView.rows;
    const feature = features[0];
    expect(feature.x).to.exist;
    expect(feature.y).to.exist;
    expect(feature.centroid).to.exist;
    // console.log(feature)
  });
});
