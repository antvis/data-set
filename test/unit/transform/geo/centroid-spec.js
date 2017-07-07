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
  const dataSet = new DataSet();
  let dataView;
  dataSet.createView('geo').source(geoWorld, {
    type: 'geo'
  });

  beforeEach(() => {
    dataView = dataSet.createView('test').source(data);
  });

  it('api', () => {
    expect(getTransform('geo.centroid')).to.be.a('function');
  });

  it('default', () => {
    expect(() => {
      dataView.transform({
        type: 'geo.centroid'
      });
    }).to.throw();
    expect(() => {
      dataView.transform({
        type: 'geo.centroid',
        geoDataView: 'geo'
      });
    }).to.throw();
  });

  it('geo.region', () => {
    dataView.transform({
      type: 'geo.centroid',
      field: 'name',
      geoDataView: 'geo'
    });
    const rows = dataView.rows;
    expect(isArray(rows[0]._centroid)).to.be.true;
  });
});
