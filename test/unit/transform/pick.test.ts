import { map, pick } from 'lodash';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { pickTransform } from '../../../src/transform/pick';

describe('View.transform(): pick', () => {
  DataSet.registerTransform('pick', pickTransform);
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(typeof getTransform('pick')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'pick',
    });
    expect(dv.rows).toEqual(populationChina);
  });

  it('fields', () => {
    dv.transform({
      type: 'pick',
      fields: ['year'],
    });
    expect(dv.rows).toEqual(map(populationChina, (row) => pick(row, ['year'])));
  });
});
