const {
  isNumber
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');
const geoWorld = require('../../../fixtures/countries-geo.json');

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

describe('DataView.transform(): geo.centroid', () => {
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
        geoDataView: 'geo'
      });
    }).to.throw();
  });

  it('geo.centroid', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoDataView: 'geo'
    });
    const rows = dv.rows;
    expect(isNumber(rows[0]._centroid_x)).to.be.true;
    expect(isNumber(rows[0]._centroid_y)).to.be.true;
  });

  // projected
  const geoDataView = ds.getView('geo');
  geoDataView.transform({
    type: 'geo.projection',
    projection: 'geoAiry'
  });

  it('geo.centroid: on a projected data view', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoDataView: 'geo'
    });
    const firstRow = dv.rows[0];
    const feature = geoDataView.geoFeatureByName(firstRow.name);
    expect(firstRow._centroid_x).to.equal(feature._centroid_x);
    expect(firstRow._centroid_y).to.equal(feature._centroid_y);
  });
});
