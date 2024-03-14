import DataSet from '../../../src';
const { getTransform } = DataSet;
import populationChina from '../../fixtures/population-china.json';
import { View } from '../../../src/view';
import { subsetTransform } from '../../../src/transform/subset';

describe('View.transform(): subset', () => {
  DataSet.registerTransform('subset', subsetTransform);

  const ds = new DataSet();
  let dv: View;
  beforeEach(() => {
    dv = ds.createView().source(populationChina);
  });

  it('api', () => {
    expect(typeof getTransform('subset')).toBe('function');
  });

  it('default', () => {
    dv.transform({
      type: 'subset',
    });
    expect(dv.rows).toEqual(populationChina);
  });

  it('only specify endRowIndex', () => {
    dv.transform({
      type: 'subset',
      endRowIndex: 2,
    });
    expect(dv.rows.length).toEqual(3);
    expect(dv.getColumnNames().length).toEqual(2);
  });

  it('only specify startRowIndex', () => {
    dv.transform({
      type: 'subset',
      startRowIndex: 1,
    });
    expect(dv.rows.length).toEqual(populationChina.length - 1);
    expect(dv.getColumnNames().length).toEqual(2);
  });

  it('only specify columns', () => {
    dv.transform({
      type: 'subset',
      fields: ['year'],
    });
    expect(dv.rows.length).toEqual(populationChina.length);
    expect(dv.getColumnNames().length).toEqual(1);
  });

  it('specify all options', () => {
    dv.transform({
      type: 'subset',
      startRowIndex: 1,
      endRowIndex: 2,
      fields: ['year'],
    });
    expect(dv.rows.length).toEqual(2);
    expect(dv.getColumnNames().length).toEqual(1);
  });
});
