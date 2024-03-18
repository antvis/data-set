import DataSet from '../../src/';
import ChinaGEO from '../fixtures/china-geo.json';
import Provinces from '../fixtures/china-provinces.json';

describe('max call stack when cloning options', () => {
  it('geo.region', () => {
    expect(() => {
      const ds = new DataSet();
      const chinaMap = ds.createView('map').source(ChinaGEO, {
        type: 'GeoJSON',
      });

      const dvData = ds.createView('data').source(Provinces);
      dvData.transform({
        type: 'geo.region',
        field: 'name',
        geoDataView: chinaMap,
        as: ['longitude', 'lantitude'],
      });
    }).not.toThrow();
  });
});
