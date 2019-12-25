import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';

describe('View.transform(): filter', () => {
  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('filter')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'filter',
    });
    expect(dv.rows.length).to.equal(dv.origin.length);
  });

  it('callback', () => {
    dv.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2002'; // origin data range: [2002, 2015]
      },
    });
    expect(dv.rows.length).to.equal(dv.origin.length - 1);
  });

  it('empty condiction', () => {
    dv.transform({
      type: 'filter',
      callback(row) {
        return row.year > '2100'; // origin data range: [2002, 2015]
      },
    });
    expect(dv.rows.length).to.equal(0);
  });
});
