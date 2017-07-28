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

describe('DataView.transform(): geo.region', () => {
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
});
