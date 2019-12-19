import { map } from 'lodash';
import { expect } from 'chai';
import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';

describe('View.transform(): map', () => {
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(getTransform('map')).to.be.a('function');
  });

  it('default', () => {
    dv.transform({
      type: 'map',
    });
    expect(dv.rows.length).to.equal(populationChina.length);
  });

  it('callback', () => {
    dv.transform({
      type: 'map',
      callback(row) {
        return row.year; // origin data range: [2002, 2015]
      },
    });
    expect(dv.rows).to.eql(map(populationChina, (row) => row.year));
  });
});
