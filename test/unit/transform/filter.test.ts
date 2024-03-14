import DataSet from '../../../src';
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { filterTransform } from '../../../src/transform/filter';

describe('transform:filter', () => {
  const ds = new DataSet();
  let dv: View;
  DataSet.registerTransform('filter', filterTransform);
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });
  it('api', () => {
    expect(typeof DataSet.getTransform('filter')).toBe('function');
  });
  it('default', () => {
    dv.transform({
      type: 'filter',
    });
    expect(dv.rows.length).toEqual(dv.origin.length);
  });

  it('callback', () => {
    dv.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2002'; // origin data range: [2002, 2015]
      },
    });
    expect(dv.rows.length).toEqual(dv.origin.length - 1);
  });

  test('empty condiction', () => {
    dv.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2100'; // origin data range: [2002, 2015]
      },
    });
    expect(dv.rows.length).toEqual(0);
  });
});
