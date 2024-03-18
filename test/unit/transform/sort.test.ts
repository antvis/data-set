import { sortBy } from 'lodash';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { sortTransform } from '../../../src/transform/sort';
const data = populationChina.concat({
  year: '2001',
  population: '1274530000',
});

describe('View.transform(): sort', () => {
  DataSet.registerTransform('sort', sortTransform);

  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(typeof getTransform('sort')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort',
    });
    expect(dv.rows).toEqual(data.sort((a, b) => Number(a.year) - Number(b.year)));
  });

  it('callback', () => {
    dv.transform({
      type: 'sort',
      callback(a, b) {
        return a.year - b.year;
      },
    });
    expect(dv.rows).toEqual(sortBy(data, ['year']));
  });
});
