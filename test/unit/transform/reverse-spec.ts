import { reverse } from 'lodash';
import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';

describe('View.transform(): reverse', () => {
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('reverse')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'reverse',
    });
    expect(dv.rows).to.eql(reverse(populationChina));
  });
});
