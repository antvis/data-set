import { reverse, sortBy } from 'lodash';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { sortByTransform } from '../../../src/transform/sort-by';
const data = populationChina.concat({
  year: '2001',
  population: '1274530000',
});

describe('View.transform(): sort-by', () => {
  DataSet.registerTransform('sort-by', sortByTransform);
  DataSet.registerTransform('sortBy', sortByTransform);
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('sort-by')).toBe('function');
    expect(typeof getTransform('sortBy')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort-by',
    });
    expect(dv.rows).toEqual(data.sort((a, b) => Number(a.year) - Number(b.year)));
  });

  it('specify columns', () => {
    dv.transform({
      type: 'sort-by',
      fields: ['year'],
    });
    expect(dv.rows).toEqual(sortBy(data, ['year']));
  });

  it('specify order', () => {
    dv.transform({
      type: 'sort-by',
      fields: ['year'],
      order: 'DESC',
    });
    expect(dv.rows).toEqual(reverse(sortBy(data, ['year'])));
  });
});
