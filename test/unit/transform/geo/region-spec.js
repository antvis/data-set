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
  const dataSet = new DataSet();
  let dataView;
  dataSet.createView('geo').source(geoWorld, {
    type: 'geo'
  });

  beforeEach(() => {
    dataView = dataSet.createView('test').source(data);
  });

  it('api', () => {
    expect(getTransform('geo.region')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.transform({
        type: 'geo.region'
      });
    }).to.throw();
    expect(() => {
      dataView.transform({
        type: 'geo.region',
        geoDataView: 'geo'
      });
    }).to.throw();
  });

  it('geo.region', () => {
    dataView.transform({
      type: 'geo.region',
      field: 'name',
      geoDataView: 'geo'
    });
    const rows = dataView.rows;
    expect(isArray(rows[0]._x)).to.be.true;
    expect(isArray(rows[0]._y)).to.be.true;
  });
});
