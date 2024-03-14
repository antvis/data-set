import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { mapTransform } from '../../../src/transform/map';
import { map } from 'lodash';

describe('View.transform(): map', () => {
  DataSet.registerTransform('map', mapTransform);
  const ds = new DataSet();
  let dv: View;

  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(typeof getTransform('map')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'map',
    });
    expect(dv.rows.length).toEqual(populationChina.length);
  });

  it('callback', () => {
    dv.transform({
      type: 'map',
      callback(row) {
        return row.year; // origin data range: [2002, 2015]
      },
    });
    expect(dv.rows).toEqual(map(populationChina, (row) => row.year));
  });
});
