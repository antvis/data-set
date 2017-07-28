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

  it('geo.region', () => {
    dv.transform({
      type: 'geo.centroid',
      field: 'name',
      geoDataView: 'geo'
    });
    const rows = dv.rows;
    expect(isArray(rows[0]._centroid)).to.be.true;
  });
});
