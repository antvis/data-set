
const {
  expect
} = require('chai');
const DataSet = require('../../src/');
const ChinaGEO = require('../fixtures/china-geo.json');
const Provinces = require('../fixtures/china-provinces.json');

describe('max call stack when cloning options', () => {
  it('geo.region', () => {
    expect(() => {
      const ds = new DataSet();
      const chinaMap = ds.createView('map').source(ChinaGEO, {
        type: 'GeoJSON'
      });

      const dvData = ds.createView('data').source(Provinces);
      dvData.transform({
        type: 'geo.region',
        field: 'name',
        geoDataView: chinaMap,
        as: [ 'longitude', 'lantitude' ]
      });
    }).to.not.throw();
  });
});
