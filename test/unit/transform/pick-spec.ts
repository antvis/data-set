import { map, pick } from 'lodash';
import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';

describe('View.transform(): pick', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('pick')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'pick',
    });
    expect(dv.rows).to.eql(populationChina);
  });

  it('fields', () => {
    dv.transform({
      type: 'pick',
      fields: ['year'],
    });
    expect(dv.rows).to.eql(map(populationChina, (row) => pick(row, ['year'])));
  });
});
