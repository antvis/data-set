const {
  isNumber
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../src/index');
const geoWorld = require('../../../fixtures/countries-geo.json');

describe('View.transform(): geo.centroid', () => {
  const data = [
    {
      name: 'Afghanistan',
      value: 4
    },
    {
      name: 'Angola',
      value: 5
    }
  ];
  const ds = new DataSet();
  let dv;
  ds.createView('geo').source(geoWorld, {
    type: 'geo'
  });

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('geo.centroid')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'geo.centroid'
      });
    }).to.throw();
    expect(() => {
      dv.transform({
        type: 'geo.centroid',
        geoView: 'geo'
      });
    }).to.throw();
  });

  it('geo.centroid', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoView: 'geo'
    });
    const rows = dv.rows;
    expect(isNumber(rows[0]._centroid_x)).to.be.true;
    expect(isNumber(rows[0]._centroid_y)).to.be.true;
  });

  // projected
  const geoView = ds.getView('geo');
  geoView.transform({
    type: 'geo.projection',
    projection: 'geoAiry'
  });

  it('geo.centroid: on a projected data view', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoView: 'geo'
    });
    const firstRow = dv.rows[0];
    const feature = geoView.geoFeatureByName(firstRow.name);
    expect(firstRow._centroid_x).to.equal(feature._centroid_x);
    expect(firstRow._centroid_y).to.equal(feature._centroid_y);
  });
});
