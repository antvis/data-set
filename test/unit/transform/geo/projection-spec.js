const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');
const geoWorld = require('../../../fixtures/countries-geo.json');

describe('View.transform(): geo.projection', () => {
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
        as: [ 'x', 'y', 'centroidX', 'centroidY' ]
      });
    }).to.throw();
    expect(() => {
      dv.source(geoWorld, {
        type: 'geo'
      }).transform({
        type: 'geo.projection',
        as: [ 'x', 'y', 'centroidX', 'centroidY' ]
      });
    }).to.throw();
  });

  it('geo', () => {
    dv.source(geoWorld, {
      type: 'geo'
    }).transform({
      type: 'geo.projection',
      projection: 'geoAiry',
      as: [ 'x', 'y', 'centroidX', 'centroidY' ]
    });
    const features = dv.rows;
    const feature = features[0];
    expect(feature.x).to.exist;
    expect(feature.y).to.exist;
    expect(feature.centroidX).to.exist;
    expect(feature.centroidY).to.exist;
  });
});
