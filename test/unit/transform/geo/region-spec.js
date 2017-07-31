const {
  isArray
} = require('lodash');
const {
  expect
} = require('chai');
const {
  DataSet,
  getTransform
} = require('../../../../index');
const geoWorld = require('../../../fixtures/countries-geo.json');

describe('DataView.transform(): geo.region', () => {
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
    expect(getTransform('geo.region')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dv.transform({
        type: 'geo.region'
      });
    }).to.throw();
    expect(() => {
      dv.transform({
        type: 'geo.region',
        geoDataView: 'geo'
      });
    }).to.throw();
  });

  it('geo.region', () => {
    dv.transform({
      type: 'geo.region',
      field: 'name',
      geoDataView: 'geo'
    });
    const rows = dv.rows;
    expect(isArray(rows[0]._x)).to.be.true;
    expect(isArray(rows[0]._y)).to.be.true;
  });

  // projected
  const geoDataView = ds.getView('geo');
  geoDataView.transform({
    type: 'geo.projection',
    projection: 'geoAiry'
  });

  it('geo.region: on a projected data view', () => {
    dv.transform({
      type: 'geo.region',
      field: 'name',
      geoDataView: 'geo'
    });
    const firstRow = dv.rows[0];
    const feature = geoDataView.geoFeatureByName(firstRow.name);
    expect(firstRow._x).to.equal(feature._x);
    expect(firstRow._y).to.equal(feature._y);
  });
});
