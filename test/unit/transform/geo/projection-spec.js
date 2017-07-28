const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');
const geoWorld = require('../../../fixtures/countries-geo.json');

describe('DataView.transform(): geo.projection', () => {
  const ds = new DataSet();
  let dv;
  beforeEach(() => {
    dv = ds.createView();
  });

  it('api', () => {
    expect(getTransform('geo.projection')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'geo.projection',
        projection: 'geoAiry',
        as: [ 'x', 'y', 'centroid' ]
      });
    }).to.throw();
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo'
      }).transform({
        type: 'geo.projection',
        as: [ 'x', 'y', 'centroid' ]
      });
    }).to.throw();
  });

  it('geo', () => {
    dv.source(geoWorld, {
      type: 'geo'
    }).transform({
      type: 'geo.projection',
      projection: 'geoAiry',
      as: [ 'x', 'y', 'centroid' ]
    });
    const features = dv.rows;
    const feature = features[0];
    expect(feature.x).to.exist;
    expect(feature.y).to.exist;
    expect(feature.centroid).to.exist;
    // console.log(feature)
  });
});
