import { reverse } from 'lodash';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { reverseTransform } from '../../../src/transform/reverse';

describe('View.transform(): reverse', () => {
  DataSet.registerTransform('reverse', reverseTransform);

  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(typeof getTransform('reverse')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'reverse',
    });
    expect(dv.rows).toEqual(reverse(populationChina));
  });
});
