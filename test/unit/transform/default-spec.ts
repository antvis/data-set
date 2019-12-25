import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';

describe('View.transform(): default', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform()).to.be.a('function');
    expect(getTransform('default')).to.be.a('function');
    expect(getTransform('this-transform-is-not-exists-xxx')).to.be.a('function');
  });

  it('default', () => {
    dv.transform();
    expect(dv.rows).to.eql(populationChina);
  });
});
