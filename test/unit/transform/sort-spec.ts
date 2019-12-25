import { sortBy } from 'lodash';
import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
const data = populationChina.concat({
  year: '2001',
  population: '1274530000',
});

describe('View.transform(): sort', () => {
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(data);
  });

  it('api', () => {
    expect(getTransform('sort')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'sort',
    });
    expect(dv.rows).to.eql(data.sort((a, b) => a.year - b.year));
  });

  it('callback', () => {
    dv.transform({
      type: 'sort',
      callback(a, b) {
        return a.year - b.year;
      },
    });
    expect(dv.rows).to.eql(sortBy(data, ['year']));
  });
});
