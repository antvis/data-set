import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { defaultTransform } from '../../../src/transform/default';

describe('View.transform(): default', () => {
  const ds = new DataSet();
  let dv: View;
  DataSet.registerTransform('default', defaultTransform);
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(typeof getTransform()).toBe('function');
    expect(typeof getTransform('default')).toBe('function');
    expect(typeof getTransform('this-transform-is-not-exists-xxx')).toBe('function');
  });

  it('default', () => {
    dv.transform();
    expect(dv.rows).toEqual(populationChina);
  });
});
